import { IoIosAirplane } from "react-icons/io";
import { FiMapPin } from "react-icons/fi";
import ExploreCarousel from "@/components/modules/b2c/home/explore/ExploreCarousel";

// Deterministic "barcode" bar widths — purely decorative, matches the
// signature strip used on the sign-in / sign-up ticket panels.
const BARCODE_BARS = [
  2, 4, 1, 3, 5, 2, 1, 4, 3, 2, 5, 1, 3, 2, 4, 1, 5, 2, 3, 1, 4, 2, 1, 3,
];

function ExploreNecCarousel() {
  return (
    <div className="grid items-center gap-12 rounded-[32px] border border-emerald-950/10 bg-white/80 p-5 shadow-[0_24px_80px_-40px_rgba(18,35,61,0.35)] backdrop-blur sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:p-12">
        {/* Left: boarding-pass style destination card */}
        <div className="flex w-full flex-col items-start gap-6 text-left">
          <p className="font-plex-mono text-xs tracking-[0.35em] text-brand">
            FEATURED DESTINATION
          </p>

          {/* Gate card */}
          <div className="w-full overflow-hidden rounded-2xl border border-[#12233D]/10 bg-white shadow-sm">
            <div className="flex items-center justify-between bg-[#0F1836] px-5 py-4">
              <div className="flex items-center gap-2">
                <FiMapPin className="text-brand" size={16} />
                <p className="font-grotesk text-xl font-semibold uppercase tracking-[0.15em] text-white sm:text-2xl">
                  Paris
                </p>
              </div>
              <IoIosAirplane
                className="-rotate-45 text-2xl text-brand sm:text-3xl"
              />
            </div>

            <div className="border-t border-dashed border-[#12233D]/15" />

            <div className="flex items-center justify-between px-5 py-3 font-plex-mono text-[11px] tracking-widest text-[#5B6B7A]">
              <span>GATE A12</span>
              <span className="font-semibold text-brand">NOW BOARDING</span>
              <span>CDG</span>
            </div>
          </div>

          <p className="max-w-[420px] text-sm leading-7 text-[#5B6B7A] md:text-base">
            Discover and book unique experiences in{" "}
            <b className="text-[#12233D]">Paris</b>, hosted by local experts.
            Find one-of-a-kind activities you won&apos;t find anywhere else.
          </p>

          <div className="flex flex-col items-start gap-4">
            <button className="group flex h-12 items-center gap-2 rounded-xl bg-brand px-8 text-base font-semibold text-white shadow-md transition-colors hover:bg-brand/90">
              Book now
              <IoIosAirplane
                className="-rotate-45 transition-transform duration-200 group-hover:translate-x-1"
                size={18}
              />
            </button>

            {/* barcode signature — echoes the ticket panels elsewhere in the app */}
            <div className="hidden lg:block">
              <div className="flex h-6 items-end gap-[2px]">
                {BARCODE_BARS.map((w, i) => (
                  <div
                    key={i}
                    className="bg-[#12233D]/40"
                    style={{ width: `${w}px`, height: "100%" }}
                  />
                ))}
              </div>
              <p className="mt-1 font-plex-mono text-[9px] tracking-[0.2em] text-[#9FB4C7]">
                NEC TRAVELS · EXPLORE
              </p>
            </div>
          </div>
        </div>

        {/* Right: carousel */}
        <div className="flex min-w-0 w-full justify-center py-8 lg:py-4">
          <ExploreCarousel />
        </div>
    </div>
  );
}

export default ExploreNecCarousel;
