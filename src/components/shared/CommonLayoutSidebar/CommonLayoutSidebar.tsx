"use client";

import React, { useMemo } from "react";
import { Layout, Menu, ConfigProvider } from "antd";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BiSolidCoinStack } from "react-icons/bi";
import { AiFillHome } from "react-icons/ai";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { FaHotel, FaBookJournalWhills } from "react-icons/fa6";
import { BsFillPassportFill } from "react-icons/bs";
import { navigationConfig, NavRole } from "@/helper/navigation";
import { useAuthStore } from "@/store/auth.store";

const { Sider } = Layout;

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const roleToNavRole: Record<string, NavRole> = {
  // [Role.SUPER_ADMIN]: NavRole.SUPER_ADMIN,
  // [Role.ADMIN]: NavRole.ADMIN,
  // [Role.B2B]: NavRole.B2B,
  // [Role.B2C]: NavRole.B2C,
};

const publicMenuItems = [
  { key: "/", label: "Home", icon: <AiFillHome size={18} /> },
  { key: "/booking", label: "My Booking", icon: <RiCalendarScheduleFill size={18} /> },
  { key: "/currency", label: "Currency", icon: <BiSolidCoinStack size={18} /> },
  { key: "/flight", label: "Flight", icon: <MdOutlineFlightTakeoff size={18} /> },
  { key: "/hotel", label: "Hotel", icon: <FaHotel size={18} /> },
  { key: "/visa", label: "Visa", icon: <BsFillPassportFill size={18} /> },
  { key: "/how-to-book", label: "How to Book", icon: <FaBookJournalWhills size={18} /> },
];

export default function CommonLayoutSidebar ({
  sidebarOpen,
  setSidebarOpen,
}:SidebarProps) {
  const pathname = usePathname();
  // const { user, isAuthenticated, loading } = useAuth();
  const { user,isLoggedIn, isLoading, clearUser } = useAuthStore();
  // return <>
  // <h1>{JSON.stringify(user)}</h1>
  // </>
  const { menuItems, defaultOpenKeys } = useMemo(() => {
    if (isLoading) return { menuItems: [], defaultOpenKeys: [] };

    if (!isLoggedIn || !user) {
      return {
        menuItems: publicMenuItems.map((item) => ({
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
        })),
        defaultOpenKeys: [],
      };
    }

    const navRole = roleToNavRole[user.role] ?? NavRole.B2C;
    const navItems = navigationConfig[navRole] ?? [];
    const pathPrefix = `/console/${navRole}`;

    const formatPath = (path: string) => {
      if (!path) return pathPrefix;
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `${pathPrefix}${cleanPath}`.replace(/\/+/g, "/");
    };

    const items: any[] = [];
    const openKeys: string[] = [];

    for (const route of navItems) {
      const fullPath = formatPath(route.path);

      if (route.children?.length) {
        const children = route.children.map((child) => {
          const childPath = formatPath(`${route.path}${child.path}`);
          if (pathname.startsWith(childPath)) {
            openKeys.push(fullPath);
          }
          return {
            key: childPath,
            icon: child.icon,
            label: (
              <Link
                href={childPath}
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                className="w-full text-xs font-medium"
              >
                {child.label}
              </Link>
            ),
          };
        });
        items.push({ key: fullPath, icon: route.icon, label: route.label, children });
      } else {
        items.push({
          key: fullPath,
          icon: route.icon,
          label: (
            <Link
              href={fullPath}
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
              className="w-full text-xs font-medium"
            >
              {route.label}
            </Link>
          ),
        });
      }
    }

    return { menuItems: items, defaultOpenKeys: openKeys };
  }, [user, isLoggedIn, isLoading, pathname, setSidebarOpen]);

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
          fixed right-0 top-0 z-50
          ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          lg:relative lg:top-0 lg:right-0 lg:z-auto
          [&_.ant-layout-sider-children]:bg-white!
          [&_.ant-layout-sider-children]:h-max!
        `}
      >
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[pathname]}
          defaultOpenKeys={defaultOpenKeys}
          items={menuItems}
          className="border-none py-2 px-1 bg-white!"
        />
      </Sider>
    </ConfigProvider>
  );
};
