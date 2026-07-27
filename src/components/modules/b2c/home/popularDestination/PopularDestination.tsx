import {
  AirplaneIcon,
  DashedLineSvg,
  BottomAirplanesSvg,
} from "@/components/shared/icons/decorative";
import PopularDestinationsCarousal from "./PopularDestinationsCarousal";

export default function PopularDestination() {
  return (
    <section className="mt-24 overflow-hidden">
      <div className="flex justify-center">
        <div className="relative">
          <h1 className="text-center text-4xl font-bold md:text-5xl xl:text-6xl">
            <span>Popular </span>
            <span className="text-primary">Destination</span>
            <AirplaneIcon className="absolute -right-8 -top-8 h-8 w-8 -rotate-45 md:h-10 md:w-10" />
          </h1>

          <DashedLineSvg className="absolute left-1/2 top-12 hidden -translate-x-1/2 lg:block" />

          <BottomAirplanesSvg className="absolute -bottom-16 left-1/2 hidden -translate-x-1/2 lg:block" />
        </div>
      </div>

      <PopularDestinationsCarousal />
    </section>
  );
}
