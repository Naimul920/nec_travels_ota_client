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

  const isB2BUser = isLoggedIn && Boolean(user) && user?.role === ROLE.B2B;
  const showSidebar = isLoggedIn && Boolean(user) && user?.role !== ROLE.B2C;
  const isLanding = pathname === "/";

  return (
    <div className="relative flex min-h-dvh flex-col bg-white text-gray-800">
      <div className="relative flex flex-1 flex-col">
        {/* Half-page bottom gradient overlay for B2B users (above footer) */}
        {isB2BUser && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[50vh] bg-linear-to-t from-[#a3e3ba] via-[#6ed498] to-transparent"
          />
        )}

        <CommonLayoutNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="relative flex w-full flex-1">
          <main
            className={clsx(
              "w-full flex-1",
              isLanding
                ? "pt-5"
                : clsx(
                    "mx-auto max-w-7xl px-2 sm:px-4",
                    isB2BUser ? "py-4" : "py-8 sm:py-12"
                  )
            )}
          >
            {children}
          </main>

          {showSidebar && (
            <aside
              aria-hidden={!sidebarOpen}
              className={clsx(
                "fixed inset-0 z-40",
                sidebarOpen ? "pointer-events-auto" : "pointer-events-none"
              )}
            >
              <CommonLayoutSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            </aside>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}