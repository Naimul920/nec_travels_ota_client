"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlane,
  FaHotel,
  FaPassport,
  FaShieldAlt,
  FaCompass,
  FaTag,
} from "react-icons/fa";
import {
  AirplaneIcon,
  BottomAirplanesSvg,
  DashedLineSvg,
} from "@/components/shared/icons/decorative";

type TabCategory = "Flight" | "Hotel" | "Visa" | "Insurance" | "Activity";

interface DealCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  price?: string;
  badge?: string;
}

const DEALS_DATA: Record<TabCategory, DealCard[]> = {
  Flight: [
    {
      id: "f1",
      title: "SUPER DEALS",
      subtitle: "Qatar Airways",
      price: "$299",
      badge: "Save 30%",
      image: "https://picsum.photos/seed/plane1/600/800",
    },
    {
      id: "f2",
      title: "LIMITED OFFER",
      subtitle: "Emirates Air",
      price: "$399",
      badge: "Best Seller",
      image: "https://picsum.photos/seed/plane2/600/800",
    },
    {
      id: "f3",
      title: "EARLY BIRD",
      subtitle: "Singapore Airlines",
      price: "$459",
      image: "https://picsum.photos/seed/plane3/600/800",
    },
    {
      id: "f4",
      title: "FLIGHT SALE",
      subtitle: "Etihad Airways",
      price: "$349",
      badge: "Hot Deal",
      image: "https://picsum.photos/seed/plane4/600/800",
    },
    {
      id: "f5",
      title: "SUPER DEALS",
      subtitle: "Turkish Airlines",
      price: "$310",
      image: "https://picsum.photos/seed/plane5/600/800",
    },
    {
      id: "f6",
      title: "SPECIAL OFFER",
      subtitle: "Cathay Pacific",
      price: "$420",
      image: "https://picsum.photos/seed/plane6/600/800",
    },
  ],
  Hotel: [
    {
      id: "h1",
      title: "LUXURY STAY",
      subtitle: "Marriott Resort",
      price: "$89",
      badge: "5 Star",
      image: "https://picsum.photos/seed/hotel1/600/800",
    },
    {
      id: "h2",
      title: "HOTEL DEALS",
      subtitle: "Hilton Suites",
      price: "$75",
      image: "https://picsum.photos/seed/hotel2/600/800",
    },
    {
      id: "h3",
      title: "BEST VALUE",
      subtitle: "Radisson Blu",
      price: "$64",
      badge: "Breakfast Incl.",
      image: "https://picsum.photos/seed/hotel3/600/800",
    },
    {
      id: "h4",
      title: "BEACH RESORT",
      subtitle: "InterContinental",
      price: "$119",
      image: "https://picsum.photos/seed/hotel4/600/800",
    },
    {
      id: "h5",
      title: "CITY CENTER",
      subtitle: "Hyatt Regency",
      price: "$98",
      image: "https://picsum.photos/seed/hotel5/600/800",
    },
  ],
  Visa: [
    {
      id: "v1",
      title: "EXPRESS VISA",
      subtitle: "Schengen Visa",
      price: "$99",
      badge: "Fast Track",
      image: "https://picsum.photos/seed/visa1/600/800",
    },
    {
      id: "v2",
      title: "EASY PROCESS",
      subtitle: "Dubai Tourist",
      price: "$45",
      image: "https://picsum.photos/seed/visa2/600/800",
    },
    {
      id: "v3",
      title: "QUICK APPROVAL",
      subtitle: "UK Tourist Visa",
      price: "$139",
      image: "https://picsum.photos/seed/visa3/600/800",
    },
    {
      id: "v4",
      title: "STUDENT VISA",
      subtitle: "USA Visit",
      price: "$159",
      image: "https://picsum.photos/seed/visa4/600/800",
    },
  ],
  Insurance: [
    {
      id: "i1",
      title: "FULL COVERAGE",
      subtitle: "Global Secure",
      price: "$12",
      badge: "Popular",
      image: "https://picsum.photos/seed/ins1/600/800",
    },
    {
      id: "i2",
      title: "FAMILY PLAN",
      subtitle: "Travel Guard",
      price: "$18",
      image: "https://picsum.photos/seed/ins2/600/800",
    },
    {
      id: "i3",
      title: "MEDICAL COVER",
      subtitle: "Allianz Care",
      price: "$15",
      image: "https://picsum.photos/seed/ins3/600/800",
    },
    {
      id: "i4",
      title: "TRIP PROTECTION",
      subtitle: "AXA Travel",
      price: "$22",
      image: "https://picsum.photos/seed/ins4/600/800",
    },
  ],
  Activity: [
    {
      id: "a1",
      title: "DESERT SAFARI",
      subtitle: "Dubai Adventure",
      price: "$85",
      badge: "Top Rated",
      image: "https://picsum.photos/seed/act1/600/800",
    },
    {
      id: "a2",
      title: "SCUBA DIVING",
      subtitle: "Maldives Reef",
      price: "$120",
      image: "https://picsum.photos/seed/act2/600/800",
    },
    {
      id: "a3",
      title: "CITY TOUR",
      subtitle: "Tokyo Explorer",
      price: "$65",
      image: "https://picsum.photos/seed/act3/600/800",
    },
    {
      id: "a4",
      title: "MOUNTAIN HIKING",
      subtitle: "Swiss Alps Tour",
      price: "$95",
      image: "https://picsum.photos/seed/act4/600/800",
    },
  ],
};

