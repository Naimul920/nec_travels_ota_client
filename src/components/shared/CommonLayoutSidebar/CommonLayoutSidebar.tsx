"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Layout, Menu, ConfigProvider } from "antd";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { navigationConfig, NavRole, NavItem } from "@/helper/navigation";
import { useAuthStore } from "@/store/auth.store";
import { ROLE } from "@/constant";
import { FaHeadset } from "react-icons/fa";

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
  const { user, isLoading } = useAuthStore();
  const navRole: NavRole = roleToNavRole[user?.role as string] ?? NavRole.B2B;
  const pathPrefix = `/console/${navRole}`;

  const { menuItems, defaultOpenKeys } = useMemo(() => {
    if (isLoading) return { menuItems: [], defaultOpenKeys: [] };

    const navItems = navigationConfig[navRole] ?? [];
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
              onClick={() => setSidebarOpen(false)}
              className="w-full text-xs font-medium"
            >
              {route.label}
            </Link>
          ),
        };
      });

    const menuItems = buildItems(filterItems(navItems), pathPrefix);

    return { menuItems, defaultOpenKeys: openKeys };
  }, [user, isLoading, pathname, setSidebarOpen, navRole, pathPrefix]);

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setOpenKeys(defaultOpenKeys);
  }, [defaultOpenKeys]);

  useEffect(() => {
    if (!sidebarOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [sidebarOpen, setSidebarOpen]);

  const agencyName = user?.agency_name || user?.full_name || "NEC Travel Partner";
  const agencyCode = user?.agency_code || "Authorized agent";
  const agencyImage = user?.logo || user?.image;
  const initials = agencyName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    setImageFailed(false);
  }, [agencyImage]);

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
            itemColor: "#475569",
            itemHoverColor: "#00a550",
            itemHoverBg: "rgba(0, 165, 80, 0.06)",
            itemSelectedColor: "#ffffff",
            itemSelectedBg: "#00a550",
            itemBorderRadius: 10,
            itemHeight: 44,
            itemMarginInline: 8,
            itemMarginBlock: 3,
            activeBarWidth: 0,
          },
        },
      }}
    >
      {sidebarOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-slate-950/30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sider
        theme="light"
        trigger={null}
        width={300}
        style={{
          backgroundColor: "rgba(255,255,255,0.98)",
          position: "fixed",
          top: "4rem",
          right: 0,
          height: "calc(100vh - 4rem)",
          zIndex: 50,
        }}
        className={`
          overflow-hidden rounded-l-3xl bg-white/98!
          border-l! border-slate-200/80!
          transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
          [&_.ant-layout-sider-children]:bg-[#ffffff]!
          [&_.ant-layout-sider-children]:h-full!
        `}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-100 bg-linear-to-br from-emerald-50 via-white to-white px-5 py-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white text-sm font-bold text-[#12233D]">
                {agencyImage && !imageFailed ? (
                  <img
                    src={agencyImage}
                    alt={`${agencyName} logo`}
                    className="h-full w-full object-contain p-1"
                    onError={() => setImageFailed(true)}
                  />
                ) : (
                  initials || "NT"
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#12233D]">{agencyName}</p>
                <p className="mt-0.5 truncate text-xs font-medium text-slate-500">{agencyCode}</p>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-2 py-4 custom-scrollbar">
            <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Navigation
            </p>
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[pathname]}
              openKeys={openKeys}
              onOpenChange={(keys) => setOpenKeys(keys)}
              items={menuItems}
              className="border-none! bg-white! [&_.ant-menu-item-icon]:text-base! [&_.ant-menu-submenu-title]:font-semibold! [&_.ant-menu-title-content]:text-[13px]!"
            />
          </div>

          <div className="border-t border-slate-100 p-4">
            <Link
              href={`${pathPrefix}/contact/whatsapp`}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-brand"
            >
              <FaHeadset aria-hidden="true" className="text-brand" />
              Need help?
              <span className="ml-auto text-xs font-medium text-slate-400">Support</span>
            </Link>
          </div>
        </div>
      </Sider>
    </ConfigProvider>
  );
}
