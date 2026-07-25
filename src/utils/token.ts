"use server";

import { jwtDecode } from "jwt-decode";
import { setCookie } from "./cookie";

const getTokenSecondsRemaining = (token: string): number | undefined => {
  if (!token) {
    return 0;
  }
  try {
    const tokenPayload = jwtDecode<{ exp: number }>(token);
    // console.log(tokenPayload);
    if (!tokenPayload) {
      return 0;
    }
    if (tokenPayload && tokenPayload.exp) {
      const remaining = (tokenPayload.exp -
        Math.floor(Date.now() / 1000)) as number;
      return remaining > 0 ? remaining : 0;
    }
  } catch {
    return 0;
  }
};

const setTokenInCookies = async (
  name: string,
  token: string,
  fallBackMaxInSec: number = 24 * 60 * 60,
) => {
  await setCookie(name, token, fallBackMaxInSec);
};

const isTokenExpiringSoon = async (token: string, thresholdSeconds = 300) => {
  if (!token) {
    return false;
  }

  let payload: { exp: number } | null = null;
  try {
    payload = jwtDecode<{ exp: number }>(token);
  } catch {
    return true;
  }

  if (!payload || typeof payload.exp !== "number") {
    return true;
  }

  const remainingSeconds = payload.exp - Math.floor(Date.now() / 1000);
  return remainingSeconds > 0 && remainingSeconds <= thresholdSeconds;
};

const isTokenExpireRemaining = async (
  token: string,
  threeShouldInSecond: number = 3000,
): Promise<boolean> => {
  const remainingSeconds = getTokenSecondsRemaining(token) as number;
  return remainingSeconds > 0 && remainingSeconds <= threeShouldInSecond;
};
const isExpireToken = async (token: string): Promise<boolean> => {
  const remainingSeconds = getTokenSecondsRemaining(token) as number;
  return remainingSeconds === 0;
};

export {
  setTokenInCookies,
  isTokenExpireRemaining,
  isExpireToken,
  isTokenExpiringSoon,
};
