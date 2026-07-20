"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Layout, Menu } from "antd";
// import { useSelector } from "react-redux";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
// import type { RootState } from "@/redux/store";
import { navigationConfig } from "@/helper/navigation";
// import decodeToken from "@/utils/decode/decode";

const { Sider } = Layout;

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // =========================================================================
  // AUTH / TOKEN LOGIC (TEMPORARILY COMMENTED UNTIL LOGIN API IS READY)
  // =========================================================================
  // const user = useSelector((state: RootState) => state.auth.user);
  // const userInfo = decodeToken(user?.accessToken);
  // const role = String(userInfo?.role ?? "").toLowerCase();

  // Temporary fallback role (Changed from "agent" to "b2b")
  const role = "b2b"; 
  // const role = "admin"; 
  // const role = "super-admin"; 
  // const role = "b2c"; 
  // =========================================================================

  // FIXED: Prefix attached for all roles (e.g. /b2b, /admin, /superadmin, /b2c)
  const pathPrefix = role ? `/${role}` : "";

  // Handle Window Resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Memoized Menu Construction
  const menuItems = useMemo(() => {
    const rawItems = navigationConfig[role] ?? [];

    const formatPath = (path: string) => {
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      // Guarantees clean URLs like "/b2b/bank-info"
      return `${pathPrefix}${cleanPath}`.replace(/\/+/g, "/");
    };

    return rawItems
      .filter((r: any) => r.label)
      .map((route: any) => {
        const fullPath = formatPath(route.path);

        if (route.children) {
          return {
            key: fullPath,
            icon: route.icon,
            label: route.label,
            children: route.children
              .filter((c: any) => c.label)
              .map((child: any) => {
                const childPath = formatPath(`${route.path}/${child.path}`);
                return {
                  key: childPath,
                  icon: child.icon,
                  label: (
                    <Link
                      href={childPath}
                      onClick={() => isMobile && setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ),
                };
              }),
          };
        }

        return {
          key: fullPath,
          icon: route.icon,
          label: (
            <Link
              href={fullPath}
              onClick={() => isMobile && setMobileOpen(false)}
            >
              {route.label}
            </Link>
          ),
        };
      });
  }, [role, pathPrefix, isMobile, setMobileOpen]);

  // Click Outside Mobile Sidebar Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
        setShowCloseIcon(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen, setMobileOpen]);

  const handleMobileToggle = () => {
    const nextState = !mobileOpen;
    setMobileOpen(nextState);
    setShowCloseIcon(false);

    if (nextState) {
      setTimeout(() => setShowCloseIcon(true), 300);
    }
  };

  const selectedKey = pathname;
  // Dynamic parent key selection based on route structure
  const pathSegments = pathname.split("/").filter(Boolean);
  const parentKey = pathSegments.length >= 2 ? `/${pathSegments[0]}/${pathSegments[1]}` : pathname;

  return (
    <>
      {isMobile && (
        <button
          ref={buttonRef}
          aria-label="Toggle navigation menu"
          className="fixed top-4 left-3 z-50 p-2 text-white bg-tertiary rounded-md"
          onClick={handleMobileToggle}
        >
          {mobileOpen ? (
            showCloseIcon ? <FaTimes size={20} /> : <FaBars size={20} />
          ) : (
            <FaBars size={20} />
          )}
        </button>
      )}

      <Sider
        ref={sidebarRef}
        trigger={null}
        collapsible
        collapsed={isMobile ? false : collapsed}
        collapsedWidth={isMobile ? 0 : 60}
        width={250}
        className={`fixed top-0 left-0 z-40 h-screen bg-tertiary text-white transition-transform duration-300 ${
          mobileOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
        }`}
        onMouseEnter={() => !isMobile && setCollapsed(false)}
        onMouseLeave={() => !isMobile && setCollapsed(true)}
      >
        <div className="p-4" />
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          selectedKeys={[selectedKey]}
          defaultOpenKeys={[parentKey]}
          className="bg-tertiary text-white text-sm border-r-0"
        />
      </Sider>
    </>
  );
};

export default Sidebar;