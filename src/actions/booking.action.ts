"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface BookingCurrency {
  code: string;
  symbol: string;
}

export interface BookingFare {
  base_fare: string;
  tax: string;
  ait: string;
  service_charge: string;
  discount: string;
  offer_amount: string;
  total_amount: string;
}

export interface BookingSegment {
  airline: string;
  airline_code: string;
  flight_number: string;
  origin_airport_code: string;
  destination_airport_code: string;
  departure_at: string;
  arrival_at: string;
}

export interface BookingItem {
  id: string;
  booking_reference: string;
  booking_source: string;
  status: string;
  provider: string;
  provider_booking_id: string;
  gds_pnr: string;
  total_amount: string;
  created_at: string;
  currency: BookingCurrency;
  booking_fare: BookingFare;
  booking_segments: BookingSegment[];
  booking_passengers: unknown[];
}

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
  } catch (error: any) {
    const backendMessage = error?.response?.data?.message;
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage || error?.message || "Failed to load bookings",
      data: [],
    };
  }
}

export interface SavedPassenger {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  country: string;
  passport_number: string;
  passport_expire: string;
  email: string;
  phone: string;
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
  } catch (error: any) {
    const backendMessage = error?.response?.data?.message;
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage || error?.message || "Failed to load passengers",
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