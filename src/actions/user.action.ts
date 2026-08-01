"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { UserProfileResponse } from "@/types/user.type";
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

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
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
