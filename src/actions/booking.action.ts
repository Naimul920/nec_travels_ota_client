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