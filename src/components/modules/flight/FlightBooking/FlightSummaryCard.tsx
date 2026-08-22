"use client";

import React from "react";
import Image from "next/image";
import { FaPlane } from "react-icons/fa";
import type { Itinerary } from "@/interface/flight";
import {
  getLegs,
  getPriceSummary,
  formatTime,
  formatDate,
  stopLabel,
} from "./bookingSummary.util";
import { getAirlineName } from "@/utils/airline";

interface Props {
  itinerary: Itinerary;
  travelerSummary: { n: number; label: string }[];
}

const AirlineLogo: React.FC<{ code: string }> = ({ code }) => (
  <Image
    src={`/api/v1/uploads/files/images/public/airlines_logo/${code}.svg`}
    alt={code}
    width={30}
    height={30}
    className="rounded"
  />
);

const FlightLegRow: React.FC<{ leg: ReturnType<typeof getLegs>[number] }> = ({
  leg,
}) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
    <div className="mb-2 flex items-center gap-2">
      <AirlineLogo code={leg.carrierCode} />
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-[#12233D]">
          {leg.flightName ||
            `${leg.carrierCode} - ${getAirlineName(leg.carrierCode)} ${leg.flightNumber}`}
        </p>
        {leg.cabinCode && (
          <p className="text-[10px] uppercase tracking-wide text-gray-400">
            {leg.cabinCode} cabin
          </p>
        )}
        {leg.baggage && (
          <p className="text-[10px] text-gray-500">
            Baggage: <span className="font-medium text-gray-600">{leg.baggage}</span>
          </p>
        )}
      </div>
    </div>

    <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 ring-1 ring-slate-100">
      <div className="text-left">
        <p className="font-grotesk text-lg font-bold text-[#12233D]">{leg.fromCode}</p>
        <p className="text-[11px] text-gray-500">{formatTime(leg.departISO)}</p>
      </div>

      <div className="flex flex-1 flex-col items-center px-2">
        <span className="text-[10px] text-gray-500">{stopLabel(leg.stops)}</span>
        <div className="my-0.5 flex items-center gap-1 text-gray-400">
          <span className="h-px flex-1 border-t border-dashed border-gray-300" />
          <FaPlane className="text-[10px] text-brand" />
          <span className="h-px flex-1 border-t border-dashed border-gray-300" />
        </div>
        <span className="text-[10px] text-gray-500">{leg.duration}</span>
      </div>

      <div className="text-right">
        <p className="font-grotesk text-lg font-bold text-[#12233D]">{leg.toCode}</p>
        <p className="text-[11px] text-gray-500">{formatTime(leg.arriveISO)}</p>
      </div>
    </div>
  </div>
);

const SummaryRow: React.FC<{
  label: string;
  value: string;
  strong?: boolean;
}> = ({ label, value, strong }) => (
  <div
    className={`flex items-center justify-between text-sm ${strong ? "font-semibold text-gray-900" : "text-gray-600"}`}
  >
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

const FlightSummaryCard: React.FC<Props> = ({ itinerary, travelerSummary }) => {
  const legs = getLegs(itinerary);
  const price = getPriceSummary(itinerary);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative overflow-hidden bg-[#12233D] px-5 py-5 text-white">
        <div aria-hidden="true" className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-brand/25 blur-2xl" />
        <p className="relative text-[10px] font-bold uppercase tracking-[0.18em] text-brand">Trip overview</p>
        <h2 className="relative mt-1 text-base font-bold">Booking summary</h2>
        <p className="relative mt-1 text-xs text-white/65">
          {legs.length > 0
            ? `${legs[0].fromCode} ${formatDate(legs[0].departISO).split(",")[0]} → ${legs[legs.length - 1].toCode}`
            : "Flight itinerary"}
        </p>
      </div>

      <div className="space-y-5 p-5">
        <div className="space-y-2">
          {legs.map((leg, i) => (
            <FlightLegRow key={i} leg={leg} />
          ))}
        </div>

        {travelerSummary.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Travelers
            </p>
            <div className="space-y-1">
              {travelerSummary.map((t) => (
                <SummaryRow key={t.label} label={t.label} value={`× ${t.n}`} />
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Fare Breakdown
          </p>
          <div className="space-y-1">
            <SummaryRow label="Base Fare" value={`${price.currency} ${price.baseFare.toLocaleString()}`} />
            <SummaryRow label="Taxes & Fees" value={`${price.currency} ${price.taxes.toLocaleString()}`} />
            {price.discount > 0 && (
              <SummaryRow
                label="Discount"
                value={`- ${price.currency} ${price.discount.toLocaleString()}`}
              />
            )}
          </div>
        </div>

        <div className="flex items-end justify-between rounded-xl bg-brand/10 px-4 py-3">
          <span><span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Total payable</span><span className="text-xs text-slate-500">Taxes included</span></span>
          <span className="font-grotesk text-xl font-bold text-brand">
            {price.currency} {price.total.toLocaleString()}
          </span>
        </div>
      </div>
    </section>
  );
};

export default FlightSummaryCard;
