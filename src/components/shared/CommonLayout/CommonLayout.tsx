"use client";

import React, { useEffect, useState, useRef } from "react";
import Footer from "@/components/shared/Footer/Footer";
import CommonLayoutNavbar from "../CommonLayoutNavbar/CommonLayoutNavbar";
import CommonLayoutSidebar from "../CommonLayoutSidebar/CommonLayoutSidebar";
import { useAuthStore } from "@/store/auth.store";
import { ROLE } from "@/constant";

interface CommonLayoutProps {
  children: React.ReactNode;
}

export default function CommonLayout({ children }: CommonLayoutProps) {
  const { user, isLoggedIn } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  const showSidebar = isLoggedIn && user && user.role !== ROLE.B2C;

  useEffect(() => {
    if (window.innerWidth >= 1024 && showSidebar) {
      setSidebarOpen(true);
    }
  }, [showSidebar]);

  useEffect(() => {
    const measureFooter = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
    };
    measureFooter();
    window.addEventListener("resize", measureFooter);
    return () => window.removeEventListener("resize", measureFooter);
  }, []);

  return (
    <div className="flex flex-col bg-white text-gray-800">
      <CommonLayoutNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="relative flex-1 w-full">
        <main className="">{children}</main>
        {showSidebar && (
          <aside className="fixed right-0 top-15 z-30 pointer-events-auto">
            <CommonLayoutSidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              footerHeight={footerHeight}
            />
          </aside>
        )}
      </div>
      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
}
