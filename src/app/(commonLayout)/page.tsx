"use client";
import ExclusiveOffer from "@/components/modules/b2c/home/exclusiveOffer/ExclusiveOffer";
import ExploreNec from "@/components/modules/b2c/home/explore/ExploreNec";
import HomeHero from "@/components/modules/b2c/home/hero/Hero";
import PopularDestination from "@/components/modules/b2c/home/popularDestination/PopularDestination";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 animate-pulse" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-sans">
      {/* <B2cNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

      <div className="relative flex-1 w-full min-h-screen">
        <main className="w-full min-w-0">
          <HomeHero />
          <ExploreNec />
          <ExclusiveOffer />
          <PopularDestination />
        </main>
      </div>
    </div>
  );
}
