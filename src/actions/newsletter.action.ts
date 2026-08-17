"use server";

import { AxiosError } from "axios";
import { httpClient } from "@/lib/axios/httpClient";

export interface NewsletterSubscribeResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    id?: string;
    email?: string;
  };
}

export async function subscribeNewsletterAction(
  email: string,
): Promise<NewsletterSubscribeResponse> {
  try {
    const res = await httpClient.post<{ id: string; email: string }>(
      "/api/v1/newsletter/subscribe",
      { email },
    );

    return {
      success: res.success,
      statusCode: res.statusCode,
      message: res.message,
      data: res.data,
    };
  } catch (error) {
    const { message, statusCode } = extractApiError(
      error,
      "Failed to subscribe to newsletter",
    );
    return { success: false, statusCode, message };
  }
}

const extractApiError = (
  error: unknown,
  fallback: string,
): { message: string; statusCode: number } => {
  if (error instanceof AxiosError) {
    const backendMessage = error.response?.data?.message;
    return {
      message: Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage || error.message || fallback,
      statusCode: error.response?.status || 500,
    };
  }
  return {
    message: error instanceof Error ? error.message : fallback,
    statusCode: 500,
  };
};