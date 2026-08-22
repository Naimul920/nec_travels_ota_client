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

  const isB2BUser = isLoggedIn && user?.role === ROLE.B2B;
  const showSidebar = isLoggedIn && user?.role !== ROLE.B2C;
  const isLanding = pathname === "/";
  const isAuthPage = pathname.startsWith("/auth/");

  const mainClassName = isLanding
    ? "w-full flex-1"
    : isAuthPage
      ? "mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-20"
    : clsx(
        "mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8",
        isB2BUser ? "py-4" : ""
      );

  return (
    <div className="relative flex min-h-dvh flex-col bg-white text-gray-800">
      {/* Half-page bottom gradient overlay for B2B users (above footer) */}
      {isB2BUser && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 bottom-0 h-[55vh] w-full border-0 bg-linear-to-t from-[#6ed498] via-[#a3e3ba]/70 to-transparent bg-center outline-none [mask-image:linear-gradient(to_top,black_0%,black_55%,transparent_100%)]"
        />
      )}

      <CommonLayoutNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="relative flex min-w-0 w-full flex-1">
        <main className={mainClassName}>{children}</main>

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

      <div className="relative shrink-0">
        <Footer />
      </div>
    </div>
  );
}
