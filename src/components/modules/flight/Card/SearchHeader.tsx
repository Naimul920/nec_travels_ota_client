"use client"; // 1. Next.js 16 Client Component Directive

import React from "react";
import type { IState } from "@/components/modules/flight/Card/FlightCard";
import { Button } from "@/components/ui";
// 2. Swapped React Router Hooks for Next.js Native App Router Navigation Utilities
import { useRouter, useSearchParams } from "next/navigation";
import type { Itinerary, Schedule } from "@/interface/flight";
import dayjs from "dayjs";
import { FaPlane } from "react-icons/fa";

interface IProps {
  state: IState;
  setState: React.Dispatch<React.SetStateAction<IState>>;
  itinerary: Itinerary;
  index: number;
  searchId: string;
  passengerCount: {
    adult: number;
    child: number;
    kid: number;
    infant: number;
  };
}

function formatTime(_iso: string, timeStr: string): string {
  const t = timeStr.replace(/[+-]\d{2}:\d{2}$/, "");
  return t.slice(0, 5);
}

function formatDate(iso: string): string {
  return dayjs(iso).format("ddd DD MMM YYYY");
}

function elapsedString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function totalDuration(depISO?: string, arrISO?: string): string {
  if (!depISO || !arrISO) return "--";
  const mins = dayjs(arrISO).diff(dayjs(depISO), "minute");
  if (!Number.isFinite(mins) || mins < 0) return "--";
  return elapsedString(Math.round(mins));
}

function stopLabel(count: number): string {
  if (count === 0) return "Non Stop";
  if (count === 1) return "1 Stop";
  return `${count} Stops`;
}

