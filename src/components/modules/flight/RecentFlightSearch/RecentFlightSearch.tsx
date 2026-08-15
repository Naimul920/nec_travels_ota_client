"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import clsx from "clsx";
import { FiClock } from "react-icons/fi";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { getLastSearch, type RecentSearch } from "@/utils/recentSearch";

interface RecentFlightSearchProps {
  onSelect: (record: RecentSearch) => void;
  className?: string;
}

const TRIP_LABEL: Record<string, string> = {
  oneway: "One Way",
  roundtrip: "Round Trip",
  multicity: "Multi City",
};

function formatDate(date?: string): string {
  if (!date) return "";
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format("DD MMM YY") : date;
}

function Airport({ iata, name }: { iata?: string; name?: string }) {
  return (
    <div className="flex min-w-0 flex-col">
      <span className="text-lg font-extrabold tracking-tight text-slate-800">
        {iata ?? "--"}
      </span>
      {name && (
        <span className="max-w-[7rem] truncate text-[10px] font-medium text-gray-400">
          {name}
        </span>
      )}
    </div>
  );
}

function RouteRow({ search }: { search: RecentSearch }) {
  if (search.tripType === "multicity" && search.segments) {
    return (
      <div className="flex flex-col gap-2">
        {search.segments.map((seg, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1.5"
          >
            <span className="text-xs font-mono font-bold text-primary">
              {seg.from}
            </span>
            <span className="text-[10px] text-gray-400">→</span>
            <span className="text-xs font-mono font-bold text-primary">
              {seg.to}
            </span>
            <span className="ml-auto text-[10px] text-gray-400">
              {formatDate(seg.date)}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Airport iata={search.from} name={search.fromName} />

      <div className="relative mx-1 flex flex-1 items-center justify-center">
        <div className="absolute left-1 right-1 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-primary/30" />
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MdOutlineFlightTakeoff size={18} />
        </span>
      </div>

      <Airport iata={search.to} name={search.toName} />
    </div>
  );
}

export default function RecentFlightSearch({
  onSelect,
  className,
}: RecentFlightSearchProps) {
  const [search] = useState<RecentSearch | null>(() => getLastSearch());

  if (!search) return null;

  const paxLabel =
    [
      search.adults ? `${search.adults} Adult${search.adults > 1 ? "s" : ""}` : "",
      search.children ? `${search.children} Child${search.children > 1 ? "ren" : ""}` : "",
      search.kids ? `${search.kids} Kid${search.kids > 1 ? "s" : ""}` : "",
      search.infants ? `${search.infants} Infant${search.infants > 1 ? "s" : ""}` : "",
    ]
      .filter(Boolean)
      .join(", ") || "1 Adult";

  return (
    <div className={clsx("w-full", className)}>
      <button
        type="button"
        onClick={() => onSelect(search)}
        className="group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-primary/15 bg-white p-4 text-left shadow-[0_8px_24px_-16px_rgba(15,35,61,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_16px_32px_-16px_rgba(15,35,61,0.45)]"
      >
        <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-secondary" />

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <FiClock className="text-primary" />
            Last Search
          </span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
            {TRIP_LABEL[search.tripType] ?? search.tripType}
          </span>
        </div>

        <div className="mt-3">
          <RouteRow search={search} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-dashed border-slate-200 pt-2.5 text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <span className="font-semibold text-gray-400">Depart</span>
            {formatDate(search.date)}
          </span>
          {search.returnDate && (
            <span className="flex items-center gap-1">
              <span className="font-semibold text-gray-400">Return</span>
              {formatDate(search.returnDate)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <span className="font-semibold text-gray-400">Travellers</span>
            {paxLabel}
          </span>
        </div>
      </button>
    </div>
  );
}