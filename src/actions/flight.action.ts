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
  try {
    const res = await httpClient.post<RevalidateItineraryResponse["data"]>(
      "/api/v1/flights/revalidate-itinerary",
      payload,
    );
    return res as RevalidateItineraryResponse;
  } catch (error: any) {
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: Array.isArray(error?.response?.data?.message)
        ? error.response.data.message.join(", ")
        : error?.response?.data?.message ||
          error?.message ||
          "Could not revalidate itinerary. Please try again.",
      data: { quoteId: "", itineraries: [] },
    };
  }
};

// export const bookFlightAction = async (
//   payload: BookFlightPayload,
// ): Promise<FlightBookingResponse> => {
//   const res = await httpClient.post<FlightBookingResponse["data"]>(
//     "/api/v1/flights/book",
//     payload,
//   );
//   return res as FlightBookingResponse;
// };

export const bookFlightAction = async (
  payload: BookFlightPayload,
): Promise<FlightBookingResponse> => {
  try {
    console.log("flight book payload 888888888888",JSON.stringify(payload))
    const res = await httpClient.post<FlightBookingResponse["data"]>(
      "/api/v1/flights/book",
      payload,
    );
    return res as FlightBookingResponse;
  } catch (error: any) {
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: Array.isArray(error?.response?.data?.message)
        ? error.response.data.message.join(", ")
        : error?.response?.data?.message ||
          error?.message ||
          "Could not book flight. Please try again.",
      data: { booking_id: "", booking_reference: "", pnr: "" },
    };
  }
};
