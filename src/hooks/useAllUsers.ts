import {
  getAllUsersAction,
  type AllUsersParams,
  type AllUsersResponse,
} from "@/actions/user.action";
import { useQuery } from "@tanstack/react-query";

export function useAllUsers(params: AllUsersParams = {}) {
  return useQuery<AllUsersResponse>({
    queryKey: ["allUsers", params],
    queryFn: () => getAllUsersAction(params),
    staleTime: 0,
    retry: false,
  });
}