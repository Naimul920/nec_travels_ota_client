"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BiHomeAlt,
  BiUserCheck,
  BiBookOpen,
  BiGlobe,
  BiDollar,
  BiCompass,
  BiHotel,
  BiCreditCard,
  BiShieldQuarter,
  BiRun,
  BiInfoCircle,
  BiSupport,
  BiCog,
} from "react-icons/bi";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface B2cMenuItem {
  key: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

const B2cSidebarCustom: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const pathname = usePathname();

  const b2cMenuItems: B2cMenuItem[] = [
    { key: "home", label: "Home", path: "/b2c", icon: <BiHomeAlt size={20} /> },
    {
      key: "register",
      label: "Register",
      path: "/b2c/register",
      icon: <BiUserCheck size={20} />,
    },
    {
      key: "booking",
      label: "My Booking",
      path: "/b2c/booking",
      icon: <BiBookOpen size={20} />,
    },
    {
      key: "language",
      label: "Language",
      path: "/b2c/language",
      icon: <BiGlobe size={20} />,
    },
    {
      key: "currency",
      label: "Currency",
      path: "/b2c/currency",
      icon: <BiDollar size={20} />,
    },
    {
      key: "flight",
      label: "Flight",
      path: "/b2c/flight",
      icon: <BiCompass size={20} />,
    },
    {
      key: "hotel",
      label: "Hotel",
      path: "/b2c/hotel",
      icon: <BiHotel size={20} />,
    },
    {
      key: "visa",
      label: "Visa",
      path: "/b2c/visa",
      icon: <BiCreditCard size={20} />,
    },
    {
      key: "insurance",
      label: "Insurance",
      path: "/b2c/insurance",
      icon: <BiShieldQuarter size={20} />,
    },
    {
      key: "activity",
      label: "Activity",
      path: "/b2c/activity",
      icon: <BiRun size={20} />,
    },
    {
      key: "how-to-book",
      label: "How to Book",
      path: "/b2c/how-to-book",
      icon: <BiInfoCircle size={20} />,
    },
    {
      key: "mobile-app",
      label: "Mobile App",
      path: "/b2c/mobile-app",
      icon: <BiSupport size={20} />,
    },
    {
      key: "about",
      label: "About NEC Fly",
      path: "/b2c/about",
      icon: <BiInfoCircle size={20} />,
    },
    {
      key: "settings",
      label: "Setting",
      path: "/b2c/settings",
      icon: <BiCog size={20} />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay Wrapper Layer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sider Layout Canvas Container Box */}
      <aside
        className={`
          fixed top-16 bottom-0 right-0 z-40 lg:sticky lg:top-16
          bg-white border-l border-gray-100 h-[calc(100vh-64px)]
          flex flex-col select-none transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-[260px] translate-x-0" : "w-[70px] translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Navigation Core List Node Container */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 no-scrollbar">
          {b2cMenuItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.key}
                href={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`
    flex flex-row-reverse items-center justify-end gap-3 px-3 h-11 rounded-lg text-sm font-medium transition-all group relative
    ${
      isActive
        ? "bg-[#00875A]/10 text-[#00875A]"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }
  `}
                title={!sidebarOpen ? item.label : undefined}
              >
                {/* 1. Icon component stays structurally first in row-reverse order (Displays right-most) */}
                <div
                  className={`flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${isActive ? "text-[#00875A]" : "text-gray-400 group-hover:text-gray-600"}`}
                >
                  {item.icon}
                </div>

                {/* 2. Text component displays immediately to the left of the icon, with text content pushed to the right edge */}
                <span
                  className={`
      whitespace-nowrap text-right transition-all duration-200 origin-right truncate flex-1
      ${sidebarOpen ? "opacity-100 scale-100 block" : "opacity-0 scale-95 hidden lg:block overflow-hidden w-0"}
    `}
                >
                  {item.label}
                </span>

                {/* 3. Hover tooltip box pops out cleanly to the left when the sidebar is minimized */}
                {!sidebarOpen && (
                  <div className="absolute right-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md tracking-wide hidden lg:block">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default B2cSidebarCustom;
