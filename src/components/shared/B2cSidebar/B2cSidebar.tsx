"use client";

import React from "react";
import { Layout, Menu, ConfigProvider } from "antd";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BiShieldQuarter, BiSolidCoinStack } from "react-icons/bi";
import { AiFillHome } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { RiCalendarScheduleFill, RiSettings5Fill } from "react-icons/ri";
import {
  MdGTranslate,
  MdOutlineFlightTakeoff,
  MdDirectionsRun,
  MdMobileFriendly,
  MdInfo,
} from "react-icons/md";
import { FaHotel, FaBookJournalWhills } from "react-icons/fa6";
import { BsFillPassportFill } from "react-icons/bs";

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
    { key: "/", label: "Home", icon: <AiFillHome size={18} /> },
    { key: "/auth/signup", label: "Register", icon: <FaUser size={18} /> },
    {
      key: "/booking",
      label: "My Booking",
      icon: <RiCalendarScheduleFill size={18} />,
    },
    {
      key: "/language",
      label: "Language",
      icon: <MdGTranslate size={18} />,
    },
    {
      key: "/currency",
      label: "Currency",
      icon: <BiSolidCoinStack size={18} />,
    },
    {
      key: "/flight",
      label: "Flight",
      icon: <MdOutlineFlightTakeoff size={18} />,
    },
    { key: "/hotel", label: "Hotel", icon: <FaHotel size={18} /> },
    { key: "/visa", label: "Visa", icon: <BsFillPassportFill size={18} /> },
    {
      key: "/insurance",
      label: "Insurance",
      icon: <BiShieldQuarter size={18} />,
    },
    {
      key: "/activity",
      label: "Activity",
      icon: <MdDirectionsRun size={18} />,
    },
    {
      key: "/how-to-book",
      label: "How to Book",
      icon: <FaBookJournalWhills size={18} />,
    },
    {
      key: "/mobile-app",
      label: "Mobile App",
      icon: <MdMobileFriendly size={18} />,
    },
    { key: "/about", label: "About NEC Fly", icon: <MdInfo size={18} /> },
    {
      key: "/settings",
      label: "Setting",
      icon: <RiSettings5Fill size={18} />,
    },
  ];

  const menuItems = menuItemsRaw.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: (
      <Link
        href={item.key}
        onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
        className="w-full text-xs font-medium"
      >
        {item.label}
      </Link>
    ),
  }));

  return (
    <ConfigProvider
      theme={{
        token: {
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
            itemColor: "#555555",
            itemHoverColor: "#00a550",
            itemHoverBg: "rgba(0, 165, 80, 0.06)",
            itemSelectedColor: "#00a550",
            itemSelectedBg: "rgba(0, 165, 80, 0.12)",
            activeBarWidth: 0,
          },
        },
      }}
    >
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={sidebarOpen}
        collapsedWidth={56}
        width={180}
        style={{
          backgroundColor: "#ffffff",
          height: "100vh",
        }}
        className={`
          bg-white!
          border! border-gray-200!
          rounded-l-lg!
          shadow-md
          transition-all duration-300
          
          /* Mobile Position */
          fixed right-0 top-0 z-50
          ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}

          /* Desktop Alignment */
          lg:relative lg:top-0 lg:right-0 lg:z-auto
          [&_.ant-layout-sider-children]:bg-white!
          [&_.ant-layout-sider-children]:h-max!
        `}
      >
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          className="border-none py-2 px-1 bg-white!"
        />
      </Sider>
    </ConfigProvider>
  );
};

export default B2cSidebar;
