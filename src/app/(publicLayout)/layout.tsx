"use client";
import Footer from "@/components/shared/B2cFooter/B2cFooter";
import B2cNavbar from "@/components/shared/B2cNavbar/B2cNavbar";
import B2cSidebar from "@/components/shared/B2cSidebar/B2cSidebar";
import React, { useState, useEffect } from "react";

export default function B2cLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
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
      {/* Universal B2C Header */}
      <B2cNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Body Container */}
      <div className="relative flex-1 w-full min-h-screen">
        {/* Children takes 100% full width across the entire screen */}
        <main className="w-full min-w-0">{children}</main>

        {/* Sidebar floats absolutely on the right without blocking children width */}
        <aside className="fixed right-0 top-15 z-30 pointer-events-auto">
          <B2cSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </aside>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
