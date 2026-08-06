"use server";

import { AxiosError } from "axios";
import { httpClient } from "@/lib/axios/httpClient";
import type {
  BankCreateResponse,
  BankItem,
  BankListResponse,
} from "@/interface/bank";

const extractApiError = (error: unknown, fallback: string) => {
  const statusCode =
    error instanceof AxiosError ? error.response?.status || 500 : 500;

  let message = fallback;
  if (error instanceof AxiosError) {
    const backend = error.response?.data?.message;
    if (Array.isArray(backend)) {
      message = backend
        .map((item) =>
          typeof item === "string"
            ? item
            : typeof item?.message === "string"
              ? item.message
              : JSON.stringify(item),
        )
        .join(", ");
    } else if (typeof backend === "string" && backend) {
      message = backend;
    } else if (error.message) {
      message = error.message;
    }
  }

  return { statusCode, message };
};

export async function getBanksAction(): Promise<BankListResponse> {
  try {
    const res = await httpClient.get<BankItem[]>("/api/v1/banks");
    return {
      success: res.success,
      statusCode: res.statusCode,
      message: res.message,
      data: Array.isArray(res.data) ? res.data : [],
      meta: (res as unknown as BankListResponse)?.meta,
    };
  } catch (error) {
    const { statusCode, message } = extractApiError(
      error,
      "Failed to load banks",
    );
    return { success: false, statusCode, message, data: [] };
  }
}

export const createBankAction = async (
  formData: FormData,
): Promise<BankCreateResponse> => {
  try {
    const res = await httpClient.post<BankItem>("/api/v1/banks", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return {
      success: true,
      statusCode: res.statusCode,
      message: res.message || "Bank created successfully",
      data: res.data || null,
    };
  } catch (error) {
    const { statusCode, message } = extractApiError(
      error,
      "Failed to create bank",
    );
    return { success: false, statusCode, message, data: null };
  }
};