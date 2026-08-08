import {
  getHoldPassengersAction,
  type FetchHoldPassengersParams,
} from "@/actions/booking.action";
import { useQuery } from "@tanstack/react-query";

export function useHoldPassengers(params: FetchHoldPassengersParams = {}) {
  return useQuery<ReturnType<typeof getHoldPassengersAction> extends Promise<infer T> ? T : never>({
    queryKey: ["holdPassengers", params],
    queryFn: () => getHoldPassengersAction(params),
    staleTime: 30 * 1000,
    retry: false,
  });
}