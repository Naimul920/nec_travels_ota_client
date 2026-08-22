"use server";

import { setCookie, getCookie, deleteCookie } from "./cookie";

const TOKEN_EXPIRES_AT_COOKIE = "token_expires_at";

const setTokenExpiresAt = async (expireToken: number) => {
  const maxAge = expireToken - Math.floor(Date.now() / 1000);
  await setCookie(TOKEN_EXPIRES_AT_COOKIE, String(expireToken), maxAge > 0 ? maxAge : 0);
};

const getTokenExpiresAt = async (): Promise<number | null> => {
  const val = await getCookie(TOKEN_EXPIRES_AT_COOKIE);
  return val ? Number(val) : null;
};

const deleteTokenExpiresAt = async () => {
  await deleteCookie(TOKEN_EXPIRES_AT_COOKIE);
};

const setTokenInCookies = async (
  name: string,
  token: string,
  fallBackMaxInSec: number = 24 * 60 * 60,
) => {
  await setCookie(name, token, fallBackMaxInSec);
};

export {
  setTokenInCookies,
  setTokenExpiresAt,
  getTokenExpiresAt,
  deleteTokenExpiresAt,
};
