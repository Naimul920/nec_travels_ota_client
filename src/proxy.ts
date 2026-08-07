import { NextRequest, NextResponse } from "next/server";
import {
  getRouteOwner,
  getDefaultDashboardRoute,
  isAuthRoute,
  canAccessRoute,
} from "@/utils/auth";

const LOGIN_PATH = "/auth/signin";
const API_BASE_URL = process.env.API_BASE_URL || "";

const normalizePathname = (pathname: string) => {
  const sanitized = pathname.replace(/\/+$/, "");
  return sanitized || "/";
};

const buildLoginRedirect = (request: NextRequest) => {
  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set(
    "redirect",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  return loginUrl;
};

const setCookieOnResponse = (
  response: NextResponse,
  name: string,
  value: string,
  maxAge: number | undefined,
) => {
  response.cookies.set(name, value, {
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
    sameSite:
      process.env.NEXT_PUBLIC_NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    maxAge,
  });
};

const setTokenCookies = (
  response: NextResponse,
  tokens: { accessToken: string; refreshToken?: string; expireToken?: number },
) => {
  const now = Math.floor(Date.now() / 1000);
  const accessMaxAge = tokens.expireToken
    ? tokens.expireToken - now
    : 15 * 60;

  setCookieOnResponse(response, "access_token", tokens.accessToken, accessMaxAge);
  if (tokens.refreshToken)
    setCookieOnResponse(response, "refresh_token", tokens.refreshToken, 7 * 24 * 60 * 60);
  if (tokens.expireToken)
    setCookieOnResponse(response, "token_expires_at", String(tokens.expireToken), accessMaxAge);
};

const clearAuthCookies = (response: NextResponse) => {
  for (const name of ["access_token", "refresh_token", "user_role", "user_departments", "token_expires_at"]) {
    response.cookies.delete(name);
  }
};

const attemptRefresh = async (
  request: NextRequest,
): Promise<{ ok: boolean; tokens?: { accessToken: string; refreshToken?: string; expireToken?: number } }> => {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (!refreshToken) return { ok: false };

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return { ok: false };

    const json = await res.json();
    const tokens = json.data?.tokens as
      | { accessToken: string; refreshToken?: string; expireToken?: number }
      | undefined;

    if (!tokens?.accessToken) return { ok: false };

    return { ok: true, tokens };
  } catch {
    return { ok: false };
  }
};

const getIsTokenExpired = (request: NextRequest): boolean => {
  const tokenExpiresAtStr = request.cookies.get("token_expires_at")?.value;
  if (!tokenExpiresAtStr) return false;
  const tokenExpiresAt = Number(tokenExpiresAtStr);
  return tokenExpiresAt > 0 && Math.floor(Date.now() / 1000) >= tokenExpiresAt;
};

export async function proxy(request: NextRequest) {
  try {
    const pathname = normalizePathname(request.nextUrl.pathname);

    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.includes(".")
    ) {
      return NextResponse.next();
    }

    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;
    const userRole = request.cookies.get("user_role")?.value;
    const departments = request.cookies
      .get("user_departments")
      ?.value?.split(",")
      .filter(Boolean);

    const routeOwner = getRouteOwner(pathname);
    const isAuthPage = isAuthRoute(pathname);
    const isTokenExpired = getIsTokenExpired(request);
    const isLoggedIn = Boolean(accessToken && userRole) && !isTokenExpired;

    if (isAuthPage) {
      if (isLoggedIn) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole as any), request.url),
        );
      }

      if (refreshToken && isTokenExpired) {
        const { ok, tokens } = await attemptRefresh(request);
        if (ok && tokens) {
          const response = NextResponse.redirect(
            new URL(getDefaultDashboardRoute(userRole as any), request.url),
          );
          setTokenCookies(response, tokens);
          return response;
        }
        const failResponse = NextResponse.next();
        clearAuthCookies(failResponse);
        return failResponse;
      }

      return NextResponse.next();
    }

    if (routeOwner === null) {
      if (pathname === "/flight-booking") {
        if (!isLoggedIn) {
          return NextResponse.next();
        }
        if (userRole === "B2B") {
          return NextResponse.redirect(
            new URL(
              `/console/b2b/flight-booking${request.nextUrl.search}`,
              request.url,
            ),
          );
        }
        if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
          return NextResponse.redirect(
            new URL(getDefaultDashboardRoute(userRole as any), request.url),
          );
        }
        return NextResponse.next();
      }

      if (isLoggedIn && userRole && userRole !== "B2C") {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole as any), request.url),
        );
      }
      return NextResponse.next();
    }

    if (!isLoggedIn) {
      if (refreshToken) {
        const { ok, tokens } = await attemptRefresh(request);
        if (ok && tokens) {
          const response = NextResponse.next();
          setTokenCookies(response, tokens);
          return response;
        }
      }
      return NextResponse.redirect(buildLoginRedirect(request));
    }

    if (routeOwner === "COMMON") {
      return NextResponse.next();
    }

    if (routeOwner !== userRole) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as any), request.url),
      );
    }

    if (departments?.length && !canAccessRoute(pathname, departments)) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as any), request.url),
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