const SearchHeader: React.FC<IProps> = ({
  state,
  setState,
  itinerary,
  index,
  searchId,
  passengerCount,
}) => {
  // 3. Initialized Next.js 16 Search Parameters & Native Router Hook
  const searchParams = useSearchParams();
  const router = useRouter();

  const totalAdultFare = itinerary?.passengerFareBreakDown
    .filter((f) => f.passengerType === "Adult")
    .reduce((sum, f) => sum + f.totalFare, 0);

  console.log("Total Adult Fare:", totalAdultFare, passengerCount);

  // const totalFare = itinerary?.saleCurrencyAmount.baseAmount;
  // const offerFare = itinerary?.saleCurrencyAmount.offerAmount;
  // const { totalAmount, offerAmount, discountAmount } =
  //   itinerary?.saleCurrencyAmount;
  // const currency = itinerary?.passengerFareBreakDown[0]?.currency || "BDT";
  // const taxFare = itinerary?.saleCurrencyAmount?.taxFare;
  // const baseAmount = itinerary?.saleCurrencyAmount?.baseAmount;
  // const grossFare = itinerary?.saleCurrencyAmount?.grossFare;
  // const ait = itinerary?.saleCurrencyAmount?.ait;
  // const discountAmount = itinerary?.saleCurrencyAmount?.discountAmount;
  // const offerAmount = itinerary?.saleCurrencyAmount?.offerAmount || 0;
  // const totalAmount = itinerary?.saleCurrencyAmount?.totalAmount || 0;
  // const {
  //   totalAmount = 0,
  //   offerAmount = 0,
  //   discountAmount = 0,
  // } = itinerary?.saleCurrencyAmount ?? {};

  // const taxFare = itinerary?.saleCurrencyAmount?.taxFare;
  // const baseAmount = itinerary?.saleCurrencyAmount?.baseAmount;
  // const grossFare = itinerary?.saleCurrencyAmount?.grossFare;
  // const ait = itinerary?.saleCurrencyAmount?.ait;
  // const discountAmount = itinerary?.saleCurrencyAmount?.discountAmount;
  // const offerAmount = itinerary?.saleCurrencyAmount?.offerAmount || 0;
  // const totalAmount = itinerary?.saleCurrencyAmount?.totalAmount || 0;

  // const shouldRender =
  //   totalAmount < offerAmount ||
  //   totalAmount > offerAmount ||
  //   totalAmount === offerAmount ||
  //   (totalAmount === 0 && offerAmount === 0);

  // const displayTotalAmount =
  //   totalAmount < offerAmount ? offerAmount : totalAmount;
  // const currency = itinerary?.passengerFareBreakDown[0]?.currency || "BDT";

  const {
    taxFare,
    baseAmount,
    grossFare,
    ait,
    discountAmount,
    offerAmount = 0,
    totalAmount = 0,
  } = itinerary?.saleCurrencyAmount ?? {};

  const displayTotalAmount =
    totalAmount < offerAmount ? offerAmount : totalAmount;

  const currency = itinerary?.passengerFareBreakDown?.[0]?.currency ?? "BDT";

  const handelFlightBooking = (id: string) => {
    // 4. Safely constructs query parameters string layout using native searchParams string conversion
    const currentQuery = searchParams.toString();
    const bookingUrl = `/flight-booking?${currentQuery}&i=${id}&sid=${searchId}`;
    router.push(bookingUrl);
  };

  const segments = itinerary?.flightDetails;
  

  // console.log("Segments:", segments, itinerary);
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 relative overflow-hidden shadow-sm mt-4 first:mt-1">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-12 md:col-span-10 space-y-5 md:border-r border-dashed border-gray-300 md:py-6 md:pe-4">
          {segments.map((seg, idx) => {
            const schedules = seg?.schedules ?? [];
            const firstSchedule = schedules[0];
            const lastSchedule = schedules[schedules.length - 1];
            const stopCount = Math.max(0, schedules.length - 1);
            const flightNumbers = schedules.map((s) => s.flightName);
            const duration = totalDuration(
              firstSchedule?.departureDateTime,
              lastSchedule?.arrivalDateTime,
            );

            return (
              <div
                key={idx}
                className="grid grid-cols-12 gap-2 items-center border-b pb-5 border-dashed border-gray-300 last:border-b-0 last:pb-0"
              >
                {/* Airline logo */}
                <div className="md:col-span-1 col-span-2 flex flex-col items-center justify-center gap-1 md:ps-1">
                  <div className="relative w-11 h-11 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={`/api/v1/uploads/files/images/public/airlines_logo/${firstSchedule?.marketingCarrierCode}.svg`}
                      alt={firstSchedule?.marketingCarrierCode || "airline"}
                      className="w-8 h-8 object-contain"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    {/* <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-300">
                      {firstSchedule?.marketingCarrierCode || ""}
                    </span> */}
                  </div>
                  <span className="text-[10px] font-semibold tracking-wide text-gray-500">
                    {firstSchedule?.marketingCarrierCode || ""}
                  </span>
                </div>

                {/* Departure */}
                <div className="md:col-span-2 col-span-3 flex flex-col items-start text-start md:ps-2">
                  <p className="text-primary font-extrabold text-base md:text-2xl whitespace-nowrap">
                    {firstSchedule?.departure?.airport}{" "}
                    {formatTime(
                      firstSchedule?.departureDateTime,
                      firstSchedule?.departure?.time,
                    )}
                  </p>
                  <p className="text-gray-500 text-xs whitespace-nowrap">
                    {formatDate(firstSchedule?.departureDateTime)}
                  </p>
                </div>

                {/* Route */}
                <div className="md:col-span-7 col-span-4 flex flex-col items-center">
                  <p className="text-gray-500 text-xs font-medium">
                    {stopLabel(stopCount)}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {duration}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-1 mt-1.5">
                    {flightNumbers.map((fn, fIdx) => (
                      <span
                        key={`${fn}-${fIdx}`}
                        className="inline-flex px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-semibold"
                      >
                        {fn}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrival */}
                <div className="md:col-span-2 col-span-3 flex flex-col text-end items-end md:pe-2">
                  <p className="text-primary font-extrabold text-base md:text-2xl whitespace-nowrap">
                    {lastSchedule?.arrival?.airport}{" "}
                    {formatTime(
                      lastSchedule?.arrivalDateTime,
                      lastSchedule?.arrival?.time,
                    )}
                  </p>
                  <p className="text-gray-500 text-xs whitespace-nowrap">
                    {formatDate(lastSchedule?.arrivalDateTime)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:flex flex-col items-center justify-center md:col-span-2 text-center">
          {/* <p>taxFare: {taxFare?.toLocaleString()}</p>
          <p>baseAmount: {baseAmount?.toLocaleString()}</p>
          <p>grossFare: {grossFare?.toLocaleString()}</p>
          <p>ait: {ait?.toLocaleString()}</p>
          <p>discountAmount: {discountAmount?.toLocaleString()}</p>
          <p>offerAmount: {offerAmount?.toLocaleString()}</p>
          <p>totalAmount: {totalAmount?.toLocaleString()}</p> */}

          {/* <div className="text-center">
            <p className="text-sm">
              Offer Amount: {currency} {offerAmount.toLocaleString()}
            </p>

            <p className="text-xs">
              Total Amount: {currency} {displayTotalAmount.toLocaleString()}
            </p>
          </div> */}

          <div className="text-center">
            <div className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-xs font-semibold px-2 py-1 rounded-md mb-2">
              <FaPlane className="w-3.5 h-3.5" />
              FLIGHTINT
            </div>
            <p className="text-base font-bold text-gray-900">
              {currency} {offerAmount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 line-through">
              {currency} {displayTotalAmount.toLocaleString()}
            </p>
          </div>

          <Button
            onClick={() => handelFlightBooking(String(index))}
            className="text-xs rounded-sm mt-2"
          >
            Book Now
          </Button>
        </div>
      </div>

      <div className="flex md:hidden justify-between items-center pt-2">
        <Button
          onClick={() =>
            setState((prev) => ({ ...prev, isDetails: !prev.isDetails }))
          }
          variant="secondary"
          className="text-xs rounded-sm"
        >
          {state.isDetails ? "Hide" : "Show"} Details
        </Button>
        <div className="text-center">
          <p className="text-xs text-secondary font-bold">{currency}</p>
          <p className="text-sm font-bold">{totalAmount?.toLocaleString()}</p>
        </div>
        <Button
          onClick={() => handelFlightBooking(String(index))}
          className="text-xs rounded-sm"
        >
          Book Now
        </Button>
      </div>

      <div className="md:block hidden mt-4 md:absolute md:left-[49%] md:-translate-x-4/4 md:-bottom-2">
        <Button
          className="text-white rounded-none text-[10px] font-normal pt-1 rounded-t-full"
          onClick={() =>
            setState((prev) => ({ ...prev, isDetails: !prev.isDetails }))
          }
        >
          {state.isDetails ? "Hide" : "Show"} Details
        </Button>
      </div>
    </div>
  );
};

export default SearchHeader;
