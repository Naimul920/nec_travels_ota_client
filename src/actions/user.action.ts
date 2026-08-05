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
    const res = await httpClient.get<AllUsersResponse>(
      "/api/v1/users/super-admin/all-users",
      {
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          sortBy: params.sortBy ?? "created_at",
        },
      },
    );
    return {
      success: res.success,
      statusCode: res.statusCode,
      message: res.message,
      data: (res.data?.data as AdminUser[]) || [],
      meta: res.data?.meta,
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
