"use client"; // 1. Next.js 16 Client Component Directive

import React, { useMemo } from "react";
// 2. Swapped useLocation from 'react-router-dom' to Next.js native hooks
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import Flight from "../Flight";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { modifySearch, useFlightStore } from "../../../../store/flight.store";
import { decoding } from "../../../../utils";

type Segment = {
  from: string;
  to: string;
  date: string;
  returnDate?: string;
};

const FlightSearchSummary: React.FC = () => {
  // 3. Next.js hook to access the URL query parameters directly
  const searchParams = useSearchParams();

  // 4. Extract and decode the custom 'q' param safely from Next.js query layout
  const encodedQuery = searchParams.get("q");
  const decode = useMemo(() => {
    return encodedQuery ? decoding(encodedQuery) : null;
  }, [encodedQuery]);

  const flight = useFlightStore((state) => state.flight);

  // 5. Parse the decrypted query parameters string into a query object utility
  const params = useMemo(() => {
    return new URLSearchParams((decode as string) || "");
  }, [decode]);

  const tripType = params.get("tripType");

  const segments: Segment[] = useMemo(() => {
    if (tripType === "multicity") {
      const str = params.get("segments");
      if (!str) return [];
      return str.split(",").map((seg) => {
        const parts = seg.split("-");
        const from = parts[0];
        const to = parts[1];
        const date = parts.slice(2).join("-");
        return { from, to, date };
      });
    }

    return [
      {
        from: params.get("from") || "",
        to: params.get("to") || "",
        date: params.get("date") || "",
        returnDate: params.get("returnDate") || "",
      },
    ];
  }, [params, tripType]);

  const passengers = {
    adult: params.get("adult") || "0",
    child: params.get("child") || "0",
    infant: params.get("infant") || "0",
    kid: params.get("kid") || "0",
  };

  if (!tripType) return null;

  return (
    <>
      {/* ===== SUMMARY CARD ===== */}
      <section className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">Your itinerary</p>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              {segments.length} {segments.length === 1 ? "flight leg" : "flight legs"} · {params.get("cabin") || "Economy"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => modifySearch()}
            aria-expanded={Boolean(flight?.isModifySearch)}
            className={`inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-xs font-bold transition ${
              flight?.isModifySearch
                ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                : "bg-[#12233D] text-white hover:bg-[#1b3457]"
            }`}
          >
            {flight?.isModifySearch ? "Close search" : "Modify search"}
            {flight?.isModifySearch ? <BiChevronUp size={16} /> : <BiChevronDown size={16} />}
          </button>
        </div>
        {segments.map((seg, index) => (
          <div
            key={index}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-slate-100 px-4 py-4 last:border-none sm:px-5"
          >
              <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand">
                {tripType === "multicity" ? `Leg ${index + 1}` : tripType.replace("trip", " trip")}
              </span>

              <div className="flex items-center gap-2 font-grotesk text-lg font-bold text-[#12233D] sm:text-xl">
                <span>{seg.from}</span>
                <span className="text-brand">→</span>
                <span>{seg.to}</span>
              </div>

              <div className="flex items-center text-xs font-semibold text-slate-600 sm:ml-auto sm:text-sm">
                {seg.date && (
                  <span>
                    {dayjs(seg.date).format("DD MMM YYYY")}
                  </span>
                )}
                {/* Date */}
                {seg.returnDate && (
                  <>
                    {" - "}
                    <span>
                      {dayjs(seg.returnDate).format("DD MMM YYYY")}
                    </span>
                  </>
                )}
              </div>

              <span className="w-full text-[11px] font-medium text-slate-400 sm:w-auto">
                Adt {passengers.adult}, Chd {passengers.child}, Kid{" "}
                {passengers.kid}, Inf {passengers.infant}
              </span>
          </div>
        ))}
      </section>

      {/* ===== TOGGLE SEARCH FORM ===== */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          flight?.isModifySearch
            ? "max-h-[3000px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        {flight?.isModifySearch && (
          <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <Flight useFlight="search" />
          </div>
        )}
      </div>
    </>
  );
};

export default FlightSearchSummary;
