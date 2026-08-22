"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  { id: 1, src: "https://picsum.photos/seed/necpic1/900/600", alt: "Travel destination 1" },
  { id: 2, src: "https://picsum.photos/seed/necpic2/900/600", alt: "Travel destination 2" },
  { id: 3, src: "https://picsum.photos/seed/necpic3/900/600", alt: "Travel destination 3" },
  { id: 4, src: "https://picsum.photos/seed/necpic4/900/600", alt: "Travel destination 4" },
  { id: 5, src: "https://picsum.photos/seed/necpic5/900/600", alt: "Travel destination 5" },
] as const;

const VISIBLE_COUNT = 3;
const LOOP_SLIDES = [...SLIDES, ...SLIDES.slice(0, VISIBLE_COUNT)];

export default function HomeSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentIndex((index) => index + 1);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section aria-label="Travel destinations" className="overflow-hidden pt-10 pb-2 sm:pt-12">
      <div
        className={`flex ease-in-out motion-reduce:transition-none ${
          isTransitioning ? "transition-transform duration-700" : "transition-none"
        }`}
        style={{ transform: `translateX(-${currentIndex * (100 / VISIBLE_COUNT)}%)` }}
        onTransitionEnd={() => {
          if (currentIndex < SLIDES.length) return;

          setIsTransitioning(false);
          setCurrentIndex(0);
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => setIsTransitioning(true));
          });
        }}
      >
        {LOOP_SLIDES.map((slide, index) => (
          <div key={`${slide.id}-${index}`} className="w-1/3 shrink-0 px-1.5 sm:px-2">
            <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-slate-100 shadow-sm sm:rounded-2xl">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                sizes="33vw"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
