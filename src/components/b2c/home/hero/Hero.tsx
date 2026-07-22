"use client";

import React, { useState } from "react";
import HeroContent from "@/components/b2c/home/hero/HeroContent";
import FloatingTabs from "@/components/b2c/home/hero/FloatingTabs";

export default function HomeHero() {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleTabChange = (key: string) => {
    // Toggle tab open/closed on click
    setActiveKey((prev) => (prev === key ? null : key));
  };

  return (
    <section
      className={`relative w-full h-[450px] bg-gray-900 select-none rounded-xl transition-all duration-300 ${
        activeKey ? "mb-[420px]" : "mb-16"
      }`}
    >
      <HeroContent />

      {/* 
        Floating Anchor Container:
        Pin-pointed on Hero's bottom boundary using top-full -translate-y-1/2
      */}
      <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 z-40 w-full max-w-[1100px] px-4 lg:px-0">
        <FloatingTabs activeKey={activeKey} onTabChange={handleTabChange} />
      </div>
    </section>
  );
}
