"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HiMenuAlt3 } from "react-icons/hi";
import { SiAppstore } from "react-icons/si";
import { IoLogoGooglePlaystore } from "react-icons/io5";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const B2cNavbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white border-b border-gray-100 shadow-xs">
      {/* 1. Main Content Container (Max 1600px, Centered) */}
      <div className="max-w-[1600px] mx-auto h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left Platform Brand Logo Space */}
        <Link href="/b2c" className="flex items-center">
          <Image
            src="/assets/images/logo.png"
            alt="NEC Fly"
            width={130}
            height={40}
            priority
            className="h-auto w-auto object-contain"
          />
        </Link>

        {/* Center/Right Desktop Action & Navigation Controls Group */}
        <div className="flex items-center gap-4 pr-12 lg:pr-14">
          {/* Native App Store Storefront Vectors */}
          <div className="hidden xl:flex items-center gap-2">
            <button
              className="cursor-pointer hover:opacity-85 transition-opacity"
              aria-label="Download on App Store"
            >
              <SiAppstore size={25} className="text-primary" />
            </button>
            <button
              className="cursor-pointer hover:opacity-85 transition-opacity"
              aria-label="Download on Google Play"
            >
              <IoLogoGooglePlaystore size={25} className="text-primary" />
            </button>
          </div>

          {/* Find My Trip Button */}
          <button className="hidden sm:inline-flex items-center justify-center px-4 h-7 bg-white border border-[#00875A] rounded-full text-red-600 text-xs font-semibold hover:bg-green-50/40 transition-colors cursor-pointer">
            Find My Trip
          </button>

          {/* Country Selector with Flag */}
          <button className="hidden sm:inline-flex items-center justify-center w-12.5 h-7 bg-white border border-[#00875A] rounded-full hover:bg-green-50/40 transition-colors cursor-pointer p-0 select-none">
            <div className="py-1 px-2 w-9/10 h-6 relative rounded-full overflow-hidden border border-gray-100/50 compact-flag">
              <Image
                src="/assets/flags/ussa.svg"
                alt="Selected flag"
                fill
                sizes="48px"
                priority
                className="object-cover"
              />
            </div>
          </button>

          {/* Assistance / Support Action */}
          <button className="hidden sm:inline-flex items-center justify-center px-4 h-7 bg-white border border-[#00875A] rounded-full text text-xs font-semibold hover:bg-green-50/40 transition-colors cursor-pointer">
            Help
          </button>

          {/* VIP Gateway Button */}
          <button className="flex items-center justify-end gap-2 p-2 h-10 bg-white border border-[#00875A] rounded-full text text-xs font-semibold hover:bg-green-50/40 transition-colors cursor-pointer">
            <div className="bg-black flex items-center justify-center text-md text-white font-semibold uppercase rounded-full w-7 h-7">
              <div>vip</div>
            </div>
            <div className="inline-flex flex-col">
              <span className="text-[10px] leading-tight text-red-500 group-hover:text-primary transition-colors">
                Sign In
              </span>
              <span className="text-xs font-bold leading-tight text-gray-900 group-hover:text-primary transition-colors">
                Join VIP
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Absolute Sidebar Toggle Button (Always Pinned to Far Right Screen Edge) */}
      <div className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 flex items-center h-full">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-700 hover:text-primary hover:bg-gray-100 rounded-md transition-all active:scale-95 cursor-pointer"
          aria-label="Toggle Sidebar Display"
        >
          <HiMenuAlt3 size={24} color="#747474" />
        </button>
      </div>
    </header>
  );
};

export default B2cNavbar;
