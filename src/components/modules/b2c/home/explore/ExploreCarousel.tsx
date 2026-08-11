"use client";

import React, { useState } from "react";
import Image from "next/image";

const DEFAULT_SLIDES = [
  {
    id: 1,
    src: "https://picsum.photos/seed/travel1/600/800",
    alt: "Paris",
    city: "Paris",
    code: "CDG",
  },
  {
    id: 2,
    src: "https://picsum.photos/seed/travel2/600/800",
    alt: "Tokyo",
    city: "Tokyo",
    code: "NRT",
  },
  {
    id: 3,
    src: "https://picsum.photos/seed/travel3/600/800",
    alt: "New York",
    city: "New York",
    code: "JFK",
  },
  {
    id: 4,
    src: "https://picsum.photos/seed/travel4/600/800",
    alt: "Dubai",
    city: "Dubai",
    code: "DXB",
  },
  {
    id: 5,
    src: "https://picsum.photos/seed/travel5/600/800",
    alt: "Sydney",
    city: "Sydney",
    code: "SYD",
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

  const activeSlide = slides[currentIndex] as (typeof DEFAULT_SLIDES)[number];

  return (
    <div className="relative mx-auto flex h-[300px] w-[240px] select-none items-center justify-center sm:h-[340px] sm:w-[280px] md:h-[374px] md:w-[310px]">
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-0 top-1/2 z-30 -translate-y-1/2 cursor-pointer p-2 text-white drop-shadow-md transition-transform hover:scale-110 active:scale-95 sm:-left-10"
      >
        <svg
          className="h-8 w-8 stroke-current"
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
        className="absolute right-0 top-1/2 z-30 -translate-y-1/2 cursor-pointer p-2 text-white drop-shadow-md transition-transform hover:scale-110 active:scale-95 sm:-right-10"
      >
        <svg
          className="h-8 w-8 stroke-current"
          fill="none"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* airport-code chip for the centered destination */}
      <div className="absolute -top-8 left-1/2 z-30 -translate-x-1/2 rounded-full border border-[#12233D]/10 bg-white px-3 py-1 shadow-sm">
        <p className="font-plex-mono text-[10px] font-semibold tracking-[0.2em] text-[#12233D]">
          {activeSlide?.code ?? "—"}
        </p>
      </div>

      <div className="relative flex h-[296px] w-[240px] items-center justify-center sm:h-[336px] sm:w-[280px] md:h-[372px] md:w-[310px]">
        {slides.map((slide, index) => {
          const position = getSlidePosition(index);
          const s = slide as (typeof DEFAULT_SLIDES)[number];

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
              key={s.id}
              className={`absolute h-[296px] w-[240px] overflow-hidden rounded-2xl transition-all duration-500 ease-in-out sm:h-[336px] sm:w-[280px] md:h-[372px] md:w-[310px] ${transformStyle}`}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, 310px"
                priority={position === "center"}
              />

              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/10" />

              {position === "center" && (
                <>
                  {/* city label, top-left */}
                  <div className="absolute left-4 top-4 z-30">
                    <p className="font-grotesk text-sm font-semibold uppercase tracking-[0.1em] text-white drop-shadow-md">
                      {s.city}
                    </p>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex h-[16.66%] items-center justify-between bg-black/40 px-4">
                    {/* Left: slide number indicator, e.g. 01 / 05 */}
                    <div className="font-plex-mono text-2xl font-bold tracking-wider text-white">
                      {String(currentIndex + 1).padStart(2, "0")}
                      <span className="text-white/60">
                        /{String(totalSlides).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Center: pagination dots */}
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
                                ? "h-2.5 w-2.5 scale-110 bg-brand"
                                : "h-1.5 w-1.5 bg-white/80 hover:bg-white"
                            }`}
                          />
                        );
                      })}
                    </div>

                    <button
                      onClick={handleNext}
                      aria-label="Next"
                      className="text-white transition-colors hover:text-brand"
                    >
                      <svg
                        className="h-4 w-12 fill-none stroke-current"
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
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}