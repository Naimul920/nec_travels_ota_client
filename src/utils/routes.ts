import { USER_ROLE } from "@/constant";

export const AUTH_PAGE_ROUTES = [
  "/auth/login",
  "/auth/signin",
  "/auth/signup",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
] as const;

export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

export const isAuthRoute = (pathname: string) =>
  AUTH_PAGE_ROUTES.some((route) => route === pathname);

export const commonProtectedRoutes: RouteConfig = {
  exact: ["/console/change-password"],
  pattern: [],
};

export const superadminProtectedRoutes: RouteConfig = {
  exact: [],
  pattern: [/^\/console\/super_admin(\/|$)/],
};
export const adminProtectedRoutes: RouteConfig = {
  exact: [],
  pattern: [/^\/console\/admin(\/|$)/],
};
export const b2bProtectedRoutes: RouteConfig = {
  exact: [],
  pattern: [/^\/console\/b2b(\/|$)/],
};
export const b2cProtectedRoutes: RouteConfig = {
  exact: [],
  pattern: [/^\/console\/b2c(\/|$)/],
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
    return "/console/super_admin/dashboard";
  }
  if (role === "ADMIN") {
    return "/console/admin/dashboard";
  }
  if (role === "B2B") {
    return "/console/b2b/dashboard";
  }
  if (role === "B2C") {
    return "/console/b2c/dashboard";
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

export const ROUTE_DEPARTMENT: { pattern: RegExp; departments: string[] }[] = [
  {
    pattern: /^\/console\/b2b\/air-tickets(\/|$)/,
    departments: ["air-tickets"],
  },
  { pattern: /^\/console\/b2b\/bookings(\/|$)/, departments: ["bookings"] },
  { pattern: /^\/console\/b2b\/finance(\/|$)/, departments: ["finance"] },
  { pattern: /^\/console\/b2b\/support(\/|$)/, departments: ["support"] },
  { pattern: /^\/console\/b2b\/banks(\/|$)/, departments: ["banks"] },
  { pattern: /^\/console\/b2b\/contact(\/|$)/, departments: ["contact"] },
  { pattern: /^\/console\/b2b\/settings(\/|$)/, departments: ["settings"] },
  { pattern: /^\/console\/b2b\/passengers(\/|$)/, departments: ["passengers"] },
  {
    pattern: /^\/console\/b2b\/flight-search(\/|$)/,
    departments: ["flight-search"],
  },
  {
    pattern: /^\/console\/b2b\/flight-booking(\/|$)/,
    departments: ["flight-booking"],
  },
  {
    pattern: /^\/console\/b2b\/credit-request-add(\/|$)/,
    departments: ["credit-request"],
  },
  { pattern: /^\/console\/admin\/users(\/|$)/, departments: ["users"] },
  {
    pattern: /^\/console\/admin\/transactions(\/|$)/,
    departments: ["transactions"],
  },
  {
    pattern: /^\/console\/super_admin\/air-tickets(\/|$)/,
    departments: ["air-tickets"],
  },
];

export const getRequiredDepartments = (pathname: string): string[] | null => {
  const match = ROUTE_DEPARTMENT.find(({ pattern }) => pattern.test(pathname));
  return match?.departments ?? null;
};

export const canAccessRoute = (
  pathname: string,
  userDepartments: string[],
): boolean => {
  const requiredDepts = getRequiredDepartments(pathname);
  if (!requiredDepts || requiredDepts.length === 0) return true;
  return requiredDepts.some((dept) => userDepartments.includes(dept));
};
