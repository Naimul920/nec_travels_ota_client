"use client";

import { publicApi } from "@/helper/api/axios";
import { useState, useCallback } from "react";

interface SearchPayload {
  flight: string;
  from?: string;
  to?: string;
  start_date?: string;
  return_date?: string;
  no_of_adult: number;
  no_of_children: number;
  no_of_kids: number;
  no_of_infant: number;
  flight_class: string;
  segments?: { from: string; to: string; start_date: string }[];
}

interface FlightSearchResponse {
  data: {
    itinDetails: any[];
    noOfAdult: number;
    noOfChildren: number;
    noOfKids: number;
    noOfInfant: number;
  };
}

export const useFlightSearchMutation = () => {
  const [data, setData] = useState<FlightSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = useCallback(async (payload: SearchPayload) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const response = await publicApi.post<any>("/api/v1/flight/search", payload);
      setData(response as unknown as FlightSearchResponse);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return [mutate, { data, isLoading, isError, error }] as const;
};