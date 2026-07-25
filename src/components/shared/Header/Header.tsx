"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { IoMdLogOut } from "react-icons/io";
import { LuBell } from "react-icons/lu";

import NoticeMarquee from "@/components/common/NoticeMarquee/NoticeMarquee";
import { Role, useAuth } from "@/context/AuthContext";
// import { Role } from "@/helper/navigation";

import Logo from "../../../../public/assets/images/logo.png";

const Header: React.FC = () => {
  const router = useRouter();

  const { user, loading, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const role: Role = (user?.role as Role) ?? Role.B2B;

  const dashboardLink = `/console/${role.toLowerCase()}`;

  const profileName = user?.profile?.full_name ?? "User";

  const profileEmail = user?.email ?? "";

  const balance = user?.balance ?? 0;

  const creditBalance = user?.creditBalance ?? 0;

  const isB2B = user?.role === Role.B2B;

  const avatarLetter = profileName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();

      router.push("/auth/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="w-full h-16 md:h-18 bg-white flex items-center justify-between px-4 md:px-14 py-3 shrink-0">
        {/* Desktop Logo */}
        <div className="hidden md:block">
          <Link href={dashboardLink}>
            <Image
              src={Logo}
              alt="Logo"
              width={150}
              height={40}
              className="h-auto w-auto object-contain"
              priority
              draggable={false}
            />
          </Link>
        </div>

        {/* Mobile Logo */}
        <div className="block md:hidden">
          <Link href={dashboardLink}>
            <Image
              src={Logo}
              alt="Logo"
              width={120}
              className="h-auto"
              priority
              draggable={false}
            />
          </Link>
        </div>

        {/* Profile */}
        <div ref={dropdownRef} className="relative">
          {loading ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-300" />

              <div className="hidden md:block space-y-1">
                <div className="h-3 w-32 rounded bg-gray-300" />
                <div className="h-2 w-20 rounded bg-gray-200" />
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Trigger */}
              <div
                className="hidden md:flex items-center cursor-pointer select-none"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center mr-3">
                  {avatarLetter}
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    {profileName}
                  </h2>

                  <p className="text-xs text-red-500">{profileEmail}</p>
                </div>
              </div>

              {/* Mobile Trigger */}
              <div
                className="md:hidden flex items-center cursor-pointer select-none"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center">
                  {avatarLetter}
                </div>
              </div>
            </>
          )}

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded shadow-md text-xs text-gray-800 z-999 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {/* Notification */}
                <li className="flex items-center justify-end gap-2 px-4 py-2.5 hover:bg-gray-50 cursor-pointer font-medium">
                  <span>Notification</span>

                  <LuBell className="text-sm text-black fill-black" />
                </li>

                {/* Balance (B2B only) */}
                {isB2B && (
                  <>
                    <li className="flex items-center justify-end px-4 py-2.5 hover:bg-gray-50 cursor-pointer font-medium">
                      <span>Balance : {balance}</span>
                    </li>

                    <li className="flex items-center justify-end px-4 py-2.5 hover:bg-gray-50 cursor-pointer font-medium">
                      <span>
                        Credit Balance :{" "}
                        <span className="text-red-500 font-semibold">
                          {creditBalance}
                        </span>
                      </span>
                    </li>
                  </>
                )}

                {/* Logout */}
                <li
                  className="flex items-center justify-end gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200/80 cursor-pointer text-red-500 font-semibold"
                  onClick={handleLogout}
                >
                  <span>Logout</span>

                  <IoMdLogOut className="text-base text-red-500" />
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <div className="mx-4 md:mx-0 px-0 md:px-14">
        <NoticeMarquee />
      </div>
    </>
  );
};

export default Header;
