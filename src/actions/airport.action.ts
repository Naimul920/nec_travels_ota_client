"use server";

import { AxiosError } from "axios";
import { httpClient } from "@/lib/axios/httpClient";

export interface Airport {
  id: string;
  city: string;
  iata: string;
  name: string;
}

export interface AirportSearchResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Airport[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchAirportsParams {
  name: string;
  page?: number;
  limit?: number;
}

export async function searchAirportsAction(
  params: SearchAirportsParams,
): Promise<AirportSearchResponse> {
  try {
    const res = await httpClient.get<Airport[]>("/api/v1/airport-search", {
      params: {
        name: params.name || "",
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      },
    });

    return {
      success: res.success,
      statusCode: res.statusCode,
      message: res.message,
      data: res.data || [],
      meta: (res as unknown as AirportSearchResponse)?.meta,
    };
  } catch (error) {
    const { message, statusCode } = extractApiError(
      error,
      "Failed to search airports",
    );
    return { success: false, statusCode, message, data: [] };
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