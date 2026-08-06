"use client";

import React, { useMemo } from "react";
import { Layout, Menu, ConfigProvider } from "antd";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { navigationConfig, NavRole, NavItem } from "@/helper/navigation";
import { useAuthStore } from "@/store/auth.store";
import { ROLE } from "@/constant";

const { Sider } = Layout;

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  footerHeight?: number;
}

const roleToNavRole: Record<string, NavRole> = {
  [ROLE.SUPER_ADMIN]: NavRole.SUPER_ADMIN,
  [ROLE.ADMIN]: NavRole.ADMIN,
  [ROLE.B2B]: NavRole.B2B,
};

export default function CommonLayoutSidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, isLoggedIn, isLoading } = useAuthStore();

  const { menuItems, defaultOpenKeys } = useMemo(() => {
    if (isLoading) return { menuItems: [], defaultOpenKeys: [] };

    const navRole: NavRole =
      roleToNavRole[user?.role as string] ?? NavRole.B2B;
    const navItems = navigationConfig[navRole] ?? [];
    const pathPrefix = `/console/${navRole}`;
    const isSuperAdmin = user?.role === ROLE.SUPER_ADMIN;

    const userDepartments = (user?.departments || "")
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    const canAccess = (route: NavItem) => {
      if (isSuperAdmin) return true;
      const allowed = [
        ...(route.departments ?? []),
        ...(route.readOnlyDepartments ?? []),
      ];
      if (!allowed.length) return true;
      return allowed.some((dept) => userDepartments.includes(dept));
    };

    const filterItems = (routes: NavItem[]): NavItem[] => {
      const result: NavItem[] = [];
      for (const route of routes) {
        if (!canAccess(route)) {
          continue;
        }
        const children = route.children
          ? filterItems(route.children)
          : undefined;
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
              onClick={() =>
                window.innerWidth < 1024 && setSidebarOpen(false)
              }
              className="w-full text-xs font-medium"
            >
              {route.label}
            </Link>
          ),
        };
      });

    const menuItems = buildItems(filterItems(navItems), pathPrefix);

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
            subMenuItemBg: "transparent",
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
          className="fixed inset-0 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sider
        theme="light"
        trigger={null}
        width={220}
        style={{
          backgroundColor: "#ffffff",
          position: "fixed",
          top: "4rem",
          right: 0,
          height: "calc(100vh - 4rem)",
          zIndex: 50,
        }}
        className={`
          bg-[#ffffff]!
          border-l! border-gray-200!
          shadow-lg
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
          [&_.ant-layout-sider-children]:bg-[#ffffff]!
          [&_.ant-layout-sider-children]:h-full!
          [&_.ant-layout-sider-children]:overflow-y-auto!
        `}
      >
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[pathname]}
          defaultOpenKeys={defaultOpenKeys}
          items={menuItems}
          className="border-none py-2 px-1 bg-[#ffffff]!"
        />
      </Sider>
    </ConfigProvider>
  );
}