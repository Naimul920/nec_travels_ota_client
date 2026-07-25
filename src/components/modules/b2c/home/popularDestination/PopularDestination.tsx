import React from "react";
import PopularDestinationsCarousal from "./PopularDestinationsCarousal";

function PopularDestination() {
  return (
    <section className="mt-24 overflow-hidden">
      <div className="flex justify-center">
        <div className="relative">
          <h1 className="text-center text-4xl font-bold md:text-5xl xl:text-6xl">
            <span>Popular </span>

            <span className="text-primary">Destination</span>

            {/* Airplane */}
            <svg
              className="absolute -right-8 -top-8 h-8 w-8 -rotate-45 md:h-10 md:w-10"
              viewBox="0 0 34 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 13.4399L10.4592 19.0568L33.8299 0L0 13.4399Z"
                fill="#00A550"
              />

              <path
                d="M33.83 0L12.0615 20.5114L16.548 31.5373L33.83 0Z"
                fill="#FF000A"
              />
            </svg>
          </h1>

          {/* Dashed Line */}
          <svg
            className="absolute left-1/2 top-12 hidden -translate-x-1/2 lg:block"
            width="277"
            height="86"
            viewBox="0 0 277 86"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.50024 57.5002C37.5002 118.5 60.8527 45.4035 106 75.0002C151 104.5 130.528 52.465 213.5 75.0002C254 86 283.5 84.0005 273.5 1.50024"
              stroke="#00A550"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 7"
            />
          </svg>

          {/* Bottom Airplanes */}
          <svg
            className="absolute -bottom-16 left-1/2 hidden -translate-x-1/2 lg:block"
            width="109"
            height="58"
            viewBox="0 0 109 58"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M29.2397 25.0808L29.2397 29.5595L50.1248 41.2041L50.1248 53.834C50.1248 55.8139 52.0593 57.3274 54.3019 57.3274C56.5443 57.3274 58.4789 55.8138 58.4789 53.834L58.4789 41.2041L79.364 29.5595L79.364 25.0808L58.4789 30.4552L58.4789 17.7355L64.7444 14.2422L64.7444 10.749L54.3019 12.5404L43.8593 10.749L43.8593 14.2422L50.1248 17.7355L50.1248 30.4552L29.2397 25.0808Z"
              fill="#FF000A"
            />

            <path
              d="M0 9.92201L0 13.0226L13.9235 21.0843L13.9235 29.8281C13.9235 31.1988 15.2131 32.2466 16.7082 32.2466C18.2031 32.2466 19.4928 31.1987 19.4928 29.8281L19.4928 21.0843L33.4163 13.0226L33.4163 9.92202L19.4928 13.6428L19.4928 4.83682L23.6699 2.4184L23.6699 0L16.7082 1.24024L9.74645 0L9.74645 2.4184L13.9235 4.83682L13.9235 13.6428L0 9.92201Z"
              fill="#3ABFF0"
            />

            <path
              d="M75.1866 9.92201L75.1866 13.0226L89.11 21.0843L89.11 29.8281C89.11 31.1988 90.3997 32.2466 91.8947 32.2466C93.3896 32.2466 94.6794 31.1987 94.6794 29.8281L94.6794 21.0843L108.603 13.0226L108.603 9.92202L94.6794 13.6428L94.6794 4.83682L98.8564 2.4184L98.8564 0L91.8947 1.24024L84.933 0L84.933 2.4184L89.11 4.83682L89.11 13.6428L75.1866 9.92201Z"
              fill="#3ABFF0"
            />
          </svg>
        </div>
      </div>

      <PopularDestinationsCarousal />
    </section>
  );
}

export default PopularDestination;