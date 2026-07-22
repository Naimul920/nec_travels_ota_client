"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Layout, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

import { navigationConfig, NavRole} from "@/helper/navigation";

const { Sider } = Layout;

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  setMobileOpen,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const pathname = usePathname();

  const sidebarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // =========================================================================
  // AUTH / TOKEN LOGIC
  // =========================================================================

  // const user = useSelector((state: RootState) => state.auth.user);
  // const userInfo = decodeToken(user?.accessToken);

  // const role = userInfo?.role as Role;

  const role: NavRole = NavRole.B2B;

  // =========================================================================
  // ROUTE PREFIX
  // =========================================================================

  const pathPrefix = `/console/${role}`;

  // =========================================================================
  // RESPONSIVE
  // =========================================================================

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // =========================================================================
  // MENU ITEMS
  // =========================================================================

  const menuItems = useMemo(() => {
    const routes = navigationConfig[role] ?? [];

    const formatPath = (path: string) => {
      // Overview page
      if (!path) {
        return pathPrefix;
      }

      const cleanPath = path.startsWith("/")
        ? path
        : `/${path}`;

      return `${pathPrefix}${cleanPath}`.replace(
        /\/+/g,
        "/"
      );
    };

    return routes.map((route) => {
      const fullPath = formatPath(route.path);

      if (route.children?.length) {
        return {
          key: fullPath,
          icon: route.icon,
          label: route.label,
          children: route.children.map((child) => {
            const childPath = formatPath(
              `${route.path}${child.path}`
            );

            return {
              key: childPath,
              icon: child.icon,
              label: (
                <Link
                  href={childPath}
                  onClick={() => {
                    if (isMobile) {
                      setMobileOpen(false);
                    }
                  }}
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
            onClick={() => {
              if (isMobile) {
                setMobileOpen(false);
              }
            }}
          >
            {route.label}
          </Link>
        ),
      };
    });
  }, [role, pathPrefix, isMobile, setMobileOpen]);

  // =========================================================================
  // MENU STATE
  // =========================================================================

  const selectedKeys = [pathname];

  const pathSegments = pathname
    .split("/")
    .filter(Boolean);

  const defaultOpenKeys: string[] = [];

  if (pathSegments.length >= 3) {
    defaultOpenKeys.push(
      `/${pathSegments[0]}/${pathSegments[1]}/${pathSegments[2]}`
    );
  }

  // =========================================================================
  // OUTSIDE CLICK
  // =========================================================================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        mobileOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setMobileOpen(false);
        setShowCloseIcon(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [mobileOpen, setMobileOpen]);

  // =========================================================================
  // MOBILE TOGGLE
  // =========================================================================

  const handleMobileToggle = () => {
    const nextState = !mobileOpen;

    setMobileOpen(nextState);
    setShowCloseIcon(false);

    if (nextState) {
      setTimeout(() => {
        setShowCloseIcon(true);
      }, 300);
    }
  };

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <>
      {isMobile && (
        <button
          ref={buttonRef}
          aria-label="Toggle menu"
          className="fixed top-4 left-3 z-50 rounded-md bg-tertiary p-2 text-white"
          onClick={handleMobileToggle}
        >
          {mobileOpen ? (
            showCloseIcon ? (
              <FaTimes size={20} />
            ) : (
              <FaBars size={20} />
            )
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
        collapsedWidth={isMobile ? 0 : 70}
        width={260}
        className={`fixed top-0 left-0 z-40 h-screen bg-tertiary text-white transition-transform duration-300 ${
          mobileOpen || !isMobile
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
        onMouseEnter={() => {
          if (!isMobile) {
            setCollapsed(false);
          }
        }}
        onMouseLeave={() => {
          if (!isMobile) {
            setCollapsed(true);
          }
        }}
      >
        <div className="h-16" />

        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          selectedKeys={selectedKeys}
          defaultOpenKeys={defaultOpenKeys}
          className="border-r-0 bg-tertiary text-sm text-white"
        />
      </Sider>
    </>
  );
};

export default Sidebar;