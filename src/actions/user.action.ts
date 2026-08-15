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
  searchTerm?: string;
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
          searchTerm: params.searchTerm ?? "",
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

export type AdminUserStatusAction =
  | "activate"
  | "suspend"
  | "block"
  | "unblock";

const ADMIN_USER_STATUS_ENDPOINTS: Record<AdminUserStatusAction, string> = {
  activate: "/users/activate-user/",
  suspend: "/users/suspend-user/",
  block: "/users/block-user/",
  unblock: "/users/unblock-user/",
};

export async function changeUserStatusAction(
  id: string,
  action: AdminUserStatusAction,
): Promise<UserActionResponse> {
  try {
    const res = await httpClient.patch<{ message: string }>(
      `${ADMIN_USER_STATUS_ENDPOINTS[action]}${encodeURIComponent(id)}`,
      {},
    );
    return {
      success: true,
      statusCode: res.statusCode,
      message:
        res.message || `User ${action} successfully`,
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

export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  department?: string;
  currency_id?: string;
  credit_limit?: number;
  package_id?: string;
}

export async function updateUserAction(
  id: string,
  payload: UpdateUserPayload,
): Promise<UserActionResponse> {
  try {
    const res = await httpClient.patch<{ message: string }>(
      `/api/v1/users/update-user/${encodeURIComponent(id)}`,
      payload,
    );
    return {
      success: true,
      statusCode: res.statusCode,
      message: res.message || "User updated successfully",
    };
  } catch (error: any) {
    const backendMessage = error?.response?.data?.message;
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage || error?.message || "Failed to update user",
    };
  }
}

export interface ChangeUserPasswordPayload {
  password: string;
  password_confirmation: string;
}

export async function changeAdminUserPasswordAction(
  id: string,
  payload: ChangeUserPasswordPayload,
): Promise<UserActionResponse> {
  try {
    const res = await httpClient.patch<{ message: string }>(
      `/api/v1/users/super-admin/change-password/${encodeURIComponent(id)}`,
      payload,
    );
    return {
      success: true,
      statusCode: res.statusCode,
      message: res.message || "Password changed successfully",
    };
  } catch (error: any) {
    const backendMessage = error?.response?.data?.message;
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage || error?.message || "Failed to change password",
    };
  }
}

export async function deleteUserAction(
  id: string,
): Promise<UserActionResponse> {
  try {
    const res = await httpClient.delete<{ message: string }>(
      `/users/delete-user/${encodeURIComponent(id)}`,
    );
    return {
      success: true,
      statusCode: res.statusCode,
      message: res.message || "User deleted successfully",
    };
  } catch (error: any) {
    const backendMessage = error?.response?.data?.message;
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage || error?.message || "Failed to delete user",
    };
  }
}
