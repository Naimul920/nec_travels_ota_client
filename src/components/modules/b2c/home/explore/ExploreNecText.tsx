import React from "react";

function ExploreNecText() {
  return (
    <div className="flex items-center justify-center mt-30">
      <div className="flex flex-col items-center gap-4 select-none p-6 ">
        <div className="relative flex flex-col items-start">
          <div className="relative flex items-baseline">
            <span className="text-red-600  text-[30px] font-poppins font-black leading-none absolute -top-10 -left-[30px]">
              up to
            </span>

            <h1 className="text-black text-[48px] font-black font-poppins tracking-wide leading-[13.5px]">
              15% is yours!
            </h1>
          </div>

          <div className="relative mt-4 flex gap-3 font-poppins font-medium text-[14px] left-7  text-gray-800">
            <span className="leading-tight ">just book a trip and</span>
            <span className="leading-tight ">explore the world</span>
          </div>
        </div>

        <div className="relative flex flex-col items-start pt-8">
          <div className="relative flex items-baseline">
            <span className=" font-normal font-stalemate text-5xl text-[#00A550] leading-none absolute -top-[45px] italic right-60 z-10 pointer-events-none select-none tracking-normal">
              With
            </span>

            <h2 className="font-poppins font-extrabold text-[50px] text-black leading-[37.5px] tracking-tight relative z-0">
              Explore <span className="text-red-600">NEC</span> Travel
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExploreNecText;
