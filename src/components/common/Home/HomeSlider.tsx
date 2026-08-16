"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const SLIDES = [
  { id: 1, src: "https://picsum.photos/seed/necpic1/600/400", alt: "Travel 1" },
  { id: 2, src: "https://picsum.photos/seed/necpic2/600/400", alt: "Travel 2" },
  { id: 3, src: "https://picsum.photos/seed/necpic3/600/400", alt: "Travel 3" },
  { id: 4, src: "https://picsum.photos/seed/necpic4/600/400", alt: "Travel 4" },
  { id: 5, src: "https://picsum.photos/seed/necpic5/600/400", alt: "Travel 5" },
];

const VISIBLE_COUNT = 3;
const MAX_INDEX = SLIDES.length - VISIBLE_COUNT;

export default function HomeSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === MAX_INDEX ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? MAX_INDEX : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === MAX_INDEX ? 0 : prev + 1));
  };

  return (
    <div className="relative mx-auto py-10">
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / VISIBLE_COUNT)}%)` }}
        >
          {SLIDES.map((slide) => (
            <div
              key={slide.id}
              className="shrink-0 px-2"
              style={{ width: `${100 / VISIBLE_COUNT}%` }}
            >
              <div className="relative aspect-[3/2] overflow-hidden rounded-lg shadow-md">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
