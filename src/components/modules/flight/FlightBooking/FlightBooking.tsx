"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form, useFormikContext } from "formik";
import { App } from "antd";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { decoding } from "../../../../utils";
import { Button } from "../../../ui";
import type { BookingFormValues, Passenger } from "@/interface";
import type {
  BookingPassenger,
  BookingSegment,
  FlightBookingResponseData,
  Itinerary,
  LeadPassenger,
  RevalidateItineraryPayload,
} from "@/interface/flight";
import TravelersForm from "../Booking/TravelersForm";
import BookingSuccess from "../Booking/BookingSuccess";
import BookingPageSkeleton from "./BookingPageSkeleton";
import FlightSummaryCard from "./FlightSummaryCard";
import BookingPreviewModal from "./BookingPreviewModal";
import { ROLE } from "@/constant/enum/role";
import { createPassengers } from "@/utils/createPassengers";
import {
  AGE_RANGES,
  calculateAge,
  getPassengerTypeByAge,
} from "@/utils/passengerAge";
import {
  searchFlightAction,
  revalidateItineraryAction,
  bookFlightAction,
} from "@/actions/flight.action";
import { useAuthStore } from "@/store/auth.store";
import { useCurrencyStore } from "@/store/currency.store";
import SearchCountdown from "../Card/SearchCountdown";
import FlightCard from "../Card/FlightCard";
import { getSearchExpiry } from "@/utils/searchCountdown";
import { FaArrowLeft, FaEye } from "react-icons/fa";

const TYPE_LABEL: Record<string, string> = {
  adult: "Adult",
  child: "Child",
  kid: "Kid",
  infant: "Infant",
};

// Passenger type keys used throughout — single source of truth so we never
// destructure a key that doesn't exist on `values`.
const PASSENGER_TYPES = ["adult", "child", "kid", "infant"] as const;
type PassengerTypeKey = (typeof PASSENGER_TYPES)[number];

/** Safely read a passenger array off form values, defaulting to []. */
const safeList = (
  values: BookingFormValues | undefined,
  type: PassengerTypeKey,
): Passenger[] => values?.[type] ?? [];

const LeadPassengerPrefill: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<BookingFormValues>();
  const { user } = useAuthStore();
  const geo = useCurrencyStore((s) => s.geo);
  const applied = useRef(false);

  useEffect(() => {
    const lead = safeList(values, "adult")[0];
    const country = geo?.countryCode;
    if ((!user && !country) || !lead || applied.current) return;

    const patch: Partial<Passenger> = {};
    const isB2C = user?.role === ROLE.B2C;
    if (isB2C) {
      if (!lead.firstname && user?.first_name) patch.firstname = user.first_name;
      if (!lead.lastname && user?.last_name) patch.lastname = user.last_name;
      if (!lead.email && user?.email) patch.email = user.email;
    }
    if (!lead.country && country) patch.country = country;

    if (Object.keys(patch).length > 0) {
      Object.entries(patch).forEach(([key, val]) =>
        setFieldValue(`adult.0.${key}`, val),
      );
    }

    PASSENGER_TYPES.forEach((type) => {
      safeList(values, type).forEach((p, i) => {
        if (!p.country && country) {
          setFieldValue(`${type}.${i}.country`, country);
        }
      });
    });

    applied.current = true;
  }, [user, geo, values, setFieldValue]);

  return null;
};

