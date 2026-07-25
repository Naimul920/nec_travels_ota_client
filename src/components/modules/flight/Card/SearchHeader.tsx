"use client"; // 1. Next.js 16 Client Component Directive

import React from "react";
import type { IState } from "@/components/modules/flight/Card/FlightCard";
import { Button } from "@/components/ui";
// 2. Swapped React Router Hooks for Next.js Native App Router Navigation Utilities
import { useRouter, useSearchParams } from "next/navigation";
import { encoding } from "@/utils";
import type { Itinerary, Schedule } from "@/interface/flight";
import dayjs from "dayjs";

interface IProps {
  state: IState;
  setState: React.Dispatch<React.SetStateAction<IState>>;
  itinerary: Itinerary;
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
  return dayjs(iso).format("DD MMM YYYY");
}

function elapsedString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
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
  passengerCount,
}) => {
  // 3. Initialized Next.js 16 Search Parameters & Native Router Hook
  const searchParams = useSearchParams();
  const router = useRouter();

  const totalAdultFare = itinerary.passengerFareBreakDown
    .filter((f) => f.passengerType === "Adult")
    .reduce((sum, f) => sum + f.totalFare, 0);

  console.log("Total Adult Fare:", totalAdultFare, passengerCount);

  const totalFare = itinerary.saleCurrencyAmount.totalFare;
  const currency = itinerary.passengerFareBreakDown[0]?.currency || "BDT";

  const handelFlightBooking = (id: string) => {
    // 4. Safely constructs query parameters string layout using native searchParams string conversion
    const currentQuery = searchParams.toString();
    router.push(`/flight-booking?${currentQuery}&i=${encoding(id)}`);
  };

  const segments = itinerary.flightDetails;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 relative overflow-hidden shadow-xs">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-12 md:col-span-10 space-y-5 md:border-r border-dashed border-gray-300 md:py-6">
          {segments.map((seg, idx) => {
            const schedule: Schedule = seg.schedules[0];
            if (!schedule) return null;
            return (
              <div
                key={idx}
                className="grid grid-cols-12 gap-2 items-center border-b pb-5 border-dashed border-gray-300 last:border-b-0 last:pb-0"
              >
                <div className="md:col-span-2 col-span-3 flex flex-col items-start text-start md:ps-5">
                  <p className="text-primary font-extrabold text-lg md:text-2xl">
                    {schedule.departure.airport}{" "}
                    {formatTime(
                      schedule.departureDateTime,
                      schedule.departure.time,
                    )}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {formatDate(schedule.departureDateTime)}
                  </p>
                </div>

                <div className="md:col-span-7 col-span-6 flex flex-col items-center">
                  <p className="text-primary font-semibold text-xs">
                    {stopLabel(schedule.stopCount)}
                  </p>
                  <div className="border-t border-dashed border-gray-300 my-2 w-full" />
                  <p className="text-gray-500 text-xs">
                    {schedule.flightName} &bull;{" "}
                    {elapsedString(seg.elapsedTime)}
                  </p>
                </div>

                <div className="md:col-span-2 col-span-3 flex flex-col text-end items-end md:pe-5">
                  <p className="text-primary font-extrabold text-lg md:text-2xl">
                    {schedule.arrival.airport}{" "}
                    {formatTime(
                      schedule.arrivalDateTime,
                      schedule.arrival.time,
                    )}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {formatDate(schedule.arrivalDateTime)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:flex flex-col items-center justify-center md:col-span-2 text-center">
          <p className="text-xs text-indigo-600">Lowest Fare</p>
          <p className="text-2xl font-bold text-primary">
            {currency} {totalFare.toLocaleString()}
          </p>
          <Button
            onClick={() => handelFlightBooking("1")}
            className="text-xs rounded-sm w-2/4"
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
          <p className="text-sm font-bold">{totalFare.toLocaleString()}</p>
        </div>
        <Button
          onClick={() => handelFlightBooking("1")}
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
