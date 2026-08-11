"use server";

import { httpClient } from "@/lib/axios/httpClient";
import {
  AdminUser,
  ChangePasswordPayload,
  UserProfileResponse,
} from "@/types/user.type";
import { cookies } from "next/headers";


export async function getUserInfo() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return null;
    }
 
    const res = await httpClient.get<UserProfileResponse>("/api/v1/users/profile");
    return res.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

export async function updateUserProfile(formData: FormData) {
  try {
    const res = await httpClient.patch<UserProfileResponse>(
      "/api/v1/users/profile",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return {
      success: true,
      message: res.message || "Profile updated successfully",
      data: res.data,
    };
  } catch (error: any) {
    const backendMessage = error?.response?.data?.message;
    return {
      success: false,
      message: Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage || error?.message || "Failed to update profile",
    };
  }
}



export interface AllUsersParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  status?: string;
  role?: string;
}

export interface AllUsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminUser[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getAllUsersAction(
  params: AllUsersParams = {},
): Promise<AllUsersResponse> {
  try {
    const res = await httpClient.get<AdminUser[]>(
      "/api/v1/users/super-admin/all-users",
      {
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          sortBy: params.sortBy ?? "created_at",
          ...(params.status ? { status: params.status } : {}),
          ...(params.role ? { role: params.role } : {}),
        },
      },
    );
    return {
      success: res.success,
      statusCode: res.statusCode,
      message: res.message,
      data: Array.isArray(res.data) ? res.data : [],
      meta: res.meta,
    };
  } catch (error: any) {
    const backendMessage = error?.response?.data?.message;
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: Array.isArray(backendMessage)
        ? backendMessage[0]
        : (backendMessage ?? "Failed to load users"),
      data: [],
    };
  }
}

export async function changePasswordAction(payload: ChangePasswordPayload) {
  try {
    const res = await httpClient.post<{ message: string }>(
      "/auth/change-password",
      payload,
    );
    return {
      success: true,
      message: res.message || "Password changed successfully",
    };
  } catch (error: any) {
    const backendMessage = error?.response?.data?.message;
    return {
      success: false,
      message: Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage || error?.message || "Failed to change password",
    };
  }
}

export type UserReviewAction = "approve" | "reject" | "suspend";

export interface ApproveB2BUserPayload {
  package_id: string;
  credit_limit: number;
}

export interface UserActionResponse {
  success: boolean;
  statusCode?: number;
  message: string;
}

const USER_ACTION_ENDPOINTS: Record<UserReviewAction, string> = {
  approve: "/users/approve-b2b/",
  reject: "/users/reject-b2b/",
  suspend: "/users/suspend-user/",
};

export async function reviewB2BUserAction(
  id: string,
  action: UserReviewAction,
  payload?: ApproveB2BUserPayload,
): Promise<UserActionResponse> {
  try {
    const body =
      action === "approve"
        ? (payload ?? { package_id: "", credit_limit: 0 })
        : {};
    const res = await httpClient.patch<{ message: string }>(
      `${USER_ACTION_ENDPOINTS[action]}${encodeURIComponent(id)}`,
      body,
    );
    return {
      success: true,
      message:
        res.message ||
        `User ${
          action === "approve"
            ? "approved"
            : action === "reject"
              ? "rejected"
              : "suspended"
        } successfully`,
    };
  } catch (error: any) {
    const backendMessage = error?.response?.data?.message;
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage || error?.message || "Failed to update user status",
    };
  }
}
