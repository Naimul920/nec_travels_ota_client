"use server";

import { AxiosError } from "axios";
import { httpClient } from "@/lib/axios/httpClient";
import type {
  DepositActionResponse,
  DepositItem,
  DepositListResponse,
  DepositStatementItem,
  DepositStatementResponse,
} from "@/interface/deposit";

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

export interface DepositParams {
  page?: number;
  limit?: number;
  sortBy?: string;
}

export async function getDepositsAction(
  params: DepositParams = {},
): Promise<DepositListResponse> {
  try {
    const res = await httpClient.get<DepositItem[]>("/api/v1/deposits/admin", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        sortBy: params.sortBy ?? "created_at",
      },
    });
    return {
      success: res.success,
      statusCode: res.statusCode,
      message: res.message,
      data: Array.isArray(res.data) ? res.data : [],
      meta: (res as unknown as DepositListResponse)?.meta,
    };
  } catch (error) {
    const { statusCode, message } = extractApiError(
      error,
      "Failed to load deposits",
    );
    return { success: false, statusCode, message, data: [] };
  }
}

const postDepositAction = async (
  id: string,
  action: "approve" | "reject" | "cancel",
): Promise<DepositActionResponse> => {
  try {
    const res = await httpClient.patch<DepositItem>(
      `/api/v1/deposits/${encodeURIComponent(id)}/${action}`,
      {},
    );
    return {
      success: true,
      statusCode: res.statusCode,
      message: res.message || `Deposit ${action} successful`,
      data: res.data || null,
    };
  } catch (error) {
    const { statusCode, message } = extractApiError(
      error,
      `Failed to ${action} deposit`,
    );
    return { success: false, statusCode, message, data: null };
  }
};

export async function getDepositStatementAction(
  params: DepositParams = {},
): Promise<DepositStatementResponse> {
  try {
    const res = await httpClient.get<DepositStatementItem[]>(
      "/api/v1/deposits/statement",
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
      meta: (res as unknown as DepositStatementResponse)?.meta,
    };
  } catch (error) {
    const { statusCode, message } = extractApiError(
      error,
      "Failed to load deposit statement",
    );
    return { success: false, statusCode, message, data: [] };
  }
}

export interface CreateDepositPayload {
  bankId: string;
  amount?: number;
  senderAccount?: string;
  senderName?: string;
  transactionId?: string;
  paymentDate?: string;
  note?: string;
  file?: File | null;
}

export async function createDepositAction(
  values: CreateDepositPayload,
): Promise<DepositActionResponse> {
  try {
    const formData = new FormData();
    formData.append("bank_id", values.bankId);
    if (values.amount) formData.append("amount", String(values.amount));
    if (values.senderAccount)
      formData.append("sender_account", values.senderAccount);
    if (values.senderName) formData.append("sender_name", values.senderName);
    if (values.transactionId)
      formData.append("transaction_id", values.transactionId);
    if (values.paymentDate)
      formData.append("payment_date", values.paymentDate);
    if (values.note) formData.append("note", values.note);
    if (values.file) formData.append("attachment", values.file);

    const res = await httpClient.post<DepositItem>(
      "/api/v1/deposits",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return {
      success: true,
      statusCode: res.statusCode,
      message: res.message || "Deposit request created successfully",
      data: res.data || null,
    };
  } catch (error) {
    const { statusCode, message } = extractApiError(
      error,
      "Failed to submit deposit",
    );
    return { success: false, statusCode, message, data: null };
  }
}

export async function approveDepositAction(id: string) {
  return postDepositAction(id, "approve");
}

export async function rejectDepositAction(id: string) {
  return postDepositAction(id, "reject");
}

export async function cancelDepositAction(id: string) {
  return postDepositAction(id, "cancel");
}