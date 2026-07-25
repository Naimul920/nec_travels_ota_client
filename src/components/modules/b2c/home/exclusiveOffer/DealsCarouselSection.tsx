"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Tab types
type TabCategory = "Flight" | "Hotel" | "Visa" | "Insurance" | "Activity";

interface DealCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

// Mock dataset categorized by tabs
const DEALS_DATA: Record<TabCategory, DealCard[]> = {
  Flight: [
    {
      id: "f1",
      title: "SUPER DEALS",
      subtitle: "Qatar Air",
      image: "https://picsum.photos/seed/plane1/600/800",
    },
    {
      id: "f2",
      title: "SUPER DEALS",
      subtitle: "Qatar Air",
      image: "https://picsum.photos/seed/plane2/600/800",
    },
    {
      id: "f3",
      title: "SUPER DEALS",
      subtitle: "Qatar Air",
      image: "https://picsum.photos/seed/plane3/600/800",
    },
    {
      id: "f4",
      title: "SUPER DEALS",
      subtitle: "Qatar Air",
      image: "https://picsum.photos/seed/plane4/600/800",
    },
    {
      id: "f5",
      title: "SUPER DEALS",
      subtitle: "Qatar Air",
      image: "https://picsum.photos/seed/plane5/600/800",
    },
    {
      id: "f6",
      title: "SUPER DEALS",
      subtitle: "Emirates",
      image: "https://picsum.photos/seed/plane6/600/800",
    },
    {
      id: "f7",
      title: "SUPER DEALS",
      subtitle: "Singapore Airlines",
      image: "https://picsum.photos/seed/plane7/600/800",
    },
  ],
  Hotel: [
    {
      id: "h1",
      title: "LUXURY STAY",
      subtitle: "Marriott Resort",
      image: "https://picsum.photos/seed/hotel1/600/800",
    },
    {
      id: "h2",
      title: "HOTEL DEALS",
      subtitle: "Hilton Suites",
      image: "https://picsum.photos/seed/hotel2/600/800",
    },
    {
      id: "h3",
      title: "BEST VALUE",
      subtitle: "Radisson Blu",
      image: "https://picsum.photos/seed/hotel3/600/800",
    },
    {
      id: "h4",
      title: "BEACH RESORT",
      subtitle: "InterContinental",
      image: "https://picsum.photos/seed/hotel4/600/800",
    },
    {
      id: "h5",
      title: "CITY CENTER",
      subtitle: "Hyatt Regency",
      image: "https://picsum.photos/seed/hotel5/600/800",
    },
    {
      id: "h6",
      title: "BOUTIQUE STAY",
      subtitle: "Four Seasons",
      image: "https://picsum.photos/seed/hotel6/600/800",
    },
  ],
  Visa: [
    {
      id: "v1",
      title: "EXPRESS VISA",
      subtitle: "Schengen Visa",
      image: "https://picsum.photos/seed/visa1/600/800",
    },
    {
      id: "v2",
      title: "EASY PROCESS",
      subtitle: "Dubai Tourist",
      image: "https://picsum.photos/seed/visa2/600/800",
    },
    {
      id: "v3",
      title: "QUICK APPROVAL",
      subtitle: "UK Visa",
      image: "https://picsum.photos/seed/visa3/600/800",
    },
    {
      id: "v4",
      title: "STUDENT VISA",
      subtitle: "USA Visit",
      image: "https://picsum.photos/seed/visa4/600/800",
    },
    {
      id: "v5",
      title: "TRAVEL READY",
      subtitle: "Malaysia eVisa",
      image: "https://picsum.photos/seed/visa5/600/800",
    },
  ],
  Insurance: [
    {
      id: "i1",
      title: "FULL COVERAGE",
      subtitle: "Global Secure",
      image: "https://picsum.photos/seed/ins1/600/800",
    },
    {
      id: "i2",
      title: "FAMILY PLAN",
      subtitle: "Travel Guard",
      image: "https://picsum.photos/seed/ins2/600/800",
    },
    {
      id: "i3",
      title: "MEDICAL COVER",
      subtitle: "Allianz Care",
      image: "https://picsum.photos/seed/ins3/600/800",
    },
    {
      id: "i4",
      title: "TRIP CANCELLATION",
      subtitle: "AXA Travel",
      image: "https://picsum.photos/seed/ins4/600/800",
    },
    {
      id: "i5",
      title: "BAGGAGE PROTECT",
      subtitle: "MetLife shield",
      image: "https://picsum.photos/seed/ins5/600/800",
    },
  ],
  Activity: [
    {
      id: "a1",
      title: "DESERT SAFARI",
      subtitle: "Dubai Adventure",
      image: "https://picsum.photos/seed/act1/600/800",
    },
    {
      id: "a2",
      title: "SCUBA DIVING",
      subtitle: "Maldives Reef",
      image: "https://picsum.photos/seed/act2/600/800",
    },
    {
      id: "a3",
      title: "CITY TOUR",
      subtitle: "Tokyo Explorer",
      image: "https://picsum.photos/seed/act3/600/800",
    },
    {
      id: "a4",
      title: "MOUNTAIN HIKING",
      subtitle: "Swiss Alps",
      image: "https://picsum.photos/seed/act4/600/800",
    },
    {
      id: "a5",
      title: "CRUISE DINNER",
      subtitle: "Bosphorus Tour",
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

export default function DealsCarouselSection() {
  const [activeTab, setActiveTab] = useState<TabCategory>("Flight");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const deals = DEALS_DATA[activeTab];
  const maxIndex = Math.max(0, deals.length - 5);

  // Auto-swipe functionality (Every 3 seconds)
  useEffect(() => {
    if (isHovered || deals.length <= 5) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, maxIndex, deals.length]);

  // Reset index on tab change
  const handleTabChange = (tab: TabCategory) => {
    setActiveTab(tab);
    setCurrentIndex(0);
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 py-6 select-none overflow-hidden">
      {/* ==========================================
          1. TOP TAB NAVIGATION BAR (814px Wide)
          ========================================== */}
      <div className="w-[814px] max-w-full h-[60px] bg-[#EAEAEA]/80 backdrop-blur-md rounded-full flex items-center justify-between px-3 shadow-inner">
        {TABS.map((tab, idx) => {
          const isActive = activeTab === tab;
          return (
            <React.Fragment key={tab}>
              <button
                onClick={() => handleTabChange(tab)}
                className={`flex-1 h-[44px] rounded-full text-[15px] font-semibold transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? "bg-[#FF0000] text-white shadow-md scale-[1.02]"
                    : "text-[#1C233D] hover:text-black hover:bg-black/5"
                }`}
              >
                {tab}
              </button>

              {/* Vertical Separator Line between tabs */}
              {idx < TABS.length - 1 && (
                <div className="w-[1.5px] h-[26px] bg-gray-400/60 mx-1" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ==========================================
          2. CAROUSEL SECTION (5 Visible Items, 321px x 392px)
          ========================================== */}
      <div
        className="w-full max-w-[1605px] overflow-hidden relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Sliding Wrapper */}
        <div
          className="flex transition-transform duration-700 ease-in-out gap-0"
          style={{ transform: `translateX(-${currentIndex * 321}px)` }}
        >
          {deals.map((item) => (
            <div
              key={item.id}
              className="w-[321px] h-[392px] flex-shrink-0 relative group overflow-hidden border-r border-white/20 last:border-none"
            >
              {/* Background Image */}
              <Image
                src={item.image}
                alt={item.subtitle}
                fill
                unoptimized // Bypasses domain checks for testing placeholders
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Dark Overlay (Top Header Vignette) */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent z-10" />

              {/* Title Text Stack */}
              <div className="absolute top-6 inset-x-0 z-20 flex flex-col items-center justify-center text-center">
                <span className="text-white text-[14px] font-black tracking-wider uppercase font-poppins drop-shadow-sm">
                  {item.title}
                </span>
                <span className="text-[#00A550] text-[15px] font-bold font-poppins drop-shadow-sm">
                  {item.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
