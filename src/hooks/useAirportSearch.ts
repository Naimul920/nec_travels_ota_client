"use client";

import {
  searchAirportsAction,
  type AirportSearchResponse,
  type SearchAirportsParams,
} from "@/actions/airport.action";
import { useQuery } from "@tanstack/react-query";

export function useAirportSearch(params: SearchAirportsParams, enabled: boolean) {
  return useQuery<AirportSearchResponse>({
    queryKey: ["airport-search", params.name, params.page, params.limit],
    queryFn: () => searchAirportsAction(params),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}