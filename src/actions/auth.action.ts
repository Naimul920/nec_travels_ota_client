"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import * as Yup from "yup";
import { loginValidationSchema } from "@/validations/auth.validation";
import { httpClient } from "@/lib/axios/httpClient";
import {
  setTokenInCookies,
  setTokenExpiresAt,
  deleteTokenExpiresAt,
} from "@/utils/token";
import { deleteCookie } from "@/utils/cookie";
import { isValidRedirectForRole, getDefaultDashboardRoute } from "@/utils/auth";
import {
  setUserRole,
  setDepartments,
  getUserRole,
  deleteUserRole,
  deleteDepartments,
} from "@/utils/session";
import type { USER_ROLE } from "@/constant";
import { LoginResponse } from "@/types/login.type";
import type { UserProfileResponse } from "@/types/user.type";

export type LoginFormValues = Yup.InferType<typeof loginValidationSchema>;

export interface ILoginPayload {
  email: string;
  password: string;
}

interface LoginUser {
  id: string;
  email: string;
  role: string;
  status: string;
  email_verified: boolean;
  need_password_change: boolean;
  admin?: {
    department?: string | null;
  };
  profile: {
    first_name: string;
    last_name: string;
    full_name: string;
    image_key: string | null;
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
  email_verified: boolean;
  need_password_change: boolean;
  departments?: string[];
  tokens: LoginTokens;
}

export interface ILoginStatus {
  loggedIn: boolean;
  role: USER_ROLE | null;
}

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string,
  userAgent?: string,
): Promise<LoginResponse> => {
  try {
    loginValidationSchema.validateSync(payload, { abortEarly: true });

    const res = await httpClient.post<LoginData>("/auth/login", payload, {
      headers: userAgent ? { "User-Agent": userAgent } : undefined,
    });

    const {
      user,
      tokens,
      departments: deptArr,
      email_verified,
      need_password_change,
    } = res.data;
    const role = user.role;

    const accessMaxAge = tokens.expireToken - Math.floor(Date.now() / 1000);
    await setTokenInCookies("access_token", tokens.accessToken, accessMaxAge);
    await setTokenInCookies(
      "refresh_token",
      tokens.refreshToken,
      7 * 24 * 60 * 60,
    );
    await setTokenExpiresAt(tokens.expireToken);

    await setUserRole(role);

    const departments = deptArr?.length
      ? deptArr
      : user.admin?.department
        ? [user.admin.department]
        : [];

    await setDepartments(departments);

    const targetPath =
      redirectPath && isValidRedirectForRole(redirectPath, role as USER_ROLE)
        ? redirectPath
        : getDefaultDashboardRoute(role as USER_ROLE);

    return {
      success: true,
      redirectTo: targetPath,
      email_verified,
      need_password_change,
      data: {
        id: user.id,
        role,
        departments: departments.join(","),
        full_name: user?.profile?.full_name,
        email: user.email,
        agency_name: user?.profile?.agency_name,
        image_key: user?.profile?.image_key,
      },
    };
  } catch (error: any) {
    if (error instanceof Yup.ValidationError) {
      return {
        success: false,
        message: error.message,
      };
    }
    const backendData = error?.response?.data;
    const backendMessage = backendData?.message;

    const errorMessage = Array.isArray(backendMessage)
      ? backendMessage.join(", ")
      : backendMessage ||
        error?.message ||
        "Something went wrong. Please try again.";

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const logoutAction = async () => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    await httpClient.post(
      "/auth/logout",
      {},
      {
        headers: {
          Cookie: cookieHeader,
        },
      },
    );
  } catch {
    // ignore backend errors, clear cookies anyway
  }

  //   await fetch(`${process.env.API_BASE_URL}/auth/logout`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Cookie: cookieHeader,
  //     },
  //   });
  // } catch {
  //   // ignore backend errors, clear cookies anyway
  // }

  await deleteCookie("access_token");
  await deleteCookie("refresh_token");
  await deleteTokenExpiresAt();
  await deleteUserRole();
  await deleteDepartments();
};

export const isLoginAction = async (): Promise<ILoginStatus> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const role = await getUserRole();

    return {
      role: (role as USER_ROLE) ?? null,
      loggedIn: Boolean(accessToken && role),
    };
  } catch (error) {
    console.error("isLoginAction error:", error);
    return {
      role: null,
      loggedIn: false,
    };
  }
};

export const forgotPasswordAction = async (email: string) => {
  try {
    const res = await httpClient.post<{ message: string }>(
      "/auth/forgot-password",
      { email },
    );
    console.log("res***********************",res)
    return {
      success: true,
      message: res.data?.message || "OTP sent to your email",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send OTP",
    };
  }
};
