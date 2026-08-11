import {
  getAdminBookingsAction,
  type FetchAdminBookingsParams,
} from "@/actions/booking.action";
import { useQuery } from "@tanstack/react-query";

export function useAdminBookings(params: FetchAdminBookingsParams = {}) {
  return useQuery<ReturnType<typeof getAdminBookingsAction> extends Promise<infer T> ? T : never>({
    queryKey: ["adminBookings", params],
    queryFn: () => getAdminBookingsAction(params),
    staleTime: 30 * 1000,
    retry: false,
  });
}
