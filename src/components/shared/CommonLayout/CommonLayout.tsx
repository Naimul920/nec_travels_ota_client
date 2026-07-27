"use client";

import React, { useEffect, useState } from "react";
import Footer from "@/components/shared/B2cFooter/B2cFooter";
import CommonLayoutNavbar from "../CommonLayoutNavbar/CommonLayoutNavbar";
import CommonLayoutSidebar from "../CommonLayoutSidebar/CommonLayoutSidebar";

interface CommonLayoutProps {
  children: React.ReactNode;
}

export default function CommonLayout({ children }: CommonLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  if (!mounted) {
    return <div className="min-h-screen animate-pulse bg-gray-50" />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-800">
      {/* Header */}
      <CommonLayoutNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="relative min-h-screen flex-1 w-full">
        <main className="min-w-0 w-full">{children}</main>

        {/* Sidebar */}
        <aside className="pointer-events-auto fixed right-0 top-15 z-30">
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
