"use server";

import { AxiosError } from "axios";
import { httpClient } from "@/lib/axios/httpClient";
import type {
  CommissionCreateResponse,
  CommissionItem,
  CommissionListResponse,
} from "@/interface/commission";

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

export interface CommissionParams {
  page?: number;
  limit?: number;
  sortBy?: string;
}

export async function getCommissionsAction(
  params: CommissionParams = {},
): Promise<CommissionListResponse> {
  try {
    const res = await httpClient.get<CommissionItem[]>(
      "/api/v1/commissions",
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
      data: Array.isArray(res.data) ? res.data : [],
      meta: (res as unknown as CommissionListResponse)?.meta,
    };
  } catch (error) {
    const { statusCode, message } = extractApiError(
      error,
      "Failed to load commissions",
    );
    return { success: false, statusCode, message, data: [] };
  }
}

export interface CommissionInput {
  airline?: string | null;
  origin?: string | null;
  destination?: string | null;
  business_class_out: number;
  economy_class_out: number;
  business_charge_out: number;
  economy_charge_out: number;
  api_currency_id?: string | null;
  user_currency_id?: string | null;
  package_id?: string | null;
}

export const createCommissionAction = async (
  payload: CommissionInput,
): Promise<CommissionCreateResponse> => {
  try {
    const res = await httpClient.post<CommissionItem>(
      "/api/v1/commissions",
      payload,
    );
    return {
      success: true,
      statusCode: res.statusCode,
      message: res.message || "Commission created successfully",
      data: res.data || null,
    };
  } catch (error) {
    const { statusCode, message } = extractApiError(
      error,
      "Failed to create commission",
    );
    return { success: false, statusCode, message, data: null };
  }
};

export const updateCommissionAction = async (
  id: string,
  payload: CommissionInput,
): Promise<CommissionCreateResponse> => {
  try {
    const res = await httpClient.put<CommissionItem>(
      `/api/v1/commissions/${encodeURIComponent(id)}`,
      payload,
    );
    return {
      success: true,
      statusCode: res.statusCode,
      message: res.message || "Commission updated successfully",
      data: res.data || null,
    };
  } catch (error) {
    const { statusCode, message } = extractApiError(
      error,
      "Failed to update commission",
    );
    return { success: false, statusCode, message, data: null };
  }
};

export const deleteCommissionAction = async (
  id: string,
): Promise<CommissionCreateResponse> => {
  try {
    const res = await httpClient.delete<CommissionItem>(
      `/api/v1/commissions/${encodeURIComponent(id)}`,
    );
    return {
      success: true,
      statusCode: res.statusCode,
      message: res.message || "Commission deleted successfully",
      data: res.data || null,
    };
  } catch (error) {
    const { statusCode, message } = extractApiError(
      error,
      "Failed to delete commission",
    );
    return { success: false, statusCode, message, data: null };
  }
};

export async function getPackagesAction(): Promise<
  { id: string; package_name: string }[]
> {
  try {
    const res = await httpClient.get<{ id: string; package_name: string }[]>(
      "/api/v1/packages",
    );
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray((res as unknown as { data: unknown[] })?.data)) {
      return (res as unknown as { data: { id: string; package_name: string }[] }).data;
    }
    return [];
  } catch (error) {
    console.error("Failed to load packages:", error);
return [];
  }
};