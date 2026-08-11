"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Tab types
type TabCategory = "Flight" | "Hotel" | "Visa" | "Insurance" | "Activity";

interface DealCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  price?: string;
}

// Mock dataset categorized by tabs
const DEALS_DATA: Record<TabCategory, DealCard[]> = {
  Flight: [
    {
      id: "f1",
      title: "SUPER DEALS",
      subtitle: "Qatar Air",
      price: "From $299",
      image: "https://picsum.photos/seed/plane1/600/800",
    },
    {
      id: "f2",
      title: "SUPER DEALS",
      subtitle: "Qatar Air",
      price: "From $299",
      image: "https://picsum.photos/seed/plane2/600/800",
    },
    {
      id: "f3",
      title: "SUPER DEALS",
      subtitle: "Qatar Air",
      price: "From $299",
      image: "https://picsum.photos/seed/plane3/600/800",
    },
    {
      id: "f4",
      title: "SUPER DEALS",
      subtitle: "Qatar Air",
      price: "From $299",
      image: "https://picsum.photos/seed/plane4/600/800",
    },
    {
      id: "f5",
      title: "SUPER DEALS",
      subtitle: "Qatar Air",
      price: "From $299",
      image: "https://picsum.photos/seed/plane5/600/800",
    },
    {
      id: "f6",
      title: "SUPER DEALS",
      subtitle: "Emirates",
      price: "From $399",
      image: "https://picsum.photos/seed/plane6/600/800",
    },
    {
      id: "f7",
      title: "SUPER DEALS",
      subtitle: "Singapore Airlines",
      price: "From $459",
      image: "https://picsum.photos/seed/plane7/600/800",
    },
  ],
  Hotel: [
    {
      id: "h1",
      title: "LUXURY STAY",
      subtitle: "Marriott Resort",
      price: "From $89",
      image: "https://picsum.photos/seed/hotel1/600/800",
    },
    {
      id: "h2",
      title: "HOTEL DEALS",
      subtitle: "Hilton Suites",
      price: "From $75",
      image: "https://picsum.photos/seed/hotel2/600/800",
    },
    {
      id: "h3",
      title: "BEST VALUE",
      subtitle: "Radisson Blu",
      price: "From $64",
      image: "https://picsum.photos/seed/hotel3/600/800",
    },
    {
      id: "h4",
      title: "BEACH RESORT",
      subtitle: "InterContinental",
      price: "From $119",
      image: "https://picsum.photos/seed/hotel4/600/800",
    },
    {
      id: "h5",
      title: "CITY CENTER",
      subtitle: "Hyatt Regency",
      price: "From $98",
      image: "https://picsum.photos/seed/hotel5/600/800",
    },
    {
      id: "h6",
      title: "BOUTIQUE STAY",
      subtitle: "Four Seasons",
      price: "From $145",
      image: "https://picsum.photos/seed/hotel6/600/800",
    },
  ],
  Visa: [
    {
      id: "v1",
      title: "EXPRESS VISA",
      subtitle: "Schengen Visa",
      price: "From $99",
      image: "https://picsum.photos/seed/visa1/600/800",
    },
    {
      id: "v2",
      title: "EASY PROCESS",
      subtitle: "Dubai Tourist",
      price: "From $45",
      image: "https://picsum.photos/seed/visa2/600/800",
    },
    {
      id: "v3",
      title: "QUICK APPROVAL",
      subtitle: "UK Visa",
      price: "From $139",
      image: "https://picsum.photos/seed/visa3/600/800",
    },
    {
      id: "v4",
      title: "STUDENT VISA",
      subtitle: "USA Visit",
      price: "From $159",
      image: "https://picsum.photos/seed/visa4/600/800",
    },
    {
      id: "v5",
      title: "TRAVEL READY",
      subtitle: "Malaysia eVisa",
      price: "From $59",
      image: "https://picsum.photos/seed/visa5/600/800",
    },
  ],
  Insurance: [
    {
      id: "i1",
      title: "FULL COVERAGE",
      subtitle: "Global Secure",
      price: "From $12",
      image: "https://picsum.photos/seed/ins1/600/800",
    },
    {
      id: "i2",
      title: "FAMILY PLAN",
      subtitle: "Travel Guard",
      price: "From $18",
      image: "https://picsum.photos/seed/ins2/600/800",
    },
    {
      id: "i3",
      title: "MEDICAL COVER",
      subtitle: "Allianz Care",
      price: "From $15",
      image: "https://picsum.photos/seed/ins3/600/800",
    },
    {
      id: "i4",
      title: "TRIP CANCELLATION",
      subtitle: "AXA Travel",
      price: "From $22",
      image: "https://picsum.photos/seed/ins4/600/800",
    },
    {
      id: "i5",
      title: "BAGGAGE PROTECT",
      subtitle: "MetLife shield",
      price: "From $9",
      image: "https://picsum.photos/seed/ins5/600/800",
    },
  ],
  Activity: [
    {
      id: "a1",
      title: "DESERT SAFARI",
      subtitle: "Dubai Adventure",
      price: "From $85",
      image: "https://picsum.photos/seed/act1/600/800",
    },
    {
      id: "a2",
      title: "SCUBA DIVING",
      subtitle: "Maldives Reef",
      price: "From $120",
      image: "https://picsum.photos/seed/act2/600/800",
    },
    {
      id: "a3",
      title: "CITY TOUR",
      subtitle: "Tokyo Explorer",
      price: "From $65",
      image: "https://picsum.photos/seed/act3/600/800",
    },
    {
      id: "a4",
      title: "MOUNTAIN HIKING",
      subtitle: "Swiss Alps",
      price: "From $95",
      image: "https://picsum.photos/seed/act4/600/800",
    },
    {
      id: "a5",
      title: "CRUISE DINNER",
      subtitle: "Bosphorus Tour",
      price: "From $75",
      image: "https://picsum.photos/seed/act5/600/800",
    },
  ],
};

