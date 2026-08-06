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
          <aside
            aria-hidden={!sidebarOpen}
            className={clsx(
              "fixed inset-0 z-40",
              sidebarOpen ? "pointer-events-auto" : "pointer-events-none",
            )}
          >
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