"use client";

import Footer from "@/components/shared/B2cFooter/Footer";
import B2cNavbar from "@/components/shared/B2cNavbar/B2cNavbar";
import B2cSidebar from "@/components/shared/B2cSidebar/B2cSidebar";
import React, { useState, useEffect } from "react";

export default function B2cLayout({ children }: { children: React.ReactNode }) {
  // Sidebar open/minimized state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // SSR Safety flag to prevent server-client hydration mismatches
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setMounted(true);
    // Auto-open sidebar by default on large desktops if preferred
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

      {/* Main Container Core */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Main Content moves to the left */}
        <main className="flex-1 overflow-y-auto    transition-all duration-300">
          {children}
        </main>

        {/* Sidebar component moves here to layout natively on the right */}
        <B2cSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>
      <Footer />
    </div>
  );
}
