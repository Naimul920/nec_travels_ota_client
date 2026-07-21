"use client";

import React from "react";
import { Layout, Menu, ConfigProvider } from "antd";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BiShieldQuarter } from "react-icons/bi";
import { AiFillHome } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { MdGTranslate } from "react-icons/md";
import { BiSolidCoinStack } from "react-icons/bi";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { FaHotel } from "react-icons/fa6";
import { BsFillPassportFill } from "react-icons/bs";
import { MdDirectionsRun } from "react-icons/md";
import { FaBookJournalWhills } from "react-icons/fa6";
import { MdMobileFriendly } from "react-icons/md";
import { MdInfo } from "react-icons/md";
import { RiSettings5Fill } from "react-icons/ri";

const { Sider } = Layout;

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const B2cSidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const pathname = usePathname();

  const menuItemsRaw = [
    { key: "/b2c", label: "Home", icon: <AiFillHome size={20} /> },
    { key: "/b2c/register", label: "Register", icon: <FaUser size={20} /> },
    {
      key: "/b2c/booking",
      label: "My Booking",
      icon: <RiCalendarScheduleFill size={20} />,
    },
    {
      key: "/b2c/language",
      label: "Language",
      icon: <MdGTranslate size={20} />,
    },
    {
      key: "/b2c/currency",
      label: "Currency",
      icon: <BiSolidCoinStack size={20} />,
    },
    {
      key: "/b2c/flight",
      label: "Flight",
      icon: <MdOutlineFlightTakeoff size={20} />,
    },
    { key: "/b2c/hotel", label: "Hotel", icon: <FaHotel size={20} /> },
    { key: "/b2c/visa", label: "Visa", icon: <BsFillPassportFill size={20} /> },
    {
      key: "/b2c/insurance",
      label: "Insurance",
      icon: <BiShieldQuarter size={20} />,
    },
    {
      key: "/b2c/activity",
      label: "Activity",
      icon: <MdDirectionsRun size={20} />,
    },
    {
      key: "/b2c/how-to-book",
      label: "How to Book",
      icon: <FaBookJournalWhills size={20} />,
    },
    {
      key: "/b2c/mobile-app",
      label: "Mobile App",
      icon: <MdMobileFriendly size={20} />,
    },
    { key: "/b2c/about", label: "About NEC Fly", icon: <MdInfo size={20} /> },
    {
      key: "/b2c/settings",
      label: "Setting",
      icon: <RiSettings5Fill size={20} />,
    },
  ];

  const menuItems = menuItemsRaw.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: (
      <Link
        href={item.key}
        onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
        className="w-full text-right block text-xs font-medium tracking-wide"
      >
        {item.label}
      </Link>
    ),
  }));

  return (
    <ConfigProvider
      theme={{
        token: {
          // Global brand primary green value
          colorPrimary: "#00a550",
        },
        components: {
          Layout: {
            siderBg: "#ffffff",
            triggerBg: "#ffffff",
          },
          Menu: {
            itemBg: "#ffffff",
            subMenuItemBg: "#ffffff",
            activeBarWidth: 0,

            // 1. Light Gray State: Both your Text AND React Icons inherit this token value natively
            itemColor: "#B1B1B1",

            // 2. Hover Interactivity
            itemHoverColor: "#00875A",
            itemHoverBg: "rgba(0, 135, 90, 0.05)",

            // 3. Active Brand Green State: Both text and React Icons flip to green smoothly
            itemSelectedColor: "#00a550",
            itemSelectedBg: "rgba(0, 135, 90, 0.1)",
          },
        },
      }}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sider
        trigger={null}
        collapsible
        collapsed={!sidebarOpen}
        collapsedWidth={70}
        width={200}
        className={`
          fixed! top-16! bottom-0! right-0! z-40! lg:sticky! lg:top-16!
          bg-white!  transition-all! duration-300!
          ${sidebarOpen ? "translate-x-0!" : "translate-x-full lg:translate-x-0!"}
        `}
      >
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          className="h-full  border-none pt-4 px-2 b2c-custom-menu text-xs font-medium bg-white"
        />
      </Sider>
    </ConfigProvider>
  );
};

export default B2cSidebar;