const TABS: TabCategory[] = [
  "Flight",
  "Hotel",
  "Visa",
  "Insurance",
  "Activity",
];

const CARD_GAP = 16;

export default function DealsCarouselSection() {
  const [activeTab, setActiveTab] = useState<TabCategory>("Flight");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [cardWidth, setCardWidth] = useState(321);
  const [containerWidth, setContainerWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const deals = DEALS_DATA[activeTab];

  // Measure card + container so the slide distance matches any breakpoint.
  useEffect(() => {
    const update = () => {
      const track = trackRef.current;
      if (!track) return;
      setContainerWidth(track.clientWidth);
      const first = track.firstElementChild as HTMLElement | null;
      if (first) setCardWidth(first.getBoundingClientRect().width);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeTab]);

  const visible = useMemo(() => {
    if (containerWidth <= 0) return 5;
    return Math.max(1, Math.floor(containerWidth / (cardWidth + CARD_GAP)));
  }, [containerWidth, cardWidth]);

  const maxIndex = Math.max(0, deals.length - visible);

  // Keep the index valid when the viewport or dataset changes.
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex, deals.length]);

  // Auto-swipe every 3 seconds (paused while hovered).
  useEffect(() => {
    if (isHovered || maxIndex === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered, maxIndex, deals.length]);

  const handleTabChange = (tab: TabCategory) => {
    setActiveTab(tab);
    setCurrentIndex(0);
  };

  const handlePrev = () => setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));

  return (
    <div className="flex w-full flex-col items-center gap-8 select-none overflow-hidden pt-6">
      {/* ==========================================
          1. TOP TAB NAVIGATION BAR
          ========================================== */}
      <div className="flex h-[60px] w-full max-w-[814px] items-center justify-between rounded-full bg-[#EAEAEA]/80 px-2 shadow-inner backdrop-blur-md sm:px-3">
        {TABS.map((tab, idx) => {
          const isActive = activeTab === tab;
          return (
            <React.Fragment key={tab}>
              <button
                onClick={() => handleTabChange(tab)}
                className={`flex h-[44px] flex-1 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 sm:text-[15px] ${
                  isActive
                    ? "scale-[1.02] bg-brand text-white shadow-md"
                    : "text-[#1C233D] hover:bg-black/5 hover:text-black"
                }`}
              >
                {tab}
              </button>

              {idx < TABS.length - 1 && (
                <div className="mx-0.5 hidden h-[26px] w-[1.5px] bg-gray-400/60 sm:mx-1 sm:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ==========================================
          2. CAROUSEL SECTION
          ========================================== */}
      <div
        className="relative w-full max-w-[1605px] overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous deals"
          className="absolute left-2 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-lg transition hover:bg-white md:flex"
        >
          <FaChevronLeft className="h-4 w-4" />
        </button>

        {/* Sliding Wrapper */}
        <div
          ref={trackRef}
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (cardWidth + CARD_GAP)}px)` }}
        >
          {deals.map((item) => (
            <div
              key={item.id}
              className="group relative h-[300px] w-[240px] flex-shrink-0 overflow-hidden rounded-xl shadow-sm sm:h-[350px] sm:w-[280px] md:h-[392px] md:w-[321px]"
              style={{ marginRight: CARD_GAP }}
            >
              {/* Background Image */}
              <Image
                src={item.image}
                alt={item.subtitle}
                fill
                unoptimized // Bypasses domain checks for testing placeholders
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, 321px"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/40" />

              {/* Title Text Stack */}
              <div className="absolute inset-x-0 top-6 z-20 flex flex-col items-center justify-center text-center">
                <span className="text-[14px] font-black tracking-wider text-white uppercase font-poppins drop-shadow-sm">
                  {item.title}
                </span>
                <span className="text-[15px] font-bold text-[#00A550] font-poppins drop-shadow-sm">
                  {item.subtitle}
                </span>
              </div>

              {/* Price Badge */}
              {item.price && (
                <div className="absolute bottom-4 left-4 z-20 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {item.price}
                </div>
              )}

              {/* Hover CTA */}
              <div className="absolute inset-x-0 bottom-0 z-20 flex translate-y-full items-center justify-center pb-4 transition-transform duration-300 group-hover:translate-y-0">
                <button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-md transition-colors hover:bg-primary hover:text-white">
                  View Deal
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          aria-label="Next deals"
          className="absolute right-2 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-lg transition hover:bg-white md:flex"
        >
          <FaChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
