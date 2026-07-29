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
