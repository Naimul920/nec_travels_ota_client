import { jwtDecode } from "jwt-decode";
import { USER_ROLE } from "@/constant";
export {
  AUTH_PAGE_ROUTES,
  isAuthRoute,
  commonProtectedRoutes,
  superadminProtectedRoutes,
  adminProtectedRoutes,
  b2bProtectedRoutes,
  b2cProtectedRoutes,
  isRouteMatches,
  getRouteOwner,
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  ROUTE_DEPARTMENT,
  getRequiredDepartments,
  canAccessRoute,
  ADMIN_DEPARTMENT_ROUTES,
  getAdminRequiredDepartments,
  isAdminReadOnlyView,
} from "./routes";

export interface TokenPayload {
  exp: number;
  role: USER_ROLE;
  [key: string]: unknown;
}

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
