import React from "react";

function ExploreNecText() {
  return (
    <div className="flex items-center justify-center px-5 py-14 md:py-20">
      <div className="flex flex-col items-center gap-6 text-center select-none">
        <div className="relative">
          <span className="absolute -top-7 left-2 -rotate-6 text-lg font-black text-red-600 font-poppins md:-top-9 md:text-2xl">
            up to
          </span>
          <h1 className="text-4xl font-black font-poppins tracking-wide text-black sm:text-5xl md:text-6xl">
            15% is yours!
          </h1>
        </div>

        <p className="max-w-md text-sm font-medium text-gray-800 font-poppins md:text-base">
          just book a trip and{" "}
          <span className="whitespace-nowrap">explore the world</span>
        </p>

        <div className="relative mt-2">
          <span className="pointer-events-none absolute -top-12 right-6 z-10 hidden rotate-6 text-4xl font-normal italic tracking-normal text-[#00A550] font-stalemate md:-top-14 md:right-10 md:block md:text-5xl">
            With
          </span>
          <h2 className="relative z-0 text-3xl font-extrabold tracking-tight text-black font-poppins sm:text-4xl md:text-5xl">
            Explore <span className="text-red-600">NEC</span> Travel
          </h2>
        </div>
      </div>
    </div>
  );
}

export default ExploreNecText;
