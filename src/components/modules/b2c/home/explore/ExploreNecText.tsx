import React from "react";
import { IoIosAirplane } from "react-icons/io";

function ExploreNecText() {
  return (
    <div className="flex items-center justify-center px-5 py-14 md:py-20">
      <div className="flex select-none flex-col items-center gap-5 text-center">
        <p className="font-plex-mono text-xs tracking-[0.35em] text-brand">
          LIMITED-TIME FARE
        </p>

        <div className="relative">
          {/* fare tag — echoes the small chips used on the ticket panels elsewhere */}
          <span className="absolute -top-8 left-1 -rotate-6 md:-top-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-white px-3 py-1 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              <span className="font-plex-mono text-[10px] font-bold uppercase tracking-[0.15em] text-brand md:text-xs">
                up to
              </span>
            </span>
          </span>

          <h1 className="font-grotesk text-4xl font-bold tracking-tight text-[#12233D] sm:text-5xl md:text-6xl">
            15% is yours!
          </h1>
        </div>

        <p className="max-w-md text-sm font-medium text-[#5B6B7A] md:text-base">
          Just book a trip and{" "}
          <span className="whitespace-nowrap text-[#12233D]">
            explore the world
          </span>
        </p>

        {/* perforated seam — mirrors the ticket-stub motif used site-wide */}
        <div className="relative w-full max-w-[220px]">
          <div className="border-t border-dashed border-[#12233D]/20" />
          <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-[#F7F4EC]" />
          <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full bg-[#F7F4EC]" />
        </div>

        <div className="flex items-center gap-2">
          <h2 className="font-grotesk text-3xl font-extrabold tracking-tight text-[#12233D] sm:text-4xl md:text-5xl">
            Explore <span className="text-brand">NEC</span> Travels
          </h2>
          <IoIosAirplane
            className="-rotate-45 text-2xl text-brand sm:text-3xl md:text-4xl"
          />
        </div>
      </div>
    </div>
  );
}

export default ExploreNecText;