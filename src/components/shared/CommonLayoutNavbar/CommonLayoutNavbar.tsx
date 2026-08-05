"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiMenuAlt3 } from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi2";
import { FiUser, FiList, FiLogOut } from "react-icons/fi";
import { useAuthStore } from "@/store/auth.store";
import { logoutAction } from "@/actions/auth.action";
import { ROLE } from "@/constant";
import { NavRole } from "@/helper/navigation";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 shadow-xs backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-10">
        {/* Logo */}
        <Link
          href={isLoggedIn ? `/console/${roleLower}` : "/"}
          className="flex shrink-0 items-center"
        >
          <img
            src={headerLogo}
            alt={isB2B && user?.logo ? "Agency logo" : "NEC Fly"}
            width={130}
            height={40}
            className="object-contain"
            style={{ width: "auto", height: 50 }}
          />
        </Link>

        {/* Right Actions */}
        <div
          className={`flex items-center gap-3 ${
            showSidebarToggle ? "pr-11 sm:pr-12" : ""
          }`}
        >
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-full bg-gray-100" />
          ) : !isLoggedIn || !user ? (
            <Link
              href="/auth/signin"
              className="flex h-9 cursor-pointer items-center justify-center rounded-full bg-brand px-5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-brand/90 hover:shadow-md"
            >
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-2.5">
              {isB2B && user && (
                <div className="hidden flex-col items-end leading-tight md:flex">
                  <span className="text-sm font-semibold text-gray-900">
                    {agencyName}
                  </span>
                  <span className="text-xs font-medium text-brand">
                    {agencyCode}
                  </span>
                  <span className="text-xs font-medium text-brand">
                    Balance: {agencyBalance} {agencyCurrency}
                  </span>
                </div>
              )}

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-gray-200 pl-1 pr-2 transition-colors hover:border-gray-300 hover:bg-gray-50"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-brand to-emerald-600">
                    {user?.image ? (
                      <img
                        src={user.image || ""}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-white">
                        {avatarLetter || ""}
                      </span>
                    )}
                  </div>

                  {/* <span className="hidden text-sm font-semibold text-gray-800 sm:inline">
                    {profileName}
                  </span> */}

                  <HiChevronDown
                    size={15}
                    className={`text-gray-500 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="animate-dropdown-pop absolute right-0 mt-2 w-60 origin-top-right overflow-hidden rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl ring-1 ring-black/5">
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand to-emerald-600 text-white">
                        {user?.image ? (
                          <img
                            src={user.image}
                            alt="Profile"
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-base font-bold">
                            {avatarLetter}
                          </span>
                        )}
                      </div>
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

                    <Link
                      href={profileLink}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-brand"
                    >
                      <FiUser className="h-4 w-4 text-gray-400" />
                      My Profile
                    </Link>

                    {(user?.role == NavRole.SUPER_ADMIN || user?.role == NavRole.ADMIN) && (
                      <Link
                        href={bookingsLink}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-brand"
                      >
                        <FiList className="h-4 w-4 text-gray-400" />
                        Bookings
                      </Link>
                    )}

                    <div className="my-1.5 border-t border-gray-100" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <FiLogOut className="h-4 w-4" />
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
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-600 transition-all hover:bg-gray-100 hover:text-brand active:scale-95"
            aria-label="Toggle Sidebar Display"
          >
            <HiMenuAlt3 size={22} />
          </button>
        </div>
      )}
    </header>
  );
}
