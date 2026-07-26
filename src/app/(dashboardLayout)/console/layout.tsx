"use client";
import Footer from "@/components/shared/B2cFooter/B2cFooter";
import CommonLayoutNavbar from "@/components/shared/CommonLayoutNavbar/CommonLayoutNavbar";
import CommonLayoutSidebar from "@/components/shared/CommonLayoutSidebar/CommonLayoutSidebar";
import React, { useState, useEffect } from "react";

export default function B2cLayout({ children }: { children: React.ReactNode }) {
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
      {/* Universal B2C Header */}
      <CommonLayoutNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Body Container */}
      <div className="relative flex-1 w-full min-h-screen">
        {/* Children takes 100% full width across the entire screen */}
        <main className="w-full min-w-0">{children}</main>

        {/* Sidebar floats absolutely on the right without blocking children width */}
        <aside className="fixed right-0 top-15 z-30 pointer-events-auto">
          <CommonLayoutSidebar
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
