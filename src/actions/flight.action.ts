"use server";

import { httpClient } from "@/lib/axios/httpClient";
import type {
  BookFlightPayload,
  FlightBookingResponse,
  FlightSearchResponse,
  RevalidateItineraryPayload,
  RevalidateItineraryResponse,
  SearchPayload,
} from "@/interface/flight";

export const searchFlightAction = async (
  payload: SearchPayload,
): Promise<FlightSearchResponse> => {
  const res = await httpClient.post<FlightSearchResponse["data"]>(
    "/api/v1/flights/search",
    payload,
  );
  return res as FlightSearchResponse;
};

export const revalidateItineraryAction = async (
  payload: RevalidateItineraryPayload,
): Promise<RevalidateItineraryResponse> => {
  const res = await httpClient.post<RevalidateItineraryResponse["data"]>(
    "/api/v1/flights/revalidate-itinerary",
    payload,
  );
  return res as RevalidateItineraryResponse;
};

export const bookFlightAction = async (
  payload: BookFlightPayload,
): Promise<FlightBookingResponse> => {
  const res = await httpClient.post<FlightBookingResponse["data"]>(
    "/api/v1/flights/book",
    payload,
  );
  return res as FlightBookingResponse;
};
