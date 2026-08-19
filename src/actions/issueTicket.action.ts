"use server";

import { AxiosError } from "axios";
import { httpClient } from "@/lib/axios/httpClient";

export interface IssueTicketItem {
  id: string;
  booking_reference?: string;
  booking_id?: string;
  pnr?: string;
  gds_pnr?: string;
  status?: string;
  total_amount?: string;
  amount?: number;
  currency?: string;
  created_at?: string;
  travel_date?: string;
  origin?: string;
  destination?: string;
  airline?: string;
  contact_no?: string;
  contactNo?: string;
  booked_on?: string;
  bookedOn?: string;
  [key: string]: unknown;
}

interface IssueTicketsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IssueTicketsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IssueTicketItem[];
  meta?: IssueTicketsMeta;
}

export interface FetchIssueTicketsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
}

export async function getIssueTicketsAction(
  params: FetchIssueTicketsParams = {},
): Promise<IssueTicketsResponse> {
  try {
    const res = await httpClient.get<IssueTicketsResponse>(
      "/api/v1/issue-tickets/mine",
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
      data: (res.data?.data as IssueTicketItem[]) || [],
      meta: res.data?.meta,
    };
  } catch (error: any) {
    const backendMessage = error?.response?.data?.message;
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: Array.isArray(backendMessage)
        ? backendMessage[0]
        : (backendMessage ?? "Failed to load tickets"),
      data: [],
    };
  }
}

export interface RequestTicketIssueResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: Record<string, unknown> | null;
}

export async function requestTicketIssueAction(
  bookingId: string,
  remarks = "Please issue the ticket as soon as possible",
): Promise<RequestTicketIssueResponse> {
  try {
    const res = await httpClient.post<Record<string, unknown>>(
      `/api/v1/ticket-issues/bookings/${encodeURIComponent(bookingId)}/request`,
      { remarks },
    );
    return {
      success: res.success,
      statusCode: res.statusCode,
      message: res.message,
      data: res.data ?? null,
    };
  } catch (error) {
    const { message, statusCode } = extractApiError(
      error,
      "Failed to request ticket issue",
    );
    return { success: false, statusCode, message, data: null };
  }
}

export interface TicketIssueRequest {
  id: string;
  ticket_id?: string | null;
  booking_id?: string | null;
  type?: string;
  status?: string;
  ticket_number?: string | null;
  wallet_transaction_id?: string | null;
  reviewed_at?: string | null;
  reject_reason?: string | null;
  remarks?: string | null;
  created_at?: string;
  booking?: {
    id?: string;
    booking_reference?: string;
    status?: string;
    total_amount?: string;
    created_at?: string;
    updated_at?: string;
    gds_pnr?: string;
    currency?: { id?: string; code?: string; symbol?: string } | null;
    booking_fare?: {
      base_fare?: string;
      tax?: string;
      gross_fare?: string;
      ait?: string;
      service_charge?: string;
      discount?: string;
      offer_amount?: string;
      total_amount?: string;
    } | null;
    booking_passengers?: Array<{
      id?: string;
      title?: string;
      first_name?: string;
      last_name?: string;
      passenger_type?: string;
    }>;
    booking_segments?: Array<{
      airline?: string;
      flight_number?: string;
      airline_code?: string;
      origin_airport_code?: string;
      destination_airport_code?: string;
      departure_at?: string;
      arrival_at?: string;
      airline_pnr?: string;
    }>;
  } | null;
  ticket?: {
    id?: string;
    ticket_number?: string | null;
    status?: string;
    created_at?: string;
  } | null;
  wallet_transaction?: {
    id?: string;
    amount?: string;
    balance_before?: string;
    balance_after?: string;
    description?: string;
    created_at?: string;
  } | null;
}

export interface TicketIssueRequestMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TicketIssueRequestsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: TicketIssueRequest[];
  meta?: TicketIssueRequestMeta;
}

export interface FetchTicketIssueRequestsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
}

export async function getTicketIssueRequestsAction(
  params: FetchTicketIssueRequestsParams = {},
): Promise<TicketIssueRequestsResponse> {
  try {
    const res = await httpClient.get<
      TicketIssueRequest[] | { data?: TicketIssueRequest[]; meta?: TicketIssueRequestMeta }
    >("/api/v1/ticket-issues/all", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        sortBy: params.sortBy ?? "created_at",
        sortOrder: params.sortOrder ?? "desc",
        ...(params.status ? { status: params.status } : {}),
      },
    });

    const raw = res.data as unknown;
    const items = Array.isArray(raw)
      ? raw
      : (raw as { data?: TicketIssueRequest[] })?.data ?? [];

    return {
      success: res.success,
      statusCode: res.statusCode,
      message: res.message,
      data: items || [],
      meta:
        res.meta ??
        (raw as { meta?: TicketIssueRequestMeta } | null)?.meta,
    };
  } catch (error) {
    const { message, statusCode } = extractApiError(
      error,
      "Failed to load ticket issue requests",
    );
    return { success: false, statusCode, message, data: [] };
  }
}

export interface ApproveTicketIssuePayload {
  ticket_numbers: string[];
  gross_amount?: number;
  net_amount?: number;
}

export async function approveTicketIssueAction(
  id: string,
  payload: ApproveTicketIssuePayload,
): Promise<RequestTicketIssueResponse> {
  try {
    const res = await httpClient.patch<Record<string, unknown>>(
      `/api/v1/ticket-issues/${encodeURIComponent(id)}/approve`,
      payload,
    );
    return {
      success: res.success,
      statusCode: res.statusCode,
      message: res.message,
      data: res.data ?? null,
    };
  } catch (error) {
    const { message, statusCode } = extractApiError(
      error,
      "Failed to approve ticket issue",
    );
    return { success: false, statusCode, message, data: null };
  }
}

export interface RejectTicketIssuePayload {
  reject_reason: string;
}

export async function rejectTicketIssueAction(
  id: string,
  payload: RejectTicketIssuePayload,
): Promise<RequestTicketIssueResponse> {
  try {
    const res = await httpClient.patch<Record<string, unknown>>(
      `/api/v1/ticket-issues/${encodeURIComponent(id)}/reject`,
      payload,
    );
    return {
      success: res.success,
      statusCode: res.statusCode,
      message: res.message,
      data: res.data ?? null,
    };
  } catch (error) {
    const { message, statusCode } = extractApiError(
      error,
      "Failed to reject ticket issue",
    );
    return { success: false, statusCode, message, data: null };
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