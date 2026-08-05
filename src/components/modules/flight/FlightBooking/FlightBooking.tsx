"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

const PASSENGER_TYPE_MAP: Record<string, string> = {
  adult: "ADT",
  child: "C07",
  kid: "C03",
  infant: "INF",
};

const TYPE_LABEL: Record<string, string> = {
  adult: "Adult",
  child: "Child",
  kid: "Kid",
  infant: "Infant",
};

const LeadPassengerPrefill: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<BookingFormValues>();
  const { user } = useAuthStore();
  const geo = useCurrencyStore((s) => s.geo);
  const applied = useRef(false);

  useEffect(() => {
    const lead = values.adult?.[0];
    const country = geo?.countryCode;
    if ((!user && !country) || !lead || applied.current) return;
    const patch: Partial<Passenger> = {};
    if (!lead.firstname && user?.first_name) patch.firstname = user.first_name;
    if (!lead.lastname && user?.last_name) patch.lastname = user.last_name;
    if (!lead.email && user?.email) patch.email = user.email;
    if (!lead.phone && user?.phone) patch.phone = user.phone;
    if (!lead.country && country) patch.country = country;
    if (Object.keys(patch).length > 0) {
      Object.entries(patch).forEach(([key, val]) =>
        setFieldValue(`adult.0.${key}`, val),
      );
    }

    (["adult", "child", "kid", "infant"] as const).forEach((type) => {
      values[type].forEach((p, i) => {
        if (!p.country && country) {
          setFieldValue(`${type}.${i}.country`, country);
        }
      });
    });

    applied.current = true;
  }, [user, geo, values.adult, setFieldValue]);

  return null;
};

const validateBooking = (values: BookingFormValues) => {
  const errors: Record<string, string> = {};

  (["adult", "child", "kid", "infant"] as const).forEach((type) => {
    values[type].forEach((p, index) => {
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

      if (!p.country) errors[`${base}.country`] = `${label} country is required`;
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

  const buildSegments = (itin: Itinerary): BookingSegment[] => {
    return itin.flightDetails.flatMap((fd) =>
      fd.schedules.map((s) => ({
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
  ): RevalidateItineraryPayload => {
    const sale = itin.saleCurrencyAmount;
    return {
      tripType: searchInfoParams.get("tripType") || "oneway",
      from:
        searchInfoParams.get("from") ||
        itin.flightDetails[0]?.schedules[0]?.departure.airport ||
        "",
      to:
        searchInfoParams.get("to") ||
        itin.flightDetails[0]?.schedules[0]?.arrival.airport ||
        "",
      noOfAdult: Number(searchInfoParams.get("adult") || 1),
      noOfChildren: Number(searchInfoParams.get("child") || 0),
      noOfKids: Number(searchInfoParams.get("kid") || 0),
      noOfInfant: Number(searchInfoParams.get("infant") || 0),
      itinDetail: { flightDetails: itin.flightDetails },
      passengerFareBreakDown: itin.passengerFareBreakDown,
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
    if (!itinerary) {
      message.error("Selected flight could not be found. Please search again.");
      return;
    }

    const allPassengers: BookingPassenger[] = [];
    (["adult", "child", "kid", "infant"] as const).forEach((type) => {
      values[type].forEach((p) => {
        const age = calculateAge(p.date_of_birth);
        const typeCode =
          type === "child" || type === "kid"
            ? getPassengerTypeByAge(age)
            : PASSENGER_TYPE_MAP[type];
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
      email: values.adult[0]?.email,
      phone: values.adult[0]?.phone,
    };

    setIsBooking(true);
    try {
      const revalidateResult = await revalidateItineraryAction(
        buildRevalidatePayload(itinerary),
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
        message.success(result.message || "Flight booked successfully");
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
    <div className="max-w-[1600px] mx-auto p-10">
      <SearchCountdown
          expiresAt={expiresAt}
          onExpire={() => setSearchExpired(true)}
        />
      

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
            { n: values.adult.length, label: "Adult" },
            { n: values.child.length, label: "Child" },
            { n: values.kid.length, label: "Kid" },
            { n: values.infant.length, label: "Infant" },
          ].filter((t) => t.n > 0);

          const total =
            itinerary.saleCurrencyAmount?.offerAmount ??
            itinerary.saleCurrencyAmount?.totalAmount ??
            itinerary.saleCurrencyAmount?.baseAmount ??
            0;

          const passengerCount = {
            adult: Number(searchInfoParams.get("adult") || 0),
            child: Number(searchInfoParams.get("child") || 0),
            kid: Number(searchInfoParams.get("kid") || 0),
            infant: Number(searchInfoParams.get("infant") || 0),
          };

          return (
            <Form>
              <LeadPassengerPrefill />

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
                <div className="lg:col-span-2">
                  <TravelersForm />
                </div>

                <aside className="space-y-5 lg:sticky lg:top-6">
                  <FlightCard
                    itinerary={itinerary}
                    index={itineraryIndex}
                    searchId={searchId}
                    passengerCount={passengerCount}
                  />

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-xs text-gray-400">
                      {travelerSummary
                        .map(
                          (t) => `${t.n} ${t.label}${t.n > 1 ? "s" : ""}`,
                        )
                        .join(", ")}
                    </p>
                    <p className="mt-1 text-xl font-bold text-gray-900">
                      BDT{" "}
                      {total.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <label className="mt-4 flex items-start gap-2 text-xs text-gray-600">
                      <input
                        type="checkbox"
                        name="acceptedTerms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-red-600"
                      />
                      <span>
                        I agree to the{" "}
                        <a
                          href="/terms-and-conditions"
                          target="_blank"
                          className="font-medium text-primary hover:underline"
                        >
                          NEC Travels terms and conditions
                        </a>
                        .
                      </span>
                    </label>
                    <Button
                      type="submit"
                      className={`mt-4 w-full h-12! text-base! ${
                        isBooking || !user || searchExpired || !acceptedTerms
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={
                        isBooking || !user || searchExpired || !acceptedTerms
                      }
                      title={
                        searchExpired
                          ? "Search session expired. Please search again"
                          : !user
                            ? "Please sign in to book"
                            : !acceptedTerms
                              ? "Please accept the terms and conditions"
                              : undefined
                      }
                    >
                      {isBooking ? "Booking..." : "Submit Booking"}
                    </Button>
                    {!user && (
                      <p className="mt-2 text-center text-xs text-gray-400">
                        Please sign in to place your booking
                      </p>
                    )}
                    {searchExpired && (
                      <p className="mt-2 text-center text-xs text-red-500">
                        Your search session has expired. Please search again.
                      </p>
                    )}
                    <Button
                      type="button"
                      variant="secondary"
                      className="mt-2 w-full h-12! text-base!"
                      onClick={() => router.back()}
                    >
                      Back to Search
                    </Button>
                  </div>
                </aside>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default FlightBooking;