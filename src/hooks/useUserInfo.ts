import { getUserInfo } from "@/actions/user.action";
import { useQuery } from "@tanstack/react-query";

export function useUserInfo() {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: () => getUserInfo(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    // refetchOnWindowFocus: false,
  });
}
