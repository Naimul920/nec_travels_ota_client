"use server";

import { cookies } from "next/headers";

export const setCookie = async (
  name: string,
  value: string,
  maxAgeInSeconds: number,
) => {
  const cookieStore = await cookies();

  const isProduction = process.env.NEXT_PUBLIC_NODE_ENV === "production";

  cookieStore.set(name, value, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
    maxAge: maxAgeInSeconds,
  });
};

export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
};

export const deleteCookie = async (name: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};

export const getCookieData = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    if (!cookieHeader) return null;

    return cookieHeader;
  } catch {
    return null;
  }
};
