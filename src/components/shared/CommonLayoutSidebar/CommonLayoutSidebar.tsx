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
import { navigationConfig, NavRole, NavItem } from "@/helper/navigation";
import { useAuthStore } from "@/store/auth.store";
import { ROLE } from "@/constant";

const { Sider } = Layout;

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const roleToNavRole: Record<string, NavRole> = {
  [ROLE.SUPER_ADMIN]: NavRole.SUPER_ADMIN,
  [ROLE.ADMIN]: NavRole.ADMIN,
  [ROLE.B2B]: NavRole.B2B,
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

    const navRole = roleToNavRole[user.role] ?? NavRole.B2B;
    const navItems = navigationConfig[navRole] ?? [];
    const pathPrefix = `/console/${navRole}`;
    const isSuperAdmin = user.role === ROLE.SUPER_ADMIN;

    const userDepartments = (user.departments || "")
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    const filterItems = (routes: NavItem[]): NavItem[] => {
      const result: NavItem[] = [];
      for (const route of routes) {
        if (
          !isSuperAdmin &&
          route.departments?.length &&
          !route.departments.some((dept) => userDepartments.includes(dept))
        ) {
          continue;
        }
        const children = route.children ? filterItems(route.children) : undefined;
        if (route.children?.length && children?.length === 0) {
          continue;
        }
        result.push({ ...route, children });
      }
      return result;
    };

    const formatPath = (base: string, path: string) => {
      if (!path) return base;
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `${base}${cleanPath}`.replace(/\/+/g, "/");
    };

    const items: any[] = [];
    const openKeys: string[] = [];

    const buildItems = (routes: NavItem[], basePath: string): any[] =>
      routes.map((route) => {
        const fullPath = formatPath(basePath, route.path);

        if (route.children?.length) {
          const children = buildItems(route.children, fullPath);
          const hasActiveChild = children.some(
            (child) =>
              pathname.startsWith(child.key) || pathname === child.key,
          );
          if (hasActiveChild) {
            openKeys.push(fullPath);
          }
          return {
            key: fullPath,
            icon: route.icon,
            label: route.label,
            children,
          };
        }

        return {
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
        };
      });

    const filteredItems = filterItems(navItems);
    const menuItems = buildItems(filteredItems, pathPrefix);

    return { menuItems, defaultOpenKeys: openKeys };
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
