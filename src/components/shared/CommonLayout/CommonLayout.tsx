"use client";

import React, { useState } from "react";
import Footer from "@/components/shared/Footer/Footer";
import CommonLayoutNavbar from "../CommonLayoutNavbar/CommonLayoutNavbar";
import CommonLayoutSidebar from "../CommonLayoutSidebar/CommonLayoutSidebar";
import { useAuthStore } from "@/store/auth.store";
import { ROLE } from "@/constant";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface CommonLayoutProps {
  children: React.ReactNode;
}

export default function CommonLayout({ children }: CommonLayoutProps) {
  const { user, isLoggedIn } = useAuthStore();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showSidebar = isLoggedIn && user && user.role !== ROLE.B2C;
  const isLanding = pathname === "/";

  return (
    <div className="flex min-h-dvh flex-col bg-white text-gray-800">
      <CommonLayoutNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="relative flex w-full flex-1">
        <main
          className={clsx(
            "w-full flex-1 bg-white",
            isLanding ? "pt-5" : "mx-auto max-w-7xl px-2 py-8 sm:px-4 sm:py-12"
          )}
        >
          {children}
        </main>

        {showSidebar && (
          <aside className="sticky top-15 h-[calc(100vh-3.75rem)] z-30 pointer-events-auto">
            <CommonLayoutSidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </aside>
        )}
      </div>

      <Footer />
    </div>
  );
}