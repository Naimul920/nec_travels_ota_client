import { deleteCookie } from "@/utils/cookie";
import { setTokenInCookies } from "@/utils/token";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.API_BASE_URL;

export async function tryRefreshToken() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;
    if (!refreshToken) return false;

    const res = await fetch(`${BASE_API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return false;

    const json = await res.json();
    const { tokens } = json.data || {};
    const { accessToken, refreshToken: newRefreshToken, expireToken } = tokens || {};

    const accessMaxAge = expireToken
      ? expireToken - Math.floor(Date.now() / 1000)
      : undefined;

    if (accessToken) await setTokenInCookies("access_token", accessToken, accessMaxAge);
    if (newRefreshToken) await setTokenInCookies("refresh_token", newRefreshToken, 7 * 24 * 60 * 60); // 7 days

    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    await fetch(`${BASE_API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
    });

    await deleteCookie("access_token");
    await deleteCookie("refresh_token");
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

export async function getUserInfo() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return null;
    }

    const cookieHeader = cookieStore.toString();

    const res = await fetch(`${BASE_API_URL}/api/v1/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Auth failed: ${res.status}`);
      return null;
    }

    const json = await res.json();
    return json.data || json;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}
