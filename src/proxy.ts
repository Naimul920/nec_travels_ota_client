/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import decodeToken from "@/utils/decode/decode";

// ======================================================== TO DELETE
// 🛠️ MOCK CONFIGURATION FOR FRONTEND DEVELOPMENT
// Change this to "AGENT", "B2C", "ADMIN", "SUPERADMIN", or null (logged out)
const MOCK_ROLE: string | null = "AGENT";
// ========================================================

// Safely transforms raw JSON data into clean, URI-compliant Base64URL string formats
function base64UrlEncode(obj: object): string {
  const jsonStr = JSON.stringify(obj);
  // Next.js Middleware environment runtime native global buffer utility
  const base64 = Buffer.from(jsonStr).toString("base64");
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

// Generates a mock token featuring your exact structural claims matrix layout parameters
function getMockJwt(role: string): string {
  const header = base64UrlEncode({ alg: "HS256", typ: "JWT" });

  const payload = base64UrlEncode({
    userId: "85dbe469-a68c-4361-afda-dd0daf0a4862",
    email: "naim.necmoney@gmail.com",
    role: role.toUpperCase(), // Automatically matches the uppercase standard required ("AGENT")
    deviceId: "cd1c9e8a-745e-4499-abb7-43c8832cdffd",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 900, // Valid lifespan tracking interval set to 15 minutes
  });

  const signature = "mock_secure_signature_hash";
  return `${header}.${payload}.${signature}`;
}
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read both HTTP cookies automatically forwarded by the browser
  let accessToken = request.cookies.get("accessToken")?.value;
  let refreshToken = request.cookies.get("refreshToken")?.value;

  //============================================= TO DELETE
  if (!accessToken && !refreshToken && MOCK_ROLE) {
    accessToken = getMockJwt(MOCK_ROLE);
    refreshToken = "mock_refresh_token_string";
  }
  //=============================================

  // The user is authenticated if they have a valid access token OR a refresh token to obtain one
  const isAuthenticated = !!accessToken || !!refreshToken;
  // const isAuthenticated = false;

  // Fallback role decoding (if access token expired temporarily, fallback safely or let baseQuery handle it)
  const userInfo: any = decodeToken(accessToken ?? null);
  const role: string | null = userInfo?.role
    ? String(userInfo.role).toLowerCase()
    : null;
  console.log("Role===>>>>>>>", role);
  const allowedRoutes: Record<string, string> = {
    b2c: "/b2c/dashboard",
    agent: "/",
    admin: "/admin/dashboard",
    superadmin: "/superadmin/dashboard",
  };

  const isAuthRoute = pathname.startsWith("/auth/");
  const isAdminRoute = pathname.startsWith("/admin");
  const isSuperAdminRoute = pathname.startsWith("/superadmin");
  const isB2cRoute = pathname.startsWith("/b2c");

  const isPrivateRoute =
    pathname === "/" ||
    pathname.startsWith("/home") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/flight-") ||
    pathname.startsWith("/air-tickets") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/support") ||
    pathname.startsWith("/setting") ||
    pathname.startsWith("/bank-info") ||
    pathname.startsWith("/credit-request-add");

  // A. If logged in, don't allow access to signin/signup forms
  if (isAuthRoute && isAuthenticated) {
    console.log("isAuthRoute && isAuthenticated");
    return NextResponse.redirect(
      new URL(allowedRoutes[role ?? ""] ?? "/", request.url),
    );
  }

  // B. Protect private routes if completely unauthenticated (both tokens missing)
  if (
    (isPrivateRoute || isB2cRoute || isAdminRoute || isSuperAdminRoute) &&
    !isAuthenticated
  ) {
    console.log("!isAuthenticated");
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // C. Strict Role Checks (only checked if the access token is present to provide the role claim)
  if (accessToken && role) {
    if (isPrivateRoute && role !== "agent")
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    if (isB2cRoute && role !== "b2c")
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    if (isAdminRoute && role !== "admin")
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    if (isSuperAdminRoute && role !== "superadmin")
      return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/home/:path*",
    "/dashboard/:path*",
    "/flight-:path*",
    "/air-tickets/:path*",
    "/transactions/:path*",
    "/support/:path*",
    "/setting/:path*",
    "/bank-info/:path*",
    "/credit-request-add/:path*",
    "/b2c/:path*",
    "/admin/:path*",
    "/superadmin/:path*",
  ],
};