const TAB_CONFIG: { id: TabCategory; label: string; icon: React.ElementType }[] = [
  { id: "Flight", label: "Flights", icon: FaPlane },
  { id: "Hotel", label: "Hotels", icon: FaHotel },
  { id: "Visa", label: "Visas", icon: FaPassport },
  { id: "Insurance", label: "Insurance", icon: FaShieldAlt },
  { id: "Activity", label: "Activities", icon: FaCompass },
];

const CARD_GAP = 20;

export default function ExclusiveOffer() {
  const [activeTab, setActiveTab] = useState<TabCategory>("Flight");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [cardWidth, setCardWidth] = useState(300);
  const [containerWidth, setContainerWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const deals = DEALS_DATA[activeTab];

  // Calculate widths dynamically
  useEffect(() => {
    const updateDimensions = () => {
      const track = trackRef.current;
      if (!track) return;
      setContainerWidth(track.clientWidth);
      const firstCard = track.firstElementChild as HTMLElement | null;
      if (firstCard) {
        setCardWidth(firstCard.getBoundingClientRect().width);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [activeTab]);

  const visibleCount = useMemo(() => {
    if (containerWidth <= 0) return 4;
    return Math.max(1, Math.floor(containerWidth / (cardWidth + CARD_GAP)));
  }, [containerWidth, cardWidth]);

  const maxIndex = Math.max(0, deals.length - visibleCount);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex, deals.length]);

  // Auto-play infinite loop effect
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, maxIndex]);

  const handleTabChange = (tab: TabCategory) => {
    setActiveTab(tab);
    setCurrentIndex(0);
  };

  // Infinite loop navigation handlers
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F6F3] via-[#FBFDFC] to-[#F0F6F3] py-20 text-slate-900 select-none">
      {/* Brand Ambient Glows */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-brand/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full bg-brand/[0.07] blur-[120px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/[0.07] blur-[140px]" />

      {/* Dotted World Map Overlay (travel motif) */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
        viewBox="0 0 400 560"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="worldDotsExclusive"
            width="9"
            height="9"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.4" cy="1.4" r="1.4" fill="#00A550" />
          </pattern>
        </defs>
        <g>
          {[
            "M18 96c10-22 34-30 58-24 20 5 32 20 48 18 16-2 26 10 20 26-8 20-34 24-54 20-8-2-14 4-24 2-24-4-44-18-52-38-4-2-2-2 4-4Z",
            "M150 190c14-10 32-8 40 4 10 14 4 30-10 36-16 6-34 0-40-14-4-10 0-20 10-26Z",
            "M60 210c18-6 40 2 46 18 6 16-4 32-22 36-20 4-40-6-46-22-4-14 4-26 22-32Z",
            "M210 60c26-8 56 2 68 24 10 18 4 38-14 46-10 4-18 14-30 12-22-4-36-22-40-42-4-18 2-34 16-40Z",
            "M300 110c22-4 44 8 50 26 6 18-4 34-22 40-8 2-14 10-24 8-20-4-32-20-34-38-2-16 8-30 30-36Z",
            "M120 40c16-6 34 0 40 14 6 14-2 28-18 32-14 4-28-4-32-16-4-12 2-24 10-30Z",
          ].map((d, i) => (
            <path key={i} d={d} fill="url(#worldDotsExclusive)" />
          ))}
        </g>
      </svg>

      <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
        {/* Header Container */}
        <div className="relative z-10 mx-auto mb-12 max-w-3xl text-center">
          <div className="flex flex-col items-center gap-4">
            {/* Eyebrow Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 backdrop-blur-md">
              <FaTag className="h-3 w-3 text-brand" />
              <span className="font-plex-mono text-xs font-semibold tracking-[0.25em] text-brand uppercase">
                Handpicked Savings
              </span>
            </span>

            {/* Heading */}
            <h2 className="font-grotesk text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Exclusive <span className="text-brand">Travel Offers</span>
            </h2>

            {/* Subtext */}
            <p className="max-w-xl text-pretty text-sm leading-relaxed text-slate-500 sm:text-base">
              Unbeatable rates on flight tickets, luxury stays, visa processing, and insurance packages.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="relative z-10 mb-12 flex justify-center">
          <div className="flex w-full max-w-2xl items-center justify-between rounded-full border border-slate-200 bg-white/80 p-1.5 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-2">
            {TAB_CONFIG.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-xs font-medium transition-all duration-300 sm:py-3 sm:text-sm ${
                    isActive
                      ? "bg-brand text-white shadow-lg shadow-brand/25"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Carousel Content */}
        <div
          className="relative z-10 mx-auto w-full overflow-hidden px-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Previous Arrow (Wraps to end) */}
          <button
            onClick={handlePrev}
            aria-label="Previous deal"
            className="absolute left-0 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-brand hover:bg-brand/10 hover:text-brand active:scale-95"
          >
            <FaChevronLeft className="h-4 w-4" />
          </button>

          {/* Slider Track */}
          <div
            ref={trackRef}
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (cardWidth + CARD_GAP)}px)`,
            }}
          >
            {deals.map((item) => (
              <div
                key={item.id}
                className="group relative h-[380px] w-[260px] shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-brand/50 hover:shadow-2xl hover:shadow-brand/20 sm:h-[420px] sm:w-[290px] md:w-[310px]"
                style={{ marginRight: CARD_GAP }}
              >
                {/* Image */}
                <Image
                  src={item.image}
                  alt={item.subtitle}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 260px, (max-width: 768px) 290px, 310px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050A14] via-[#050A14]/40 to-transparent opacity-90" />
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />

                {/* Badge */}
                {item.badge && (
                  <div className="absolute left-4 top-4 z-20 rounded-full border border-brand/40 bg-brand/20 px-3 py-1 backdrop-blur-md">
                    <span className="font-plex-mono text-[10px] font-semibold tracking-wider text-brand uppercase">
                      {item.badge}
                    </span>
                  </div>
                )}

                {/* Header Text */}
                <div className="absolute inset-x-0 top-12 z-20 flex flex-col items-center px-4 text-center">
                  <span className="font-plex-mono text-[11px] font-bold tracking-[0.2em] text-white/80 uppercase">
                    {item.title}
                  </span>
                  <h3 className="font-grotesk text-lg font-bold text-white drop-shadow-sm">
                    {item.subtitle}
                  </h3>
                </div>

                {/* Bottom Footer */}
                <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end p-5">
                  <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
                    <div>
                      <span className="text-xs text-[#A3B8CC]">Starting from</span>
                      <p className="text-2xl font-bold text-white">{item.price}</p>
                    </div>

                    <button className="group/btn flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-brand/30">
                      <span>Claim Deal</span>
                      <FaChevronRight className="h-2.5 w-2.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Next Arrow (Wraps to start) */}
          <button
            onClick={handleNext}
            aria-label="Next deal"
            className="absolute right-0 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-brand hover:bg-brand/10 hover:text-brand active:scale-95"
          >
            <FaChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Carousel Pagination Dots */}
        {maxIndex > 0 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "w-8 bg-brand" : "w-2 bg-brand/20 hover:bg-brand/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}