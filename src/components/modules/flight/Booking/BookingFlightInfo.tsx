"use client";

import React from "react";
import type { Itinerary } from "@/interface/flight";
import dayjs from "dayjs";
import { FaPlane } from "react-icons/fa";
import Image from "next/image";
import { getAirlineName } from "@/utils/airline";

function formatTime(iso: string): string {
  return dayjs(iso).format("HH:mm");
}

function formatDate(iso: string): string {
  return dayjs(iso).format("ddd DD MMM YYYY");
}

function totalDuration(depISO?: string, arrISO?: string): string {
  if (!depISO || !arrISO) return "--";
  const mins = dayjs(arrISO).diff(dayjs(depISO), "minute");
  if (!Number.isFinite(mins) || mins < 0) return "--";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function stopLabel(count: number): string {
  if (count === 0) return "Non Stop";
  if (count === 1) return "1 Stop";
  return `${count} Stops`;
}

interface BookingFlightInfoProps {
  itinerary: Itinerary;
}

const BookingFlightInfo: React.FC<BookingFlightInfoProps> = ({ itinerary }) => {
  const flightDetail = itinerary?.flightDetails?.[0];
  const schedules = flightDetail?.schedules ?? [];
  const first = schedules[0];
  const last = schedules[schedules.length - 1];
  const stopCount = first?.stopCount ?? Math.max(0, schedules.length - 1);
  const duration = totalDuration(
    first?.departureDateTime,
    last?.arrivalDateTime,
  );
  const flightNumber = schedules
    .map((s) => s.flightName)
    .filter(Boolean)
    .join(", ");

  const { offerAmount = 0, totalAmount = 0 } =
    itinerary?.saleCurrencyAmount ?? {};
  const currency = itinerary?.passengerFareBreakDown?.[0]?.currency ?? "BDT";
  const displayTotal = Math.max(offerAmount, totalAmount);
  console.log(
    "BookingFlightInfo itinerary flightDetails:",
    itinerary?.flightDetails?.[0],
  );
  console.log(
    "BookingFlightInfo itinerary: schedules",
    itinerary.flightDetails.at(0)?.schedules,
  );

  if (!first) {
    return (
      <div className="text-sm text-gray-400">Flight details unavailable</div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex flex-col items-center gap-1">
        <Image
          src={`/api/v1/uploads/files/images/public/airlines_logo/${first?.marketingCarrierCode}.svg`}
          alt={`${first.marketingCarrierCode} - ${getAirlineName(first.marketingCarrierCode)}`}
          width={30}
          height={30}
        />
        <span className="hidden min-w-[3.5rem] text-[10px] font-semibold tracking-wide text-gray-400 sm:block text-center leading-tight">
          {first.marketingCarrierCode || ""} -{" "}
          {getAirlineName(first.marketingCarrierCode)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          <p className="font-extrabold text-primary">
            {first.departure.airport}
          </p>
          <p className="text-xs text-gray-500">
            {formatTime(first.departureDateTime)}
          </p>
        </div>

        <div className="flex flex-col items-center px-1">
          <span className="text-xs text-gray-500">{stopLabel(stopCount)}</span>
          <div className="my-0.5 flex items-center gap-1 text-gray-400">
            <span className="h-px w-10 border-t border-dashed border-gray-300" />
            <FaPlane className="text-xs" />
            <span className="h-px w-10 border-t border-dashed border-gray-300" />
          </div>
          <span className="text-[11px] text-gray-400">{duration}</span>
          <span className="max-w-[8rem] truncate text-[10px] font-semibold text-gray-500">
            {flightNumber}
          </span>
        </div>

        <div>
          <p className="font-extrabold text-primary">{last!.arrival.airport}</p>
          <p className="text-xs text-gray-500">
            {formatTime(last!.arrivalDateTime)}
          </p>
        </div>
      </div>

      <div className="hidden border-l border-gray-200 pl-4 sm:block">
        <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
          <FaPlane className="w-3 h-3" /> FLIGHTINT
        </span>
        <p className="mt-1 font-bold text-gray-900">
          {currency} {displayTotal.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default BookingFlightInfo;
