"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { IoIosAirplane } from "react-icons/io";
import {
  AirplaneIcon,
  DashedLineSvg,
  BottomAirplanesSvg,
} from "@/components/shared/icons/decorative";
import { subscribeNewsletterAction } from "@/actions/newsletter.action";
import { SuccessAlert, ErrorAlert } from "@/components/common/Alert/Alert";

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



const BARCODE_BARS = [
  2, 4, 1, 3, 5, 2, 1, 4, 3, 2, 5, 1, 3, 2, 4, 1, 5, 2, 3, 1, 4, 2, 1, 3, 5, 2,
];

export function PopularDestinationsCarousal() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const total = useMemo(() => DESTINATIONS.length, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (isPaused || total <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [isPaused, total]);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const targetEmail = email.trim();
    if (!targetEmail || subscribing) return;

    setSubscribing(true);
    try {
      const res = await subscribeNewsletterAction(targetEmail);
      if (res.success) {
        SuccessAlert("Subscribed", res.message);
        setEmail("");
      } else {
        ErrorAlert("Subscription failed", res.message);
      }
    } catch {
      ErrorAlert("Subscription failed", "Please try again later");
    } finally {
      setSubscribing(false);
    }
  };

  const getCardStyle = (index: number): string => {
    const offset = (index - currentIndex + total) % total;

    if (offset === 0) {
      return "z-30 w-[250px] h-[350px] md:w-[320px] md:h-[460px] xl:w-[380px] xl:h-[520px] scale-100 opacity-100 translate-x-0 shadow-[0_25px_60px_rgba(0,0,0,0.7)] ring-2 ring-brand/80";
    }

    if (offset === 1 || offset === total - 1) {
      const isRight = offset === 1;
      const translation = isRight
        ? "translate-x-[180px] md:translate-x-[280px] xl:translate-x-[360px]"
        : "-translate-x-[180px] md:-translate-x-[280px] xl:-translate-x-[360px]";

      return `${translation} z-20 w-[190px] h-[280px] md:w-[260px] md:h-[380px] xl:w-[300px] xl:h-[440px] scale-95 opacity-80 shadow-xl brightness-90`;
    }

    if (offset === 2 || offset === total - 2) {
      const isRight = offset === 2;
      const translation = isRight
        ? "translate-x-[300px] md:translate-x-[460px] xl:translate-x-[650px]"
        : "-translate-x-[300px] md:-translate-x-[460px] xl:-translate-x-[650px]";

      return `${translation} z-10 w-[150px] h-[220px] md:w-[200px] md:h-[300px] xl:w-[240px] xl:h-[370px] scale-90 opacity-60 shadow-lg brightness-75`;
    }

    return "opacity-0 pointer-events-none scale-50 z-0";
  };

  return (
    <div className="w-full">
      {/* 3D Carousel Stack */}
      <div
        className="relative z-10 mx-auto my-6 flex h-[340px] w-full max-w-7xl items-center justify-center px-4 sm:px-6 md:h-[440px] lg:px-8 xl:h-[500px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsPaused(false);
          }
        }}
        aria-roledescription="carousel"
        aria-label="Popular destinations"
      >
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          aria-label="Previous destination"
          className="absolute left-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-brand hover:text-brand sm:left-8 md:h-12 md:w-12 lg:left-[14%]"
        >
          <svg
            className="h-6 w-6 fill-none stroke-current"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          aria-label="Next destination"
          className="absolute right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-brand hover:text-brand sm:right-8 md:h-12 md:w-12 lg:right-[14%]"
        >
          <svg
            className="h-6 w-6 fill-none stroke-current"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Cards */}
        <div className="perspective-[1000px] relative flex h-full w-full items-center justify-center">
          {DESTINATIONS.map((item, index) => {
            const cardClass = getCardStyle(index);
            const isCenter = (index - currentIndex + total) % total === 0;

            return (
              <div
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                className={`absolute cursor-pointer overflow-hidden rounded-3xl backdrop-blur-sm ring-1 ring-slate-200/70 transition-all duration-500 ease-out ${cardClass}`}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  priority={isCenter}
                  sizes="(max-width: 768px) 250px, (max-width: 1280px) 320px, 380px"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                />

                {isCenter && (
                  <>
                    <div className="absolute inset-x-0 top-0 flex h-28 items-start justify-center bg-gradient-to-b from-[#0E1A2E]/90 via-[#0E1A2E]/40 to-transparent pt-6">
                      <h3 className="text-center text-2xl font-bold tracking-wide text-white drop-shadow-md md:text-3xl xl:text-[36px]">
                        {item.name}
                      </h3>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-[#0E1A2E]/95 via-[#0E1A2E]/60 to-transparent pb-5 pt-10">
                      <IoIosAirplane className="-rotate-45 text-brand" size={16} />
                      <span className="font-plex-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90">
                        Explore Destination
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Boarding Pass Newsletter Card */}
      <div className="relative z-20 mx-auto mt-14 flex max-w-6xl flex-col overflow-hidden rounded-[28px] border border-brand/20 bg-white shadow-[0_25px_60px_-20px_rgba(0,165,80,0.25)] lg:mt-20 lg:flex-row">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-80" />

        <div className="flex flex-1 flex-col justify-center gap-2 px-8 py-10 text-center lg:px-12 lg:text-left">
          <p className="font-plex-mono text-xs font-semibold tracking-[0.3em] text-brand">
            STAY UPDATED
          </p>
          <h2 className="font-grotesk text-2xl font-bold text-slate-900 md:text-3xl xl:text-4xl">
            Subscribe to our newsletter
          </h2>
          <p className="text-sm text-slate-500">
            Fare drops and exclusive travel offers, straight to your inbox.
          </p>
        </div>

        <div className="relative hidden w-px shrink-0 border-l border-dashed border-brand/30 lg:block">
          <span className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-[#F0F6F3]" />
          <span className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-[#F0F6F3]" />
        </div>
        <div className="relative border-t border-dashed border-brand/30 lg:hidden">
          <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#F0F6F3]" />
          <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#F0F6F3]" />
        </div>

        <div className="flex flex-1 flex-col justify-center gap-4 px-8 py-10 lg:px-12">
          <form
            onSubmit={handleSubscribe}
            className="flex w-full flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 w-full shrink-0 rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/40 sm:flex-1"
              required
            />

            <button
              type="submit"
              disabled={subscribing}
              className="group flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-8 font-semibold text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-brand/25 disabled:opacity-60 disabled:cursor-not-allowed sm:w-auto"
            >
              {subscribing ? "Subscribing..." : "Subscribe"}
              <IoIosAirplane
                className="-rotate-45 transition-transform duration-300 group-hover:translate-x-1"
                size={18}
              />
            </button>
          </form>

          <div>
            <div className="flex h-5 items-end gap-[2px]">
              {BARCODE_BARS.map((w, i) => (
                <div
                  key={i}
                  className="bg-brand/40"
                  style={{ width: `${w}px`, height: "100%" }}
                />
              ))}
            </div>
            <p className="mt-1 font-plex-mono text-[9px] tracking-[0.25em] text-slate-400">
              NEC TRAVELS · BOARDING PASS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
