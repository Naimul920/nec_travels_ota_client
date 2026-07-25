"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import * as Yup from "yup";
import { loginValidationSchema } from "@/validations/auth.validation";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/utils/token";
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
) => {
  try {
    loginValidationSchema.validateSync(payload, { abortEarly: true });

    const res = await httpClient.post<LoginData>("/auth/login", payload);
    const { user, tokens, departments: deptArr } = res.data;
    const role = user.role;

    const accessMaxAge = tokens.expireToken - Math.floor(Date.now() / 1000);
    await setTokenInCookies("access_token", tokens.accessToken, accessMaxAge);
    await setTokenInCookies(
      "refresh_token",
      tokens.refreshToken,
      7 * 24 * 60 * 60,
    );
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

export const logoutAction = async () => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    await fetch(`${process.env.API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
    });
  } catch {
    // ignore backend errors, clear cookies anyway
  }

  await deleteCookie("access_token");
  await deleteCookie("refresh_token");
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
