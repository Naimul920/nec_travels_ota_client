import React from "react";
import DealsCarouselSection from "./DealsCarouselSection";
// import DealsCarouselSection from "@/components/b2c/home/exclusiveOffer/DealsCarouselSection";

function ExclusiveOffer() {
  return (
    <section className="mt-20 max-w-[1600px] mx-auto px-2">
      <div className="">
        <h1 className="text-6xl font-bold  text-center">
          <span className="text-primary">Exclusive</span>{" "}
          <span className="text-red-600">Offer</span>
          <svg
            className="inline ml-1 relative -top-8"
            width="34"
            height="32"
            viewBox="0 0 34 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.88076e-06 13.4399L10.4592 19.0568L33.8299 -5.86014e-05L2.88076e-06 13.4399Z"
              fill="#00A550"
            />
            <path
              d="M33.83 -6.45598e-05L12.0615 20.5114L16.548 31.5373L33.83 -6.45598e-05Z"
              fill="#FF000A"
            />
          </svg>
        </h1>
      </div>
      <DealsCarouselSection />
    </section>
  );
}

export default ExclusiveOffer;