const validateBooking = (values: BookingFormValues) => {
  const errors: Record<string, string> = {};

  PASSENGER_TYPES.forEach((type) => {
    safeList(values, type).forEach((p, index) => {
      const base = `${type}.${index}`;
      const label = TYPE_LABEL[type];
      const age = calculateAge(p.date_of_birth);
      const range = AGE_RANGES[type];

      if (!p.title) errors[`${base}.title`] = `${label} title is required`;
      if (!p.firstname)
        errors[`${base}.firstname`] = `${label} first name is required`;
      if (!p.lastname)
        errors[`${base}.lastname`] = `${label} last name is required`;
      if (!p.gender) errors[`${base}.gender`] = `${label} gender is required`;

      if (!p.date_of_birth) {
        errors[`${base}.date_of_birth`] = "Date of birth is required";
      } else if (age !== null && age < 0) {
        errors[`${base}.date_of_birth`] =
          "Date of birth cannot be in the future";
      } else if (range.min !== null && age !== null && age < range.min) {
        errors[`${base}.date_of_birth`] =
          `${label} must be at least ${range.min} years old`;
      } else if (range.max !== null && age !== null && age > range.max) {
        errors[`${base}.date_of_birth`] =
          `${label} must be at most ${range.max} years old`;
      }

      if (type === "adult" && index === 0 && age !== null && age < 18) {
        errors[`${base}.date_of_birth`] =
          "Lead passenger must be 18 years or older";
      }

      if (!p.country)
        errors[`${base}.country`] = `${label} country is required`;
      if (!p.passport_number)
        errors[`${base}.passport_number`] = "Passport number is required";
      if (!p.passport_expire)
        errors[`${base}.passport_expire`] = "Passport expiry is required";

      if (type === "adult" && index === 0) {
        if (!p.email) {
          errors[`${base}.email`] = "Email is required";
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) {
          errors[`${base}.email`] = "Enter a valid email address";
        }
        if (!p.phone) errors[`${base}.phone`] = "Phone number is required";
      }
    });
  });

  return errors;
};

const buildSearchPayload = (searchInfoParams: URLSearchParams) => {
  const tripType = searchInfoParams.get("tripType");
  if (!tripType) return null;

  const adult = Number(searchInfoParams.get("adult") || 1);
  const child = Number(searchInfoParams.get("child") || 0);
  const kid = Number(searchInfoParams.get("kid") || 0);
  const infant = Number(searchInfoParams.get("infant") || 0);
  const flight_class = (
    searchInfoParams.get("cabin") || "economy"
  ).toLowerCase();

  if (tripType === "multicity") {
    const segmentsStr = searchInfoParams.get("segments");
    const segments =
      segmentsStr?.split(",").map((seg) => {
        const parts = seg.split("-");
        const from = parts[0];
        const to = parts[1];
        const start_date = parts.slice(2).join("-");
        return { from, to, start_date };
      }) || [];
    return {
      flight: "multicity" as const,
      no_of_adult: adult,
      no_of_children: child,
      no_of_kids: kid,
      no_of_infant: infant,
      flight_class,
      segments,
    };
  }

  if (tripType === "roundtrip") {
    return {
      flight: "roundtrip" as const,
      from: searchInfoParams.get("from") || "",
      to: searchInfoParams.get("to") || "",
      start_date: searchInfoParams.get("date") || "",
      return_date: searchInfoParams.get("returnDate") || "",
      no_of_adult: adult,
      no_of_children: child,
      no_of_kids: kid,
      no_of_infant: infant,
      flight_class,
    };
  }

  return {
    flight: "oneway" as const,
    from: searchInfoParams.get("from") || "",
    to: searchInfoParams.get("to") || "",
    start_date: searchInfoParams.get("date") || "",
    no_of_adult: adult,
    no_of_children: child,
    no_of_kids: kid,
    no_of_infant: infant,
    flight_class,
  };
};

