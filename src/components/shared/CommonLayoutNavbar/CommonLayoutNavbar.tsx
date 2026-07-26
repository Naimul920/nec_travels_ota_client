"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HiMenuAlt3 } from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi2";
import { FaUser } from "react-icons/fa";
import { useAuthStore } from "@/store/auth.store";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CommonLayoutNavbar ({
  sidebarOpen,
  setSidebarOpen,
}: NavbarProps) {
  const { user,isLoggedIn, isLoading, clearUser } = useAuthStore();
  console.log('User => ', user)
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    // await logout();
    router.push("/auth/signin");
  };
  return <> <h1>Joy Bangla</h1></>
  
  const profileName = "User";
  const avatarLetter = profileName.charAt(0).toUpperCase();
  const roleLower = user?.role?.toLowerCase() ?? "b2c";
  const profileLink = user?.role === Role.B2C ? "/b2c/profile" : `/console/${roleLower}/settings/profile`;

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-[1600px] mx-auto h-full px-4 md:px-6 flex items-center justify-between">
        <Link href={isAuthenticated ? `/console/${roleLower}` : "/"} className="flex items-center">
          <Image
            src="/assets/images/logo.png"
            alt="NEC Fly"
            width={130}
            height={40}
            priority
            className="h-auto w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-4 pr-12 lg:pr-14">
          {loading ? (
            <div className="w-20 h-9 rounded-full bg-gray-100 animate-pulse" />
          ) : !isAuthenticated || !user ? (
            <Link
              href="/auth/signin"
              className="flex items-center justify-center px-5 h-9 bg-[#00875A] rounded-full text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Sign In
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <div className="w-7 h-7 rounded-full bg-[#00875A] text-white font-bold flex items-center justify-center text-xs shrink-0">
                  {avatarLetter}
                </div>
                <span className="text-xs font-semibold text-gray-900 hidden sm:inline">
                  {profileName}
                </span>
                <HiChevronDown
                  size={14}
                  className={`text-gray-500 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
                  <Link
                    href={profileLink}
                    className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-gray-50 cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isAuthenticated && user && (
        <div className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 flex items-center h-full">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-700 hover:text-primary hover:bg-gray-100 rounded-md transition-all active:scale-95 cursor-pointer"
            aria-label="Toggle Sidebar Display"
          >
            <HiMenuAlt3 size={24} color="#747474" />
          </button>
        </div>
      )}
    </header>
  );
}
