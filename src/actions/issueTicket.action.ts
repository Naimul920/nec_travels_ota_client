"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface IssueTicketItem {
  id: string;
  booking_reference?: string;
  booking_id?: string;
  pnr?: string;
  gds_pnr?: string;
  status?: string;
  total_amount?: string;
  amount?: number;
  currency?: string;
  created_at?: string;
  travel_date?: string;
  origin?: string;
  destination?: string;
  airline?: string;
  contact_no?: string;
  contactNo?: string;
  booked_on?: string;
  bookedOn?: string;
  [key: string]: unknown;
}

interface IssueTicketsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IssueTicketsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IssueTicketItem[];
  meta?: IssueTicketsMeta;
}

export interface FetchIssueTicketsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
}

export async function getIssueTicketsAction(
  params: FetchIssueTicketsParams = {},
): Promise<IssueTicketsResponse> {
  try {
    const res = await httpClient.get<IssueTicketsResponse>(
      "/api/v1/issue-tickets/mine",
      {
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          sortBy: params.sortBy ?? "created_at",
        },
      },
    );
    return {
      success: res.success,
      statusCode: res.statusCode,
      message: res.message,
      data: (res.data?.data as IssueTicketItem[]) || [],
      meta: res.data?.meta,
    };
  } catch (error: any) {
    const backendMessage = error?.response?.data?.message;
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: Array.isArray(backendMessage)
        ? backendMessage[0]
        : (backendMessage ?? "Failed to load tickets"),
      data: [],
    };
  }
}