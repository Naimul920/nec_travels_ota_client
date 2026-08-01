"use client"; // 1. Next.js 16 Client Component Boundary

import React, { useMemo, useState } from "react";
// 2. Swapped React Router hook with Next.js Navigation hook
import { useSearchParams } from "next/navigation";
import { Formik, Form } from "formik";
import { message } from "antd";
import { useQuery } from "@tanstack/react-query";
import { decoding } from "../../../../utils";
import { Button } from "../../../ui";
import type { BookingFormValues, Passenger } from "@/interface";
import type {
  BookingPassenger,
  BookingSegment,
  Itinerary,
  RevalidateItineraryPayload,
} from "@/interface/flight";
import TravelersForm from "../Booking/TravelersForm";
import { createPassengers } from "@/utils/createPassengers";
import {
  searchFlightAction,
  revalidateItineraryAction,
  bookFlightAction,
} from "@/actions/flight.action";
import { useAuthStore } from "@/store/auth.store";

const PASSENGER_TYPE_MAP: Record<string, string> = {
  adult: "ADT",
  child: "CHD",
  kid: "CHD",
  infant: "INF",
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
  const { user } = useAuthStore();

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
    const adult = createPassengers(adultCount);
    if (user && adult.length > 0) {
      adult[0] = {
        ...adult[0],
        firstname: user.first_name || adult[0].firstname,
        lastname: user.last_name || adult[0].lastname,
        email: user.email || adult[0].email,
        phone: user.phone || adult[0].phone,
      };
    }
    return {
      tripType: searchInfoParams.get("tripType"),
      cabin: searchInfoParams.get("cabin"),
      adult,
      child: createPassengers(Number(searchInfoParams.get("child") ?? 0)),
      kid: createPassengers(Number(searchInfoParams.get("kid") ?? 0)),
      infant: createPassengers(Number(searchInfoParams.get("infant") ?? 0)),
    };
  }, [searchInfoParams, user]);

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
      from: searchInfoParams.get("from") || itin.flightDetails[0]?.schedules[0]?.departure.airport || "",
      to: searchInfoParams.get("to") || itin.flightDetails[0]?.schedules[0]?.arrival.airport || "",
      noOfAdult: Number(searchInfoParams.get("adult") || 1),
      noOfChildren: Number(searchInfoParams.get("child") || 0),
      noOfKids: Number(searchInfoParams.get("kid") || 0),
      noOfInfant: Number(searchInfoParams.get("infant") || 0),
      itinDetail: { flightDetails: itin.flightDetails },
      passengerFareBreakDown: itin.passengerFareBreakDown,
      saleCurrencyAmount: {
        totalFare: sale.totalFare,
        totalAmount: sale.totalFare,
        baseAmount: sale.totalFare,
        discountAmount: 0,
        offer_amount: 0,
        taxFare: sale.taxFare,
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

    const passengers: BookingPassenger[] = [];
    (["adult", "child", "kid", "infant"] as const).forEach((type) => {
      values[type].forEach((p) => {
        passengers.push(
          toBookingPassenger(p, PASSENGER_TYPE_MAP[type], false),
        );
      });
    });

    const leadPassenger = passengers[0];
    if (!leadPassenger) {
      message.error("Please add at least one passenger.");
      return;
    }
    leadPassenger.email = values.adult[0]?.email;
    leadPassenger.phone = values.adult[0]?.phone;

    setIsBooking(true);
    try {
      const revalidateResult = await revalidateItineraryAction(
        buildRevalidatePayload(itinerary),
      );

      if (
        !revalidateResult.success ||
        !revalidateResult.data?.quoteId
      ) {
        message.error(
          revalidateResult.message || "Could not revalidate itinerary. Please try again.",
        );
        return;
      }

      const quoteId = revalidateResult.data.quoteId;
      const revalidatedItinerary =
        revalidateResult.data.itineraries?.[0] ?? itinerary;

      const payload = {
        quoteId,
        lead_passenger: leadPassenger,
        passengers,
        segments: buildSegments(revalidatedItinerary),
        payment_type: "CASH",
        provider: "sb",
      };

      const result = await bookFlightAction(payload);
      if (result.success) {
        message.success(result.message || "Flight booked successfully");
        console.log("Booking response:", result.data);
      } else {
        message.error(result.message || "Booking failed");
      }
    } catch {
      message.error("Booking failed. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (isSearching) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
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
    <div className="max-w-[1600px] mx-auto px-5 sm:px-10 py-20">
      <h1 className="text-xl font-semibold mb-4">Flight Booking</h1>

      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <TravelersForm />
            <Button type="submit" className="mt-6" disabled={isBooking}>
              {isBooking ? "Booking..." : "Submit Booking"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FlightBooking;
