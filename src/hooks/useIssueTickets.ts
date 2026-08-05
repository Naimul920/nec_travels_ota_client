import {
  getIssueTicketsAction,
  type FetchIssueTicketsParams,
  type IssueTicketsResponse,
} from "@/actions/issueTicket.action";
import { useQuery } from "@tanstack/react-query";

export function useIssueTickets(params: FetchIssueTicketsParams = {}) {
  return useQuery<IssueTicketsResponse>({
    queryKey: ["issueTickets", params],
    queryFn: () => getIssueTicketsAction(params),
    staleTime: 30 * 1000,
    retry: false,
  });
}