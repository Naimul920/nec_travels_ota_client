"use client";

import { useRef, useState } from "react";
import Sidebar from "@/components/shared/Sidebar/Sidebar";
import { Footer, Header } from "@/components/shared";
import BackToTop from "@/components/common/BackToTop/BackToTop";
import clsx from "clsx";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollRef = useRef<HTMLElement | null>(null);

  const [scrollState, setScrollState] = useState({
    lastScroll: 0,
  });

  return (
    <div className="flex h-screen bg-white relative">
      {/* Sidebar Wrapper */}
      <div
        className={clsx(
          "md:fixed absolute overflow-y-auto md:z-999",
          mobileOpen && "z-999",
        )}
      >
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </div>

      {/* Main content frame */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden md:ml-[2%]">
        {/* Header */}
        <Header />

        {/* Content (scrollable viewport container) */}
        <main
          ref={scrollRef}
          onScroll={(e) =>
            setScrollState({
              lastScroll: e.currentTarget.scrollTop,
            })
          }
          className="relative flex-1 overflow-auto px-0 md:px-14"
          id="mainScrollContainer"
        >
          {/* Background Structural Image */}
          <div className="bg-[url('/assets/images/home_bg.png')] bg-cover bg-center md:h-[75%] h-full fixed w-full"></div>

          {/* Gradient Overlay */}
          <div className="md:mt-18 mt-18 mb-0 fixed inset-0 pointer-events-none bg-linear-to-b from-white/50 via-white/40 to-primary"></div>

          {/* Dynamic Page Router Node Injection */}
          <div className="relative container mx-auto text-justify text-sm md:p-5 md:px-0 md:z-10">
            {children}
          </div>

          {/* Floating Action Elements */}
          <BackToTop state={scrollState} scrollRef={scrollRef} />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
