"use client"; // 1. Next.js 16 Client Component Boundary

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
// 2. Swapped React Router hook with Next.js Navigation hook
import { useSearchParams } from "next/navigation";
import { Formik, Form, useFormikContext } from "formik";
import { App } from "antd";
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
import BookingFlightInfo from "../Booking/BookingFlightInfo";
import SearchDetails from "../Card/SearchDetails";
import BookingPageSkeleton from "./BookingPageSkeleton";
import SignIn from "@/app/(commonLayout)/(authLayout)/auth/_components/SignIn/SignIn";
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

// Fills the lead traveler contact/name and every passenger's country from the
// logged-in user / detected geo without resetting the Formik form (initialValues
// stays stable on login/logout).
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
        const [from, to, start_date] = seg.split("-");
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
  // 3. Read search parameters natively
  const searchParamsHook = useSearchParams();
  const [isBooking, setIsBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    booking: FlightBookingResponseData;
    segments: BookingSegment[];
    passengers: BookingPassenger[];
    leadPassenger: LeadPassenger;
    total: number;
  } | null>(null);
  const { user } = useAuthStore();
  const { message } = App.useApp();

  // Re-creates the URLSearchParams instance dynamically from Next.js searchParams hook
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
        totalAmount: sale?.offerAmount ?? sale?.totalAmount ?? sale?.baseAmount ?? 0,
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
    includeContact: boolean,
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
    ...(includeContact ? { email: p.email, phone: p.phone } : {}),
  });

  const handleSubmit = async (values: BookingFormValues) => {
    if (!itinerary) {
      message.error("Selected flight could not be found. Please search again.");
      return;
    }

    // const passengers: BookingPassenger[] = [];
    // (["adult", "child", "kid", "infant"] as const).forEach((type) => {
    //   values[type].forEach((p) => {
    //     passengers.push(
    //       toBookingPassenger(p, PASSENGER_TYPE_MAP[type], false),
    //     );
    //   });
    // });

    // const leadPassenger = passengers[0];
    // if (!leadPassenger) {
    //   message.error("Please add at least one passenger.");
    //   return;
    // }
    // const leadPassengerWithContact: LeadPassenger = {
    //   ...leadPassenger,
    //   email: values.adult[0]?.email,
    //   phone: values.adult[0]?.phone,
    // };

    const allPassengers: BookingPassenger[] = [];
    (["adult", "child", "kid", "infant"] as const).forEach((type) => {
      values[type].forEach((p) => {
        const age = calculateAge(p.date_of_birth);
        const typeCode =
          type === "child" || type === "kid"
            ? getPassengerTypeByAge(age)
            : PASSENGER_TYPE_MAP[type];
        allPassengers.push(toBookingPassenger(p, typeCode, false));
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
      // console.log("itinerary response:", itinerary);
      // console.log("Revalidate response:", revalidateResult);
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

      console.log("Booking payload:", payload);
      const result = await bookFlightAction(payload);
      console.log("Booking response:", result);
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
      <h1 className="text-xl font-semibold mb-4">Flight Booking</h1>

      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validate={validateBooking}
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
                {/* LEFT: passenger info fields */}
                <div className="lg:col-span-2">
                  <TravelersForm />
                </div>

                {/* RIGHT: login + flight info + submit */}
                <aside className="space-y-5 lg:sticky lg:top-6">
                  {!user ? (
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                      <SignIn noRedirect compact />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <FaUser />
                      </span>
                      <div>
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {user.first_name || user.full_name || "Traveler"}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
                      Your Trip
                    </p>
                    <BookingFlightInfo itinerary={itinerary} />
                  </div>

                  <SearchDetails
                    itinerary={itinerary}
                    passengerCount={passengerCount}
                  />

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-xs text-gray-400">
                      {travelerSummary
                        .map(
                          (t) =>
                            `${t.n} ${t.label}${t.n > 1 ? "s" : ""}`,
                        )
                        .join(", ")}
                    </p>
                    <p className="mt-1 text-xl font-bold text-gray-900">
                      BDT{" "}
                      {total.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <Button
                      type="submit"
                      className={`mt-4 w-full !h-12 !text-base ${
                        isBooking || !user
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={isBooking || !user}
                      title={!user ? "Please sign in to book" : undefined}
                    >
                      {isBooking ? "Booking..." : "Submit Booking"}
                    </Button>
                    {!user && (
                      <p className="mt-2 text-center text-xs text-gray-400">
                        Please sign in to place your booking
                      </p>
                    )}
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
