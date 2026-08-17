"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import type { TablePaginationConfig } from "antd";
import Table from "@/components/common/Table/Table";
import ActionButton from "@/components/common/Action/ActionButton";
import {
  getTicketIssueRequestsAction,
  type TicketIssueRequest,
} from "@/actions/issueTicket.action";
import { encoding } from "@/utils";

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  issued: "bg-emerald-50 text-emerald-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  cancelled: "bg-red-50 text-red-700",
};

const formatDate = (value?: string | null): string =>
  value ? dayjs(value).format("DD-MM-YYYY") : "—";

const mapIssueRow = (issue: TicketIssueRequest) => ({
  key: issue.id,
  bookingId: issue.booking_id ?? "—",
  ticketId: issue.ticket_id ?? "—",
  type: issue.type ?? "—",
  status: (issue.status ?? "pending").toLowerCase(),
  remarks: issue.remarks ?? "—",
  requestedOn: formatDate(issue.created_at),
  reviewedAt: formatDate(issue.reviewed_at),
  rejectReason: issue.reject_reason ?? "—",
  viewLink: `/console/bookings/ticket/${encoding(issue.booking_id ?? issue.ticket_id ?? "")}`,
});

type IssueRow = ReturnType<typeof mapIssueRow>;

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        STATUS_BADGE[status] ?? "bg-gray-50 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function IssueRequestTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isPending: isLoading, isError, error } = useQuery({
    queryKey: ["ticket-issue-requests", page, pageSize],
    queryFn: async () => {
      const res = await getTicketIssueRequestsAction({
        page,
        limit: pageSize,
        sortBy: "created_at",
      });
      if (!res.success) {
        throw new Error(res.message || "Failed to load issue requests");
      }
      return {
        rows: (res.data ?? []).map(mapIssueRow),
        total: res.meta?.total ?? res.data?.length ?? 0,
      };
    },
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  const columns = useMemo(
    () => [
      {
        title: "SL",
        dataIndex: "sl",
        width: 56,
        align: "center" as const,
        render: (v: number) => (
          <span className="text-sm font-medium text-[#8FA9BE]">{v}</span>
        ),
      },
      {
        title: "Booking ID",
        dataIndex: "bookingId",
        width: 250,
        render: (v: string) => (
          <span className="font-mono text-sm font-semibold text-[#0F1B47]">
            {v}
          </span>
        ),
      },
      {
        title: "Ticket ID",
        dataIndex: "ticketId",
        width: 250,
        render: (v: string) => (
          <span className="font-mono text-sm text-[#5B6B7A]">{v}</span>
        ),
      },
      {
        title: "Type",
        dataIndex: "type",
        width: 100,
        render: (v: string) => (
          <span className="text-sm font-semibold uppercase text-[#0F1B47]">
            {v}
          </span>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        width: 120,
        render: (v: string) => <StatusBadge status={v} />,
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
        width: 260,
        render: (v: string) => (
          <span className="text-sm text-[#5B6B7A]">{v}</span>
        ),
      },
      {
        title: "Requested On",
        dataIndex: "requestedOn",
        width: 130,
        render: (v: string) => (
          <span className="text-sm text-[#5B6B7A]">{v}</span>
        ),
      },
      {
        title: "Reviewed At",
        dataIndex: "reviewedAt",
        width: 130,
        render: (v: string) => (
          <span className="text-sm text-[#5B6B7A]">{v}</span>
        ),
      },
      {
        title: "Reject Reason",
        dataIndex: "rejectReason",
        width: 200,
        render: (v: string) => (
          <span className="text-sm text-red-600">{v}</span>
        ),
      },
      {
        title: "Action",
        dataIndex: "action",
        width: 90,
        align: "center" as const,
        render: (_: string, row: IssueRow) => (
          <div className="flex items-center justify-center">
            <ActionButton viewLink={row.viewLink} />
          </div>
        ),
      },
    ],
    [],
  );

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  };

  return (
    <div className="px-5 sm:px-10">
      {isError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error instanceof Error ? error.message : "Failed to load issue requests"}
        </div>
      )}
      <Table
        title="Issue Request"
        hideSearch
        loading={isLoading}
        columns={columns}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
          showTotal: (t) => `${t} issue requests`,
        }}
        dataSource={rows.map((data, i) => ({
          ...data,
          sl: (page - 1) * pageSize + i + 1,
        }))}
        rowKey="key"
        onChange={handleTableChange}
      />
    </div>
  );
}
