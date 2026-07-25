import { jwtDecode } from "jwt-decode";
import { USER_ROLE } from "@/constant";

export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

export interface TokenPayload {
  exp: number;
  role: USER_ROLE;
  [key: string]: unknown;
}

export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
];

export const isAuthRoute = (pathname: string) =>
  authRoutes.some((route) => route === pathname);

export const commonProtectedRoutes: RouteConfig = {
  exact: ["/my-profile"],
  pattern: [],
};

export const superadminProtectedRoutes: RouteConfig = {
  exact: [],
  pattern: [/^\/super_admin(\/|$)/],
};
export const adminProtectedRoutes: RouteConfig = {
  exact: [],
  pattern: [/^\/admin(\/|$)/],
};
export const b2bProtectedRoutes: RouteConfig = {
  exact: [],
  pattern: [/^\/b2b(\/|$)/],
};
export const b2cProtectedRoutes: RouteConfig = {
  exact: [],
  pattern: [/^\/b2c(\/|$)/],
};

export const isRouteMatches = (pathname: string, routes: RouteConfig) => {
  if (routes.exact.includes(pathname)) {
    return true;
  }
  return routes.pattern.some((pattern) => pattern.test(pathname));
};

export const getRouteOwner = (
  pathname: string,
): USER_ROLE | "COMMON" | null => {
  if (isRouteMatches(pathname, superadminProtectedRoutes)) {
    return "SUPER_ADMIN";
  }
  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "ADMIN";
  }
  if (isRouteMatches(pathname, b2bProtectedRoutes)) {
    return "B2B";
  }
  if (isRouteMatches(pathname, b2cProtectedRoutes)) {
    return "B2C";
  }
  if (isRouteMatches(pathname, commonProtectedRoutes)) {
    return "COMMON";
  }
  return null;
};

export const getDefaultDashboardRoute = (role: USER_ROLE) => {
  if (role === "SUPER_ADMIN") {
    return "/super_admin/dashboard";
  }
  if (role === "ADMIN") {
    return "/admin/dashboard";
  }
  if (role === "B2B") {
    return "/b2b/dashboard";
  }
  if (role === "B2C") {
    return "/b2c/dashboard";
  }
  return "/";
};

export const isValidRedirectForRole = (
  redirectPath: string,
  role: USER_ROLE,
) => {
  const sanitizedPath = redirectPath.split("?")[0] || redirectPath;
  const routeOwner = getRouteOwner(sanitizedPath);

  if (routeOwner === null || routeOwner === "COMMON") {
    return true;
  }

  return routeOwner === role;
};

export const isJwtExpired = (expireToken: number): boolean => {
  if (!expireToken) {
    return true;
  }

  if (typeof expireToken !== "number") {
    return true;
  }

  return Math.floor(Date.now() / 1000) >= expireToken;
};

export const getRoleFromToken = (token: string): USER_ROLE | null => {
  if (!token) return null;

  try {
    const payload = jwtDecode<TokenPayload>(token);

    if (!payload?.exp || isJwtExpired(payload.exp)) {
      return null;
    }

    if (!payload.role) return null;

    const normalized = payload.role.toUpperCase();
    if (
      normalized === "ADMIN" ||
      normalized === "SUPER_ADMIN" ||
      normalized === "B2B" ||
      normalized === "B2C"
    ) {
      return normalized as USER_ROLE;
    }

    return null;
  } catch {
    return null;
  }
};
