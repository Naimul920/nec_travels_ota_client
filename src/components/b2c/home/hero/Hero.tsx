"use client";

import React, { useState } from "react";
import HeroContent from "@/components/b2c/home/hero/HeroContent";
import FloatingTabs, { TabKey } from "@/components/b2c/home/hero/FloatingTabs";

export default function HomeHero() {
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);

  const handleTabChange = (key: TabKey) => {
    setActiveTab((prev) => (prev === key ? null : key));
  };

  return (
    <section
      className={`relative w-full h-[450px] bg-gray-900 select-none rounded-xl transition-all duration-300 ${
        activeTab ? "mb-[305px]" : "mb-12"
      }`}
    >
      <HeroContent />

      <FloatingTabs activeTab={activeTab} onTabChange={handleTabChange} />
    </section>
  );
}
