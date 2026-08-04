"use client";

import { useMemo, useState } from "react";
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

export default function PopularDestinationsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState("");

  const total = useMemo(() => DESTINATIONS.length, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const getCardStyle = (index: number): string => {
    const offset = (index - currentIndex + total) % total;

    if (offset === 0) {
      return `
        z-30
        w-[250px] h-[350px]
        md:w-[320px] md:h-[460px]
        xl:w-[380px] xl:h-[520px]
        scale-100 opacity-100
        translate-x-0
        shadow-2xl
      `;
    }

    if (offset === 1 || offset === total - 1) {
      const isRight = offset === 1;

      return `
        ${
          isRight
            ? "translate-x-[180px] md:translate-x-[280px] xl:translate-x-[360px]"
            : "-translate-x-[180px] md:-translate-x-[280px] xl:-translate-x-[360px]"
        }
        z-20
        w-[190px] h-[280px]
        md:w-[260px] md:h-[380px]
        xl:w-[300px] xl:h-[440px]
        scale-95
        opacity-90
        shadow-xl
        brightness-95
      `;
    }

    if (offset === 2 || offset === total - 2) {
      const isRight = offset === 2;

      return `
        ${
          isRight
            ? "translate-x-[300px] md:translate-x-[460px] xl:translate-x-[650px]"
            : "-translate-x-[300px] md:-translate-x-[460px] xl:-translate-x-[650px]"
        }
        z-10
        w-[150px] h-[220px]
        md:w-[200px] md:h-[300px]
        xl:w-[240px] xl:h-[370px]
        scale-90
        opacity-80
        shadow-lg
        brightness-90
      `;
    }

    return "opacity-0 pointer-events-none scale-50 z-0";
  };

  return (
    <section className="relative overflow-hidden bg-[#1A1A1A] py-16">
      {/* Green Background */}
      <div className="absolute inset-x-0 top-0 h-225 overflow-hidden bg-[#00A550]">
        <svg
          className="absolute top-0 left-0 h-35 w-full fill-current text-white"
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
        >
          <path d="M0,0 L0,70 C180,-10 540,-10 720,70 C900,150 1260,150 1440,70 L1440,0 Z" />
        </svg>

        <svg
          className="absolute bottom-0 left-0 h-45 w-full fill-current text-[#0B1F30]"
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
        >
          <path d="M0,96L120,117.3C240,139,480,181,720,181.3C960,181,1200,139,1320,117.3L1440,96L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z" />
        </svg>
      </div>

      {/* Carousel */}
      <div className="relative z-10 mx-auto my-10 flex h-87.5 w-full max-w-[1580px] items-center justify-center md:h-115 xl:h-130">
        {/* Left Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous"
          className="absolute left-[4%] z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-black/40 text-white backdrop-blur-md transition hover:scale-110 hover:bg-black/70 md:left-[10%] xl:left-[28%]"
        >
          <svg
            className="h-6 w-6 fill-none stroke-current"
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

        {/* Right Button */}
        <button
          onClick={handleNext}
          aria-label="Next"
          className="absolute right-[4%] z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-black/40 text-white backdrop-blur-md transition hover:scale-110 hover:bg-black/70 md:right-[10%] xl:right-[28%]"
        >
          <svg
            className="h-6 w-6 fill-none stroke-current"
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

        {/* Cards */}
        <div className="relative flex h-full w-full items-center justify-center perspective-[1000px]">
          {DESTINATIONS.map((item, index) => {
            const cardClass = getCardStyle(index);

            const isCenter =
              (index - currentIndex + total) % total === 0;

            return (
              <div
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                className={`absolute cursor-pointer overflow-hidden rounded-3xl shadow-lg shadow-green-900 transition-all duration-500 ease-out ${cardClass}`}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  priority={isCenter}
                  sizes="(max-width: 768px) 250px, (max-width: 1280px) 320px, 380px"
                  className="object-cover"
                />

                {isCenter && (
                  <div className="absolute inset-x-0 top-0 flex h-25 items-start justify-center bg-linear-to-b from-blue-700/70 via-blue-500/30 to-transparent pt-5">
                    <h3 className="text-center text-2xl font-bold tracking-wide text-white drop-shadow-md md:text-3xl xl:text-[38px]">
                      {item.name}
                    </h3>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Newsletter */}
      <div className="relative z-20 mx-auto mt-12 flex w-297.5 max-w-[95%] flex-col items-center justify-between gap-8 rounded-md bg-white px-6 py-8 shadow-2xl lg:flex-row lg:px-12">
        <div className="text-center lg:text-left">
          <h2 className="text-2xl font-semibold text-[#1C233D] md:text-4xl">
            Subscribe Newsletter
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            &amp; get exclusive offer updates
          </p>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex w-full max-w-140 flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 flex-1 border border-gray-200 px-4 outline-none focus:border-[#00A550]"
            required
          />

          <button
            type="submit"
            className="h-14 bg-[#00A550] px-8 font-semibold text-white transition hover:bg-[#008f45]"
          >
            Subscribe Now
          </button>
        </form>
      </div>
    </section>
  );
}