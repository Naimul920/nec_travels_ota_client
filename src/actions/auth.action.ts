"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import * as Yup from "yup";
import { loginValidationSchema } from "@/validations/auth.validation";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/utils/token";
import {
  isValidRedirectForRole,
  getDefaultDashboardRoute,
  getRoleFromToken,
} from "@/utils/auth";
import type { USER_ROLE } from "@/constant";

export type LoginFormValues = Yup.InferType<typeof loginValidationSchema>;

export interface ILoginPayload {
  email: string;
  password: string;
}

interface LoginUser {
  id: string;
  email: string;
  status: string;
  email_verified: boolean;
  need_password_change: boolean;
  profile: {
    first_name: string;
    last_name: string;
    full_name: string;
    image_key: string | null;
    department: string | null;
    agency_name: string | null;
  };
}

interface LoginTokens {
  accessToken: string;
  refreshToken: string;
  expireToken: number;
}

interface LoginData {
  user: LoginUser;
  role: string;
  tokens: LoginTokens;
}

export interface ILoginStatus {
  loggedIn: boolean;
  role: USER_ROLE | null;
}

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string,
) => {
  try {
    loginValidationSchema.validateSync(payload, { abortEarly: true });

    const res = await httpClient.post<LoginData>("/auth/login", payload);
    const { role, tokens } = res.data;
    const { accessToken, refreshToken, expireToken } = tokens;

    const accessMaxAge = expireToken - Math.floor(Date.now() / 1000);
    await setTokenInCookies("access_token", accessToken, accessMaxAge);
    await setTokenInCookies("refresh_token", refreshToken, 7 * 24 * 60 * 60); // 7 days

    const targetPath =
      redirectPath && isValidRedirectForRole(redirectPath, role as USER_ROLE)
        ? redirectPath
        : getDefaultDashboardRoute(role as USER_ROLE);

    return {
      success: true,
      redirectTo: targetPath,
    };
  } catch (error: any) {
    if (error instanceof Yup.ValidationError) {
      return {
        success: false,
        message: error.message,
      };
    }

    const backendMessage = error?.response?.data?.message || "";
    if (backendMessage === "Email not verified") {
      redirect(`/auth/verify-email?email=${payload.email}`);
    }

    return {
      success: false,
      message: `Login failed: ${error?.message || "Unknown error"}`,
    };
  }
};

export const isLoginAction = async (): Promise<ILoginStatus> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const role = accessToken ? getRoleFromToken(accessToken) : null;

    return {
      role,
      loggedIn: Boolean(role),
    };
  } catch (error) {
    console.error("isLoginAction error:", error);
    return {
      role: null,
      loggedIn: false,
    };
  }
};
