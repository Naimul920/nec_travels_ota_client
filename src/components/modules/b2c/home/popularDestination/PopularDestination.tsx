import {
  AirplaneIcon,
  BottomAirplanesSvg,
  DashedLineSvg,
} from "@/components/shared/icons/decorative";
import { PopularDestinationsCarousal } from "./PopularDestinationsCarousal";

export default function PopularDestination() {
  const WORLD_BLOBS = [
    "M18 96c10-22 34-30 58-24 20 5 32 20 48 18 16-2 26 10 20 26-8 20-34 24-54 20-8-2-14 4-24 2-24-4-44-18-52-38-4-2-2-2 4-4Z",
    "M150 190c14-10 32-8 40 4 10 14 4 30-10 36-16 6-34 0-40-14-4-10 0-20 10-26Z",
    "M60 210c18-6 40 2 46 18 6 16-4 32-22 36-20 4-40-6-46-22-4-14 4-26 22-32Z",
    "M210 60c26-8 56 2 68 24 10 18 4 38-14 46-10 4-18 14-30 12-22-4-36-22-40-42-4-18 2-34 16-40Z",
    "M300 110c22-4 44 8 50 26 6 18-4 34-22 40-8 2-14 10-24 8-20-4-32-20-34-38-2-16 8-30 30-36Z",
    "M120 40c16-6 34 0 40 14 6 14-2 28-18 32-14 4-28-4-32-16-4-12 2-24 10-30Z",
  ];
  return (
    <section className="relative overflow-hidden border-t border-emerald-950/5 bg-[#f4faf7] py-16 text-slate-900 sm:py-20 lg:py-24">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-brand/[0.07] blur-3xl" />

      {/* World Map Overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
        viewBox="0 0 400 560"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="worldDotsDestinations"
            width="9"
            height="9"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.4" cy="1.4" r="1.4" fill="#00A550" />
          </pattern>
        </defs>
        <g>
          {WORLD_BLOBS.map((d, i) => (
            <path key={i} d={d} fill="url(#worldDotsDestinations)" />
          ))}
        </g>
      </svg>

      {/* Unified Header */}
      <div className="relative z-10 mx-auto mb-12 flex max-w-7xl justify-center px-4 sm:mb-16 sm:px-6 lg:px-8">
        <div className="relative flex flex-col items-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-4 py-1 backdrop-blur-sm">
            <span className="font-plex-mono text-xs font-semibold tracking-[0.3em] uppercase text-brand">
              POPULAR DESTINATIONS
            </span>
          </div>

          <h2 className="relative text-center font-grotesk text-3xl font-bold tracking-tight text-[#12233D] sm:text-4xl lg:text-5xl">
            <span>Popular </span>
            <span className="text-brand">Destination</span>

            <AirplaneIcon className="absolute -right-7 -top-6 h-8 w-8 -rotate-45 text-brand drop-shadow-[0_0_12px_rgba(0,165,80,0.35)] md:-right-9 md:-top-7 md:h-10 md:w-10" />
          </h2>

          <DashedLineSvg className="absolute left-1/2 top-14 hidden -translate-x-1/2 text-brand/20 lg:block" />
          <BottomAirplanesSvg className="absolute -bottom-12 left-1/2 hidden -translate-x-1/2 text-brand/30 lg:block" />
        </div>
      </div>

      {/* Carousel & Newsletter Container */}
      <div className="relative z-10">
        <PopularDestinationsCarousal />
      </div>
    </section>
  );
}
