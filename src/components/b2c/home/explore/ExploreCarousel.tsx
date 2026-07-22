"use client";

import React, { useState } from "react";
import Image from "next/image";

const DEFAULT_SLIDES = [
  {
    id: 1,
    src: "https://picsum.photos/seed/travel1/600/800",
    alt: "Destination 1",
  },
  {
    id: 2,
    src: "https://picsum.photos/seed/travel2/600/800",
    alt: "Destination 2",
  },
  {
    id: 3,
    src: "https://picsum.photos/seed/travel3/600/800",
    alt: "Destination 3",
  },
  {
    id: 4,
    src: "https://picsum.photos/seed/travel4/600/800",
    alt: "Destination 4",
  },
  {
    id: 5,
    src: "https://picsum.photos/seed/travel5/600/800",
    alt: "Destination 5",
  },
];

export default function ExploreCarousel({ slides = DEFAULT_SLIDES }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSlides = slides.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const getSlidePosition = (index: number) => {
    if (index === currentIndex) return "center";

    const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    const nextIndex = (currentIndex + 1) % totalSlides;

    if (index === prevIndex) return "left";
    if (index === nextIndex) return "right";
    return "hidden";
  };

  return (
    <div className="relative w-full  mx-auto h-[374px] flex items-center justify-center select-none  -translate-x-[70px]">
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute -left-18 top-25 z-30 p-2 text-white transition-transform hover:scale-110 active:scale-95 drop-shadow-md cursor-pointer"
      >
        <svg
          className="w-8 h-8 stroke-current"
          fill="none"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute -right-18 top-25 z-30 p-2 text-white transition-transform hover:scale-110 active:scale-95 drop-shadow-md cursor-pointer"
      >
        <svg
          className="w-8 h-8 stroke-current"
          fill="none"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="relative w-[310px] h-[372px] flex items-center justify-center">
        {slides.map((slide, index) => {
          const position = getSlidePosition(index);

          let transformStyle =
            "translate-x-0 scale-90 opacity-0 pointer-events-none z-0";

          if (position === "center") {
            transformStyle =
              "translate-x-0 scale-100 opacity-100 z-20 shadow-2xl";
          } else if (position === "left") {
            transformStyle =
              "-translate-x-[35%] scale-[0.75] opacity-85 z-10 shadow-lg brightness-90";
          } else if (position === "right") {
            transformStyle =
              "translate-x-[35%] scale-[0.75] opacity-85 z-10 shadow-lg brightness-90";
          }

          return (
            <div
              key={slide.id}
              className={`absolute w-[310px] h-[372px]  overflow-hidden transition-all duration-500 ease-in-out ${transformStyle}`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                sizes="310px"
                priority={position === "center"}
              />

              <div className="absolute inset-0 ring-1 ring-black/10 rounded-2xl pointer-events-none" />

              {position === "center" && (
                <div className="absolute bottom-0 left-0 right-0 h-[16.66%] bg-black/40 to-transparent flex items-center justify-between px-4 z-30">
                  {/* Left: Slide Number indicator (e.g. 01 / 05) */}
                  <div className="text-white text-4xl font-extrabold tracking-wider ">
                    {String(currentIndex + 1).padStart(2, "0")}
                  </div>

                  {/* Center: Pagination Dots */}
                  <div className="flex items-center gap-1.5">
                    {slides.map((_, dotIdx) => {
                      const isActive = dotIdx === currentIndex;
                      return (
                        <button
                          key={dotIdx}
                          onClick={() => setCurrentIndex(dotIdx)}
                          aria-label={`Go to slide ${dotIdx + 1}`}
                          className={`rounded-full transition-all duration-300 ${
                            isActive
                              ? "bg-red-600 w-2.5 h-2.5 scale-110"
                              : "bg-white/80 hover:bg-white w-1.5 h-1.5"
                          }`}
                        />
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNext}
                    aria-label="Next"
                    className="text-white hover:text-red-500 transition-colors"
                  >
                    <svg
                      className="w-12 h-4 fill-none stroke-current"
                      strokeWidth="2.5"
                      viewBox="0 0 48 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M36 4l8 8m0 0l-8 8m8-8H2"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
