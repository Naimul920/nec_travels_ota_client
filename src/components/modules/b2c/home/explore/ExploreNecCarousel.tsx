import { IoIosAirplane } from "react-icons/io";
import ExploreCarousel from "@/components/modules/b2c/home/explore/ExploreCarousel";

function ExploreNecCarousel() {
  return (
    <div className="w-full bg-linear-to-t from-primary to-white px-5 py-12 shadow-sm sm:px-10 md:py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 lg:flex-row lg:justify-between lg:gap-8">
        {/* left text */}
        <div className="flex max-w-md flex-col items-center gap-4 text-center lg:items-start lg:text-left">
          {/* black background paris */}
          <div className="flex h-11 w-full max-w-[340px] items-center justify-between bg-[#0F1836] px-4">
            <p className="text-base font-semibold uppercase tracking-[0.5em] text-white sm:text-lg">
              Paris
            </p>
            <div className="flex gap-4 text-2xl sm:text-3xl">
              <IoIosAirplane className="-rotate-45 text-primary" />
              <IoIosAirplane className="-rotate-45 text-white" />
            </div>
          </div>

          <p className="max-w-[420px] text-sm leading-7 text-gray-800 md:text-base">
            Discover and Book Unique Experiences in <b>Paris</b> Hosted by Local
            Experts. Find One-of-a-Kind Activities Hosted by Local Experts in{" "}
            <b>Paris</b>.
          </p>

          <button className="h-12 rounded-lg border-2 bg-white px-8 text-lg font-semibold text-gray-800 transition-colors hover:bg-gray-50 md:text-2xl">
            Book Now
          </button>
        </div>

        {/* right carousel */}
        <div className="flex w-full justify-center lg:w-auto">
          <ExploreCarousel />
        </div>
      </div>
    </div>
  );
}

export default ExploreNecCarousel;
