"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  useLogoutMutation,
  useUserInfoQuery,
} from "../../../redux/api/auth/authApiSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../../../redux/features/authSlice";
import { IoMdLogOut } from "react-icons/io";
import { FaCreditCard } from "react-icons/fa";
import { LuBellDot } from "react-icons/lu";
import NoticeMarquee from "@/components/common/NoticeMarquee/NoticeMarquee";
import decodeToken from "../../../utils/decode/decode";

import Image from "next/image";
import Logo from "../../../../public/assets/images/logo.png";
import { Role } from "@/helper/navigation";

const Header: React.FC = () => {
  const router = useRouter();
  const user: any = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = useUserInfoQuery({});

  const userInfo: any = decodeToken(user?.accessToken);
  const role: Role = Role.B2B;
  const dashboardLink = `/console/${role}`;

  const profileName = data?.data?.profile?.fullName || "User";
  const profileEmail = data?.data?.email || "";
  const avatarLetter = profileName ? profileName[0].toUpperCase() : "U";

  const handleLogout = async () => {
    dispatch(logoutAction());
    await logoutApi(undefined);
    router.push("/auth/signin");
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
      <header className="w-full md:h-18 h-16 bg-white flex items-center justify-between px-4 md:px-14 shrink-0 py-3">
        {/* Logo - Desktop */}
        <div className="invisible md:visible relative">
          <Link href={dashboardLink} className="relative block">
            <Image
              src={Logo}
              alt="Logo"
              style={{ width: "150px", height: "auto" }}
              className="mx-auto"
              draggable={false}
              priority
            />
          </Link>
        </div>

        {/* Logo - Mobile */}
        <div className="md:invisible visible relative -ml-36">
          <Link href={dashboardLink} className="relative block">
            <Image
              src={Logo}
              alt="Logo"
              style={{ width: "120px", height: "auto" }}
              className="mx-auto"
              draggable={false}
              priority
            />
          </Link>
        </div>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          {isLoading ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-300" />
              <div className="hidden md:block space-y-1">
                <div className="h-3 w-32 bg-gray-300 rounded" />
                <div className="h-2 w-20 bg-gray-200 rounded" />
              </div>
            </div>
          ) : isError ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-3">
                U
              </div>
              <div className="hidden md:block">
                <h2 className="text-gray-900 text-sm font-semibold">User</h2>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop User Profile Trigger */}
              <div
                className="hidden md:flex items-center cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-3">
                  {avatarLetter}
                </div>
                <div>
                  <h2 className="text-gray-900 text-sm font-semibold">
                    {profileName}
                  </h2>
                  <p className="text-red-500 text-xs">{profileEmail}</p>
                </div>
              </div>

              {/* Mobile User Profile Trigger */}
              <div
                className="flex md:hidden items-center cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="md:w-10 w-8 md:h-10 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {avatarLetter}
                </div>
              </div>
            </>
          )}

          {/* Dropdown Menu Container */}
          {dropdownOpen && (
            <ul className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded shadow text-sm z-[999]">
              <li className="px-4 py-2 border-b border-gray-200">
                <p className="font-semibold">{profileName}</p>
                <p className="text-xs text-gray-500">{profileEmail}</p>
              </li>
              <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200">
                <LuBellDot className="mr-2" /> Notifications
              </li>
              <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200">
                <FaCreditCard className="mr-2" /> Balance: $100
              </li>
              <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200">
                <FaCreditCard className="mr-2" /> Credit Balance: $100
              </li>
              <li
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                <IoMdLogOut className="mr-2 text-secondary" /> Logout
              </li>
            </ul>
          )}
        </div>
      </header>

      <div className="mx-4 md:mx-0 z-99 px-0 md:px-14">
        <NoticeMarquee />
      </div>
    </>
  );
};

export default Header;
