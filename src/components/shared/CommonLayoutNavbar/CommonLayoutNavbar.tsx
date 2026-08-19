"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiMenuAlt3 } from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi2";
import {
  FiUser,
  FiList,
  FiLogOut,
  FiLogIn,
  FiBriefcase,
} from "react-icons/fi";
import { BsWallet2 } from "react-icons/bs";
import { useAuthStore } from "@/store/auth.store";
import { logoutAction } from "@/actions/auth.action";
import { ROLE } from "@/constant";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40";

function Avatar({
  src,
  letter,
  size = "h-8 w-8",
}: {
  src?: string | null;
  letter: string;
  size?: string;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full ${size} ${
        src ? "" : "bg-linear-to-br from-brand to-emerald-600"
      }`}
    >
      {src ? (
        <img src={src} alt="Profile" className="h-full w-full object-cover" />
      ) : (
        <span className="text-sm font-bold text-white">{letter}</span>
      )}
    </div>
  );
}

export default function CommonLayoutNavbar({
  sidebarOpen,
  setSidebarOpen,
}: NavbarProps) {
  const { user, isLoggedIn, isLoading, clearUser } = useAuthStore();
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
    await logoutAction();
    clearUser();
    router.push("/auth/signin");
    router.refresh();
  };

  const showSidebarToggle = isLoggedIn && user && user.role !== ROLE.B2C;
  const isB2B = user?.role === ROLE.B2B;
  const headerLogo =
    isB2B && user?.logo ? user.logo : "/assets/images/logo.png";
  const profileName = user?.full_name ?? "User";
  const avatarLetter = profileName.charAt(0).toUpperCase();
  const agencyName = user?.agency_name || "Agency name";
  const agencyCode = user?.agency_code || "Agent Code";
  const agencyBalance = user?.balance?.toLocaleString() ?? "0.00";
  const agencyCurrency = user?.currency || "BDT";
  const roleLower = user?.role?.toLowerCase() ?? "b2c";
  const profileLink = `/console/${roleLower}/profile`;
  const bookingsLink = `/console/${roleLower}/bookings`;

  return (
    <header className="sticky top-0 z-[999] w-full border-b border-gray-200/70 bg-white/85 shadow-[0_4px_20px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div
        className={`mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 ${
          showSidebarToggle ? "pr-12 sm:pr-14" : ""
        }`}
      >
        {/* Logo */}
        <Link
          href={
            isLoggedIn && user?.role !== ROLE.B2C
              ? `/console/${roleLower}`
              : "/"
          }
          className="flex shrink-0 items-center transition-opacity duration-200 hover:opacity-80"
        >
          {isLoading ? (
            <div className="h-[50px] w-[130px] animate-pulse rounded-md bg-gray-100" />
          ) : (
            <img
              src={headerLogo}
              alt={isB2B && user?.logo ? "Agency logo" : "NEC Fly"}
              width={130}
              height={40}
              className={`h-[50px] w-auto object-contain ${focusRing} rounded-md`}
            />
          )}
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-gray-100" />
          ) : !isLoggedIn || !user ? (
            <Link
              href="/auth/signin"
              className={`flex h-9 cursor-pointer items-center justify-center gap-2 rounded-full bg-brand px-5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand/90 hover:shadow-md hover:shadow-brand/25 active:scale-95 ${focusRing}`}
            >
              <FiLogIn className="h-3.5 w-3.5" />
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-2.5">
              {isB2B && user && (
                <div className="hidden items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 md:flex">
                  <BsWallet2
                    className="h-3.5 w-3.5 shrink-0 text-brand"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-bold text-brand">
                    {agencyBalance} {agencyCurrency}
                  </span>
                </div>
              )}

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className={`flex h-10 cursor-pointer items-center gap-1.5 rounded-full border pl-1 pr-2 transition-colors hover:border-gray-300 hover:bg-gray-50 ${
                    dropdownOpen
                      ? "border-brand/50 ring-2 ring-brand/20"
                      : "border-gray-200"
                  } ${focusRing}`}
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                  aria-label="User menu"
                >
                  <Avatar src={user?.image} letter={avatarLetter || "U"} />

                  <HiChevronDown
                    size={15}
                    className={`text-gray-500 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div
                    role="menu"
                    aria-label="User menu"
                    className="animate-dropdown-pop absolute right-0 z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl ring-1 ring-black/5"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                      <Avatar
                        src={user?.image}
                        letter={avatarLetter}
                        size="h-10 w-10"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {profileName}
                        </p>
                        {user?.email && (
                          <p className="truncate text-xs text-gray-500">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {isB2B && (
                      <div className="flex items-center gap-2 bg-gray-50/70 px-4 py-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-brand to-emerald-600 text-white shadow-sm">
                          <FiBriefcase className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1 leading-tight">
                          <span className="block truncate text-xs font-bold text-gray-900">
                            {agencyName}
                          </span>
                          <span className="block text-[10px] font-medium uppercase tracking-wider text-gray-400">
                            {agencyCode}
                          </span>
                        </div>
                        <span className="whitespace-nowrap rounded-full bg-brand/10 px-2.5 py-1 text-[10px] font-bold text-brand">
                          {agencyBalance} {agencyCurrency}
                        </span>
                      </div>
                    )}

                    <Link
                      href={profileLink}
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-brand ${focusRing}`}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                        <FiUser className="h-4 w-4" />
                      </span>
                      My Profile
                    </Link>

                    {user?.role == ROLE.B2C && (
                      <Link
                        href={bookingsLink}
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-brand ${focusRing}`}
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                          <FiList className="h-4 w-4" />
                        </span>
                        Bookings
                      </Link>
                    )}

                    <div className="my-1.5 border-t border-gray-100" />

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50 ${focusRing}`}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500">
                        <FiLogOut className="h-4 w-4" />
                      </span>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar toggle */}
      {showSidebarToggle && (
        <div className="absolute right-2 top-1/2 flex h-full -translate-y-1/2 items-center sm:right-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar Display"
            aria-expanded={sidebarOpen}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-600 transition-all hover:bg-gray-100 hover:text-brand active:scale-95 ${focusRing}`}
          >
            <HiMenuAlt3 size={22} />
          </button>
        </div>
      )}
    </header>
  );
}