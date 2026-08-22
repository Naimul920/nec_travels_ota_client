"use client"; // 1. Next.js 16 Client Component Directive

import React from "react";
import type { IState } from "@/components/modules/flight/Card/FlightCard";
// 2. Swapped React Router Hooks for Next.js Native App Router Navigation Utilities
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Itinerary, Schedule } from "@/interface/flight";
import dayjs from "dayjs";
import { FaPlane } from "react-icons/fa";
import { useAuthStore } from "@/store/auth.store";
import { getAirlineName } from "@/utils/airline";

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
  showDiscount: boolean;
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
  showDiscount,
}) => {
  // 3. Initialized Next.js 16 Search Parameters & Native Router Hook
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const pathname = usePathname();
  const isB2B = pathname.startsWith("/console/b2b");

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
    // If user is not logged in, send them to sign-in first and bring them back
    // to the same booking (with the same info) using client-side navigation after login.
    if (!isLoggedIn) {
      const redirect = encodeURIComponent(bookingUrl);
      router.push(`/auth/signin?redirect=${redirect}`);
      return;
    }
    router.push(bookingUrl);
  };

  const segments = itinerary?.flightDetails;
  

  // console.log("Segments:", segments, itinerary);
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-5">
      <div className="grid grid-cols-12 items-stretch gap-4">
        <div className="col-span-12 space-y-5 md:col-span-9 md:border-r md:border-dashed md:border-slate-200 md:pr-5">
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
                className="grid grid-cols-12 items-center gap-2 border-b border-dashed border-slate-200 pb-5 last:border-b-0 last:pb-0"
              >
                {/* Airline logo */}
                <div className="md:col-span-1 col-span-2 flex flex-col items-center justify-center gap-1 md:ps-1">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                    <img
                      src={`/api/v1/uploads/files/images/public/airlines_logo/${firstSchedule?.marketingCarrierCode}.svg`}
                      alt={getAirlineName(firstSchedule?.marketingCarrierCode)}
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
                  <span className="max-w-20 truncate text-center text-[9px] font-semibold text-slate-500">
                    {getAirlineName(firstSchedule?.marketingCarrierCode)}
                  </span>
                </div>

                {/* Departure */}
                <div className="md:col-span-2 col-span-3 flex flex-col items-start text-start md:ps-2">
                  <p className="whitespace-nowrap font-grotesk text-lg font-bold text-[#12233D] md:text-2xl">
                    {firstSchedule?.departure?.airport}{" "}
                    {formatTime(
                      firstSchedule?.departureDateTime,
                      firstSchedule?.departure?.time,
                    )}
                  </p>
                  <p className="mt-1 whitespace-nowrap text-[10px] font-medium text-slate-400 sm:text-xs">
                    {formatDate(firstSchedule?.departureDateTime)}
                  </p>
                </div>

                {/* Route */}
                <div className="col-span-4 flex flex-col items-center md:col-span-7">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-brand sm:text-xs">
                    {stopLabel(stopCount)}
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-[#12233D] sm:text-sm">
                    {duration}
                  </p>
                  <div className="relative mt-2 flex w-full items-center justify-center gap-1 before:absolute before:left-0 before:right-0 before:top-1/2 before:border-t before:border-dashed before:border-slate-300">
                    {flightNumbers.map((fn, fIdx) => (
                      <span
                        key={`${fn}-${fIdx}`}
                        className="relative z-10 inline-flex rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-bold text-slate-500"
                      >
                        {fn}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrival */}
                <div className="md:col-span-2 col-span-3 flex flex-col text-end items-end md:pe-2">
                  <p className="whitespace-nowrap font-grotesk text-lg font-bold text-[#12233D] md:text-2xl">
                    {lastSchedule?.arrival?.airport}{" "}
                    {formatTime(
                      lastSchedule?.arrivalDateTime,
                      lastSchedule?.arrival?.time,
                    )}
                  </p>
                  <p className="mt-1 whitespace-nowrap text-[10px] font-medium text-slate-400 sm:text-xs">
                    {formatDate(lastSchedule?.arrivalDateTime)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden flex-col items-center justify-center text-center md:col-span-3 md:flex">
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
            {isB2B && !showDiscount ? (
              <p className="text-base font-bold text-gray-900">
                {currency} {displayTotalAmount.toLocaleString()}
              </p>
            ) : (
              <>
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                  <FaPlane className="w-3.5 h-3.5" />
                  Discounted Fare
                </div>
                <p className="text-base font-bold text-gray-900">
                  {currency} {offerAmount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 line-through">
                  {currency} {displayTotalAmount.toLocaleString()}
                </p>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => handelFlightBooking(String(index))}
            className="mt-4 h-10 w-full max-w-36 rounded-xl bg-brand px-4 text-xs font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand/90"
          >
            Book Now
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 md:hidden">
        <button
          type="button"
          onClick={() =>
            setState((prev) => ({ ...prev, isDetails: !prev.isDetails }))
          }
          className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-600 transition hover:border-brand hover:text-brand"
        >
          {state.isDetails ? "Hide" : "Show"} Details
        </button>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Fare</p>
          <p className="text-sm font-bold text-[#12233D]">{currency} {offerAmount.toLocaleString()}</p>
        </div>
        <button
          type="button"
          onClick={() => handelFlightBooking(String(index))}
          className="h-10 rounded-xl bg-brand px-4 text-xs font-bold text-white shadow-md shadow-brand/20"
        >
          Book Now
        </button>
      </div>

      <div className="mt-4 hidden md:absolute md:bottom-0 md:left-[37.5%] md:block md:-translate-x-1/2">
        <button
          type="button"
          className="rounded-t-xl bg-[#12233D] px-5 py-1.5 text-[10px] font-bold text-white transition hover:bg-brand"
          onClick={() =>
            setState((prev) => ({ ...prev, isDetails: !prev.isDetails }))
          }
        >
          {state.isDetails ? "Hide" : "Show"} Details
        </button>
      </div>
    </article>
  );
};

export default SearchHeader;
