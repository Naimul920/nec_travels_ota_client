"use server";

import { AxiosError } from "axios";
import { httpClient } from "@/lib/axios/httpClient";
import { ROLE } from "@/constant";
import { getUserRole } from "@/utils/session";
import type { BookingItem } from "@/types";

export type {
  BookingCurrency,
  BookingFare,
  BookingSegment,
  BookingPassenger,
  BookingPayment,
  BookingTicket,
  BookingItem,
} from "@/types";

interface BookingResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: BookingItem[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    total_bookings: number;
  };
}

export async function getBookingsAction(): Promise<BookingResponse> {
  try {
    const res = await httpClient.get<BookingItem[]>("/api/v1/bookings");
    return {
      success: res.success,
      statusCode: res.statusCode,
      message: res.message,
      data: res.data || [],
      meta: (res as unknown as BookingResponse)?.meta,
    };
  } catch (error) {
    const { message, statusCode } = extractApiError(error, "Failed to load bookings");
    return { success: false, statusCode, message, data: [] };
  }
}

export interface FetchAdminBookingsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
}

export async function getAdminBookingsAction(
  params: FetchAdminBookingsParams = {},
): Promise<BookingResponse> {
  try {
    const res = await httpClient.get<BookingItem[]>(
      "/api/v1/bookings/admin/all-bookings",
      {
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          sortBy: params.sortBy ?? "created_at",
          sortOrder: params.sortOrder ?? "desc",
          ...(params.status ? { status: params.status } : {}),
        },
      },
    );
    return {
      success: res.success,
      statusCode: res.statusCode,
      message: res.message,
      data: res.data || [],
      meta: (res as unknown as BookingResponse)?.meta,
    };
  } catch (error) {
    const { message, statusCode } = extractApiError(
      error,
      "Failed to load bookings",
    );
    return { success: false, statusCode, message, data: [] };
  }
}

export interface TicketResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: BookingItem | null;
}

export async function getTicketAction(
  bookingId: string,
): Promise<TicketResponse> {
  try {
    const role = await getUserRole();
    const isAdmin = role === ROLE.ADMIN || role === ROLE.SUPER_ADMIN;
    const endpoint = isAdmin
      ? `/api/v1/bookings/admin/booking/${encodeURIComponent(bookingId)}`
      : `/api/v1/bookings/${encodeURIComponent(bookingId)}`;

    const res = await httpClient.get<BookingItem>(endpoint);
    console.log("res ticket88888",res)
    return {
      success: res.success,
      statusCode: res.statusCode,
      message: res.message,
      data: res.data || null,
    };
  } catch (error) {
    const { message, statusCode } = extractApiError(
      error,
      "Failed to load ticket",
    );
    return { success: false, statusCode, message, data: null };
  }
}

export interface SavedPassenger {
  id: string;
  passenger_type?: string;
  title: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob?: string;
  date_of_birth: string;
  nationality?: string;
  country: string;
  passport_number: string;
  passport_expiry?: string;
  passport_expire: string;
  email: string;
  phone: string;
  seat_number?: string | null;
  baggage?: string | null;
  meal?: string | null;
  created_at?: string;
}

export interface MyPassengersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: SavedPassenger[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    total_passengers: number;
  };
}

export async function getMyPassengersAction(
  searchTerm: string,
  userId?: string | null,
): Promise<MyPassengersResponse> {
  try {
    const res = await httpClient.get<SavedPassenger[]>(
      "/api/v1/bookings/my-passengers",
      {
        params: {
          searchTerm: searchTerm || "",
          page: 1,
          limit: 10,
          sortBy: "first_name",
          sortOrder: "desc",
          user_id: userId || "",
        },
      },
    );
    return {
      success: res.success,
      statusCode: res.statusCode,
      message: res.message,
      data: res.data || [],
      meta: (res as unknown as MyPassengersResponse)?.meta ?? {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        total_passengers: 0,
      },
    };
  } catch (error) {
    const { message, statusCode } = extractApiError(
      error,
      "Failed to load passengers",
    );
    return {
      success: false,
      statusCode,
      message,
      data: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        total_passengers: 0,
      },
    };
  }
}

export interface FetchHoldPassengersParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  booking_source?: string;
}

export async function getHoldPassengersAction(
  params: FetchHoldPassengersParams = {},
): Promise<MyPassengersResponse> {
  try {
    const res = await httpClient.get<SavedPassenger[]>(
      "/api/v1/bookings/my-passengers",
      {
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          sortBy: params.sortBy ?? "created_at",
          sortOrder: params.sortOrder ?? "desc",
          status: params.status ?? "HOLD",
          booking_source: params.booking_source ?? "B2B",
        },
      },
    );
    return {
      success: res.success,
      statusCode: res.statusCode,
      message: res.message,
      data: res.data || [],
      meta: (res as unknown as MyPassengersResponse)?.meta ?? {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        total_passengers: 0,
      },
    };
  } catch (error) {
    const { message, statusCode } = extractApiError(
      error,
      "Failed to load hold passengers",
    );
    return {
      success: false,
      statusCode,
      message,
      data: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        total_passengers: 0,
      },
    };
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