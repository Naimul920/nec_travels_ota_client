/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // 1. Next.js 16 Client Component Directive
import React, { useState, useEffect, useRef } from "react";
import { Layout, Menu } from "antd";
import { useSelector } from "react-redux";
// 2. Swapped routing hooks from 'react-router-dom' to Next.js native engines
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import type { RootState } from "@/redux/store";
import { navigationConfig } from "@/helper/navigation"; // Imported clean navigation manifest
import decodeToken from "@/utils/decode/decode";

const { Sider } = Layout;

const Sidebar: React.FC<{ mobileOpen: boolean; setMobileOpen: any }> = ({
  mobileOpen,
  setMobileOpen,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const user: any = useSelector((state: RootState) => state.auth.user);
  const userInfo: any = decodeToken(user?.accessToken);
  const role = String(userInfo?.role).toLocaleLowerCase();

  // 3. Swapped useLocation() -> usePathname()
  const pathname = usePathname();

  const sidebarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const sideBarItems = navigationConfig[role] ?? [];
  const pathPrefix = role === "agent" ? "" : `/${role}`;

  const createMenuItems = (routes: any[]) => {
    return routes
      .filter((r) => r.label)
      .map((route) => {
        const fullPath = `${pathPrefix}/${route.path}`;
        if (route.children) {
          return {
            key: fullPath,
            icon: route.icon,
            label: route.label,
            children: route.children
              .filter((c: any) => c.label)
              .map((child: any) => {
                const childPath = `${pathPrefix}/${route.path}/${child.path}`;
                return {
                  key: childPath,
                  icon: child.icon,
                  // 4. Swapped <Link to={...}> to Next.js <Link href={...}>
                  label: <Link href={childPath}>{child.label}</Link>,
                };
              }),
          };
        }
        return {
          key: fullPath,
          icon: route.icon,
          // 4. Swapped <Link to={...}> to Next.js <Link href={...}>
          label: <Link href={fullPath}>{route.label}</Link>,
        };
      });
  };

  const menuItems = createMenuItems(sideBarItems);

  // 5. CRITICAL FIX FOR NEXT.JS SSR HYDRATION:
  // Initializing state to false to avoid server-client layout text mismatch errors.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Safely reads the client window layout parameters only after mount complete
    /* eslint-disable react-hooks/set-state-in-effect */
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 6. Configured path match updates based on hooks
  const selectedKey = pathname;
  const parentKey = selectedKey.split("/").slice(0, 3).join("/");

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
    setShowCloseIcon(false);

    if (!mobileOpen) {
      setTimeout(() => {
        setShowCloseIcon(true);
      }, 500);
    }
  };

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

  return (
    <>
      {isMobile && (
        <button
          ref={buttonRef}
          className="fixed top-4 left-3 z-50 p-2"
          onClick={handleMobileToggle}
        >
          {mobileOpen ? (
            showCloseIcon ? (
              <FaTimes
                className="text-secondary absolute top-1/2 left-52 -translate-x-1/2 -translate-y-1/2"
                size={20}
              />
            ) : null
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
        className={` top-0 left-0 h-screen bg-tertiary text-white transition-transform 
          ${mobileOpen || !isMobile ? "translate-x-0" : "-translate-x-full"}
        `}
        onMouseEnter={() => !isMobile && setCollapsed(false)}
        onMouseLeave={() => !isMobile && setCollapsed(true)}
      >
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          selectedKeys={[selectedKey]}
          defaultOpenKeys={[parentKey]}
          className="bg-tertiary text-white text-sm"
        />
      </Sider>
    </>
  );
};

export default Sidebar;
