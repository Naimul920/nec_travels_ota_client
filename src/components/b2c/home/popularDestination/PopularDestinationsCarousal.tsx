"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Destination {
  id: string;
  name: string;
  image: string;
}

const DESTINATIONS: Destination[] = [
  {
    id: "1",
    name: "Moscow",
    image: "https://picsum.photos/seed/moscow/600/800",
  },
  {
    id: "2",
    name: "Alpine Valley",
    image: "https://picsum.photos/seed/alpine/600/800",
  },
  {
    id: "3",
    name: "Swiss Cabin",
    image: "https://picsum.photos/seed/cabin/600/800",
  },
  {
    id: "4",
    name: "Green Canyon",
    image: "https://picsum.photos/seed/canyon/600/800",
  },
  {
    id: "5",
    name: "Mountain Lodge",
    image: "https://picsum.photos/seed/lodge/600/800",
  },
];

export default function PopularDestinations() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState("");

  const total = DESTINATIONS.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  // Offset logic for 5 visible perspective cards
  const getCardStyle = (index: number) => {
    const offset = (index - currentIndex + total) % total;

    if (offset === 0) {
      // Center Active Card (380px x 520px)
      return "z-30 w-[380px] h-[520px] scale-100 opacity-100 translate-x-0 shadow-2xl";
    } else if (offset === 1 || offset === total - 1) {
      // Inner Left / Right Cards
      const isRight = offset === 1;
      return `${
        isRight
          ? "translate-x-[360px] rotate-y-[-6deg]"
          : "-translate-x-[360px] rotate-y-[6deg]"
      } z-20 w-[300px] h-[440px] scale-95 opacity-90 shadow-xl brightness-95`;
    } else if (offset === 2 || offset === total - 2) {
      // Outer Left / Right Cards
      const isRight = offset === 2;
      return `${
        isRight
          ? "translate-x-[650px] rotate-y-[-12deg]"
          : "-translate-x-[650px] rotate-y-[12deg]"
      } z-10 w-[240px] h-[370px] scale-90 opacity-80 shadow-lg brightness-90`;
    }

    return "opacity-0 pointer-events-none scale-50 z-0";
  };

  return (
    <section className="relative w-full bg-[#1A1A1A] overflow-hidden flex flex-col items-center pt-16 pb-20 select-none ">
      {/* ==========================================
          1. WAVY GREEN BACKGROUND CANVAS
          ========================================== */}
      <div className="absolute inset-x-0 top-0 h-[900px] bg-[#00A550] z-0 overflow-hidden ">
        {/* Top Wave Cutout - Pure Sine Wave Profile */}
        <svg
          className="absolute top-0 left-0 w-full h-[140px] text-white fill-current pointer-events-none"
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
        >
          <path d="M0,0 L0,70 C180,-10 540,-10 720,70 C900,150 1260,150 1440,70 L1440,0 Z" />
        </svg>

        {/* Bottom Wave Cutout */}
        <svg
          className="absolute bottom-0 left-0 w-full h-[180px] text-[#1A1A1A] fill-current pointer-events-none "
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
        >
          <path d="M0,96L120,117.3C240,139,480,181,720,181.3C960,181,1200,139,1320,117.3L1440,96L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z" />
        </svg>
      </div>

      {/* ==========================================
          2. CAROUSEL SECTION (1580px x 524px)
          ========================================== */}
      <div className="relative z-10 w-full max-w-[1580px] h-[524px] flex items-center justify-center my-16">
        {/* Left Arrow Button (Over Left Adjacent Card) */}
        <button
          onClick={handlePrev}
          aria-label="Previous Destination"
          className="absolute left-[28%] z-40 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 border border-white/60 flex items-center justify-center text-white backdrop-blur-md transition-all duration-300 hover:scale-110"
        >
          <svg
            className="w-6 h-6 fill-none stroke-current"
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

        {/* Right Arrow Button (Over Right Adjacent Card) */}
        <button
          onClick={handleNext}
          aria-label="Next Destination"
          className="absolute right-[28%] z-40 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 border border-white/60 flex items-center justify-center text-white backdrop-blur-md transition-all duration-300 hover:scale-110"
        >
          <svg
            className="w-6 h-6 fill-none stroke-current"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* 3D Perspective Cards Stage */}
        <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
          {DESTINATIONS.map((item, index) => {
            const cardClass = getCardStyle(index);
            const isCenter = (index - currentIndex + total) % total === 0;

            return (
              <div
                key={item.id}
                className={`absolute rounded-3xl overflow-hidden transition-all duration-400 ease-out shadow-green-900 shadow-lg cursor-pointer ${cardClass}`}
                onClick={() => setCurrentIndex(index)}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  unoptimized
                  className="object-cover"
                />

                {/* Center Card Title Overlay */}
                {isCenter && (
                  <div className="absolute top-0 inset-x-0 h-[110px] bg-gradient-to-b from-blue-600/70 via-blue-500/30 to-transparent flex items-start justify-center pt-6 z-20">
                    <h3 className="text-white font-belanosima text-[38px] tracking-wide font-bold drop-shadow-md">
                      {item.name}
                    </h3>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ==========================================
          3. NEWSLETTER BANNER (1190px x 220px)
          ========================================== */}
      <div className="relative z-20 w-[1190px] max-w-[95%] h-[220px] bg-white rounded-md shadow-2xl mt-10 px-12 flex items-center justify-between">
        {/* Left Heading Group */}
        <div className="flex flex-col gap-1">
          <h2 className="text-[#1C233D] font-poppins text-[32px]  tracking-tight">
            Subscribe Newsletters
          </h2>
          <p className="text-gray-500 font-poppins text-[14px] font-medium">
            &amp; Get Exclusive offer updates
          </p>
        </div>

        {/* Right Input Group */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center w-full max-w-[520px] h-[60px] border border-gray-200 rounded-xs p-1.5 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#00A550]/40 transition-all"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 h-full px-4 text-[15px] font-poppins text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
            required
          />
          <button
            type="submit"
            className="h-full px-8 bg-[#00A550] hover:bg-[#008f45] active:scale-98 text-white font-poppins font-semibold text-[15px] rounded-xs transition-all shadow-md"
          >
            Subcribe Now
          </button>
        </form>
      </div>
    </section>
  );
}
