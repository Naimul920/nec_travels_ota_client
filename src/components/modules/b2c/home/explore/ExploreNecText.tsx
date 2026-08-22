import React from "react";
import { IoIosAirplane } from "react-icons/io";

function ExploreNecText() {
  return (
    <header className="mb-10 grid gap-7 border-b border-[#12233D]/10 pb-10 sm:mb-14 sm:pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-end lg:gap-14">
      <div className="max-w-3xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-8 bg-brand" aria-hidden="true" />
          <p className="font-plex-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-brand sm:text-xs">
            Curated by NEC Travels
          </p>
        </div>

        <h2 className="text-balance font-grotesk text-3xl font-bold leading-[1.08] tracking-tight text-[#12233D] sm:text-4xl lg:text-5xl">
          Go somewhere
          <span className="block text-brand">worth remembering.</span>
        </h2>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-brand/15 bg-white/70 p-5 pr-16 shadow-[0_14px_40px_-28px_rgba(18,35,61,0.35)] backdrop-blur sm:p-6 sm:pr-18">
        <span
          className="absolute inset-y-5 left-0 w-1 rounded-r-full bg-brand"
          aria-hidden="true"
        />
        <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand sm:right-6 sm:top-6">
          <IoIosAirplane className="-rotate-45 text-xl" aria-hidden="true" />
        </span>

        <p className="text-sm leading-6 text-[#5B6B7A] sm:text-[15px]">
          Handpicked city breaks with exclusive fares and local experiences,
          all planned in one place.
        </p>

        <div className="mt-4 flex flex-wrap gap-2" aria-label="Travel benefits">
          <span className="rounded-full bg-[#12233D]/5 px-3 py-1 font-plex-mono text-[9px] font-semibold uppercase tracking-wider text-[#5B6B7A]">
            Exclusive fares
          </span>
          <span className="rounded-full bg-brand/10 px-3 py-1 font-plex-mono text-[9px] font-semibold uppercase tracking-wider text-brand">
            Local picks
          </span>
        </div>
      </div>
    </header>
  );
}

export default ExploreNecText;