const FlightBooking: React.FC = () => {
  const searchParamsHook = useSearchParams();
  const router = useRouter();
  const [isBooking, setIsBooking] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [searchExpired, setSearchExpired] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    booking: FlightBookingResponseData;
    segments: BookingSegment[];
    passengers: BookingPassenger[];
    leadPassenger: LeadPassenger;
    total: number;
  } | null>(null);
  const { user } = useAuthStore();
  const { message } = App.useApp();

  const searchParams = useMemo(() => {
    return new URLSearchParams(searchParamsHook.toString());
  }, [searchParamsHook]);

  const searchInfoParams = useMemo(() => {
    const q = searchParams.get("q");
    return q
      ? new URLSearchParams(decoding(q) as string)
      : new URLSearchParams();
  }, [searchParams]);

  const itineraryIndex = Number(searchParams.get("i") ?? 0);
  const searchId = searchParams.get("sid") ?? "";

  const searchPayload = useMemo(
    () => buildSearchPayload(searchInfoParams),
    [searchInfoParams],
  );

  const { data: searchData, isPending: isSearching } = useQuery({
    queryKey: ["flight-booking-search", searchParamsHook.toString()],
    queryFn: () => searchFlightAction(searchPayload!),
    enabled: !!searchPayload,
  });

  const expiresAt = useMemo(() => {
    const stored = getSearchExpiry(searchId);
    return stored ?? searchData?.data?.expiresAt;
  }, [searchId, searchData]);

  useEffect(() => {
    if (!searchExpired) return;
    Swal.fire({
      title: "Search Session Expired",
      html: "Your 30 minute booking window has expired. To confirm your booking at the latest price and availability, please search again.",
      icon: "warning",
      confirmButtonText: "Search Again",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      customClass: {
        confirmButton: "!bg-primary",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setSearchExpired(false);
        const query = new URLSearchParams(searchParamsHook.toString());
        query.delete("i");
        query.delete("sid");
        const searchUrl = query.toString()
          ? `/flight-search?${query.toString()}`
          : "/";
        if (typeof window !== "undefined") {
          window.location.href = searchUrl;
        }
      }
    });
  }, [searchExpired, searchParamsHook]);

  const itinerary = searchData?.data?.itinDetails?.[itineraryIndex];

  const isB2C = user?.role === ROLE.B2C;
  const isB2B = user?.role === ROLE.B2B;
  const canConfirmBooking = !!user && (isB2C || isB2B);

  const handleBack = () => {
    const query = new URLSearchParams(searchParamsHook.toString());
    query.delete("i");
    query.delete("sid");
    if (typeof window !== "undefined") {
      window.location.href = query.toString()
        ? `/flight-search?${query.toString()}`
        : "/flight-search";
    }
  };

  const initialValues: BookingFormValues = useMemo(() => {
    const adultCount = Number(searchInfoParams.get("adult") ?? 0);
    return {
      tripType: searchInfoParams.get("tripType"),
      cabin: searchInfoParams.get("cabin"),
      adult: createPassengers(adultCount),
      child: createPassengers(Number(searchInfoParams.get("child") ?? 0)),
      kid: createPassengers(Number(searchInfoParams.get("kid") ?? 0)),
      infant: createPassengers(Number(searchInfoParams.get("infant") ?? 0)),
    };
  }, [searchInfoParams]);

  /** Guards against itineraries missing flightDetails/schedules (undefined.length / undefined.map). */
  const buildSegments = (itin: Itinerary | undefined): BookingSegment[] => {
    if (!itin?.flightDetails) return [];
    return itin.flightDetails.flatMap((fd) =>
      (fd.schedules ?? []).map((s) => ({
        origin: s.departure.airport,
        destination: s.arrival.airport,
        departure_date_time: s.departureDateTime,
        arrival_date_time: s.arrivalDateTime,
        flight_number: String(s.marketingFlightNumber),
        carrier_code: s.marketingCarrierCode,
        res_book_desig_code: s.bookingCode,
      })),
    );
  };

  const buildRevalidatePayload = (
    itin: Itinerary,
    values: BookingFormValues,
  ): RevalidateItineraryPayload => {
    const sale = itin.saleCurrencyAmount;
    const flightDetails = (itin.flightDetails ?? []).map((detail) => ({
      elapsedTime: detail.elapsedTime,
      schedules: (detail.schedules ?? []).map((s) => ({
        flightName: s.flightName,
        bookingCode: s.bookingCode,
        cabinCode: s.cabinCode,
        seatsAvailable: s.seatsAvailable,
        marketingCarrierCode: s.marketingCarrierCode,
        operatingCarrierCode: s.operatingCarrierCode,
        marketingFlightNumber: s.marketingFlightNumber,
        frequency: s.frequency,
        stopCount: s.stopCount,
        isQuoteSharedFlight: s.isQuoteSharedFlight,
        airCraftType: s.airCraftType,
        airCraftTypeForFirstLeg: s.airCraftTypeForFirstLeg,
        airCraftTypeForLastLeg: s.airCraftTypeForLastLeg,
        departure: s.departure,
        arrival: s.arrival,
        totalMilesFlown: s.totalMilesFlown,
        departureDateTime: s.departureDateTime,
        arrivalDateTime: s.arrivalDateTime,
      })),
    }));
    const fareBreakDown = itin.passengerFareBreakDown ?? [];

    return {
      tripType: searchInfoParams.get("tripType") || "oneway",
      from:
        searchInfoParams.get("from") ||
        itin.flightDetails?.[0]?.schedules?.[0]?.departure.airport ||
        "",
      to:
        searchInfoParams.get("to") ||
        itin.flightDetails?.[0]?.schedules?.[0]?.arrival.airport ||
        "",
      noOfAdult: safeList(values, "adult").length,
      noOfChildren: safeList(values, "child").length,
      noOfKids: safeList(values, "kid").length,
      noOfInfant: safeList(values, "infant").length,
      itinDetail: { flightDetails },
      passengerFareBreakDown: fareBreakDown,
      saleCurrencyAmount: {
        totalAmount:
          sale?.offerAmount ?? sale?.totalAmount ?? sale?.baseAmount ?? 0,
        baseAmount: sale?.baseAmount ?? 0,
        discountAmount: sale?.discountAmount ?? 0,
        taxFare: sale?.taxFare ?? 0,
      },
      searchId,
    };
  };

  const toBookingPassenger = (
    p: Passenger,
    passenger_type: string,
  ): BookingPassenger => ({
    title: p.title,
    firstname: p.firstname,
    lastname: p.lastname,
    gender: p.gender,
    date_of_birth: p.date_of_birth,
    country: p.country,
    passport_number: p.passport_number,
    passport_expire: p.passport_expire,
    passenger_type,
  });

  const handleSubmit = async (values: BookingFormValues) => {
    if (searchExpired) {
      message.warning("Your search session has expired. Please search again.");
      return;
    }
    if (!user || !(user.role === ROLE.B2C || user.role === ROLE.B2B)) {
      message.warning(
        "Only B2C and B2B accounts can confirm a booking. Please sign in.",
      );
      return;
    }
    if (!itinerary) {
      message.error("Selected flight could not be found. Please search again.");
      return;
    }

    const allPassengers: BookingPassenger[] = [];
    PASSENGER_TYPES.forEach((type) => {
      safeList(values, type).forEach((p) => {
        const age = calculateAge(p.date_of_birth);
        const typeCode = getPassengerTypeByAge(age);
        allPassengers.push(toBookingPassenger(p, typeCode));
      });
    });

    const [leadPassenger, ...passengers] = allPassengers;
    if (!leadPassenger) {
      message.error("Please add at least one passenger.");
      return;
    }
    const leadPassengerWithContact: LeadPassenger = {
      ...leadPassenger,
      email: safeList(values, "adult")[0]?.email,
      phone: safeList(values, "adult")[0]?.phone,
    };

    setIsBooking(true);
    try {
      const revalidateResult = await revalidateItineraryAction(
        buildRevalidatePayload(itinerary, values),
      );
      if (!revalidateResult.success || !revalidateResult.data?.quoteId) {
        message.error(
          revalidateResult.message ||
            "Could not revalidate itinerary. Please try again.",
        );
        return;
      }

      const quoteId = revalidateResult.data.quoteId;
      const revalidatedItinerary =
        revalidateResult.data.itineraries?.[0] ?? itinerary;
      const segmentsItinerary = Array.isArray(
        revalidatedItinerary?.flightDetails,
      )
        ? revalidatedItinerary
        : itinerary;

      const payload = {
        quoteId,
        lead_passenger: leadPassengerWithContact,
        passengers,
        segments: buildSegments(segmentsItinerary),
        payment_type: "CASH",
        provider: "sb",
      };

      const result = await bookFlightAction(payload);
      if (result.success) {
        const total =
          itinerary.saleCurrencyAmount?.offerAmount ??
          itinerary.saleCurrencyAmount?.totalAmount ??
          itinerary.saleCurrencyAmount?.baseAmount ??
          0;
        setBookingResult({
          booking: result.data,
          segments: buildSegments(segmentsItinerary),
          passengers,
          leadPassenger: leadPassengerWithContact,
          total,
        });
        message.success("Flight booked successfully");
      } else {
        message.error(result.message || "Booking failed");
      }
    } catch (error: any) {
      console.error("Booking error:", error?.response?.data || error);
      const msg = Array.isArray(error?.response?.data?.message)
        ? error.response.data.message.join(", ")
        : error?.response?.data?.message ||
          error?.message ||
          "Booking failed. Please try again.";
      message.error(msg);
    } finally {
      setIsBooking(false);
    }
  };

  if (isSearching) {
    return <BookingPageSkeleton />;
  }

  if (bookingResult) {
    return (
      <BookingSuccess
        booking={bookingResult.booking}
        segments={bookingResult.segments}
        passengers={bookingResult.passengers}
        leadPassenger={bookingResult.leadPassenger}
        total={bookingResult.total}
      />
    );
  }

  if (!itinerary) {
    return (
      <div className="text-center py-10 text-gray-500 text-sm">
        Selected flight could not be found. Please go back and search again.
      </div>
    );
  }

  return (
    <div className="">
      {/* Top bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-brand hover:text-brand"
          >
            <FaArrowLeft className="text-xs" />
            Back to Results
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">
              Complete Your Booking
            </h1>
            <p className="text-xs text-gray-500 lg:text-sm">
              Please review your flight details and traveler information
            </p>
          </div>
        </div>
        <SearchCountdown
          expiresAt={expiresAt}
          onExpire={() => setSearchExpired(true)}
        />
      </div>

      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validate={validateBooking}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({ values }) => {
          const travelerSummary = [
            { n: safeList(values, "adult").length, label: "Adult" },
            { n: safeList(values, "child").length, label: "Child" },
            { n: safeList(values, "kid").length, label: "Kid" },
            { n: safeList(values, "infant").length, label: "Infant" },
          ].filter((t) => t.n > 0);

          return (
            <Form>
              <LeadPassengerPrefill />

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
                <div className="space-y-6 lg:col-span-2">
                  <TravelersForm />
                </div>

                <aside className="space-y-5 lg:sticky lg:top-6">
                  <FlightSummaryCard
                    itinerary={itinerary}
                    travelerSummary={travelerSummary}
                  />

                  {/* Action buttons */}
                  <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-brand bg-brand-light px-4 py-3 text-sm font-bold text-brand transition-colors hover:bg-brand hover:text-white"
                    >
                      <FaEye className="text-sm" />
                      Preview Booking
                    </button>

                    {/* Terms agreement */}
                    <label
                      htmlFor="terms-agreement"
                      className="flex cursor-pointer items-start gap-2.5 rounded-lg bg-gray-50 px-3.5 py-3"
                    >
                      <input
                        id="terms-agreement"
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand"
                      />
                      <span className="text-xs leading-relaxed text-gray-600">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          target="_blank"
                          className="font-semibold text-brand underline underline-offset-2"
                        >
                          NEC Travels terms and conditions
                        </Link>
                      </span>
                    </label>

                    {!canConfirmBooking ? (
                      <div className="rounded-lg bg-gray-50 px-4 py-3 text-center text-xs font-medium text-gray-600">
                        Booking confirmation is only available for B2C and B2B
                        accounts. Please sign in with a B2C or B2B account to
                        complete your booking.
                      </div>
                    ) : (
                      <Button
                        type="submit"
                        disabled={!acceptedTerms}
                        isLoading={isBooking}
                        className="w-full py-3 !text-sm"
                      >
                        {acceptedTerms
                          ? "Confirm & Submit"
                          : "Accept terms to continue"}
                      </Button>
                    )}
                  </div>
                </aside>
              </div>

              <BookingPreviewModal
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                itinerary={itinerary}
                values={values}
              />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default FlightBooking;