"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { App, Button, Input, InputNumber, Modal, Tooltip } from "antd";
import type { TablePaginationConfig } from "antd";
import { FiArrowRight, FiCalendar, FiRotateCcw } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";
import Table from "@/components/common/Table/Table";
import {
  getTicketIssueRequestsAction,
  approveTicketIssueAction,
  rejectTicketIssueAction,
  type TicketIssueRequest,
} from "@/actions/issueTicket.action";
import { getTicketAction } from "@/actions/booking.action";
import type { BookingItem } from "@/actions/booking.action";
import { encoding } from "@/utils";

const formatDate = (value?: string | null): string =>
  value ? dayjs(value).format("DD-MM-YYYY") : "—";

const formatAmount = (value: number | string): string =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getPassengerNames = (
  passengers: BookingItem["booking_passengers"] = [],
): string => {
  if (!passengers?.length) return "—";
  return passengers
    .map(
      (p) => `${p.title ? `${p.title} ` : ""}${p.first_name} ${p.last_name}`.trim(),
    )
    .join(", ");
};

const baseRow = (issue: TicketIssueRequest) => ({
  key: issue.id,
  requestId: issue.id,
  bookingId: issue.booking_id ?? "",
  ticketId: issue.ticket_id ?? "",
  ticketNumber: issue.ticket_number ?? null,
  requestedOn: formatDate(issue.created_at),
  bookingDate: "—",
  bookingRef: "—",
  pax: "—",
  gdsPnr: "—",
  airlinePnr: "—",
  travelDate: "—",
  origin: "—",
  destination: "—",
  airline: "—",
  flightNumber: "",
  grossAmount: 0,
  discountAmount: 0,
  netAmount: 0,
  currency: "৳",
});

type IssueRow = ReturnType<typeof baseRow>;

const enrichRow = (row: IssueRow, booking: BookingItem): IssueRow => {
  const gross = Number(
    booking.booking_fare?.gross_fare || booking.total_amount || 0,
  );
  const discount = Number(booking.booking_fare?.discount || 0);
  const total = Number(booking.booking_fare?.total_amount || 0);

  return {
    ...row,
    bookingDate: formatDate(booking.created_at),
    bookingRef: booking.booking_reference || "—",
    pax: getPassengerNames(booking.booking_passengers),
    gdsPnr: booking.gds_pnr || booking.provider_booking_id || "—",
    airlinePnr: booking.booking_segments?.[0]?.airline_pnr || "—",
    travelDate: formatDate(booking.booking_segments?.[0]?.departure_at),
    origin: booking.booking_segments?.[0]?.origin_airport_code ?? "—",
    destination: booking.booking_segments?.[0]?.destination_airport_code ?? "—",
    airline:
      booking.booking_segments?.[0]?.airline_code ||
      booking.booking_segments?.[0]?.airline ||
      "—",
    flightNumber: booking.booking_segments?.[0]?.flight_number ?? "",
    grossAmount: gross,
    discountAmount: discount,
    netAmount: total || gross - discount,
    currency: booking.currency?.symbol ?? "৳",
  };
};

function DateCell({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-[#5B6B7A]">
      <FiCalendar size={13} className="text-[#8FA9BE]" />
      {value}
    </span>
  );
}

function RouteCell({
  origin,
  destination,
}: {
  origin: string;
  destination: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-[#0F1B47]">{origin}</span>
      <span className="text-[#8FA9BE]">
        <FiArrowRight size={13} />
      </span>
      <span className="font-semibold text-[#0F1B47]">{destination}</span>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </label>
      <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-[#0F1B47]">
        {value}
      </div>
    </div>
  );
}

interface EditForm {
  ticketNo: string;
  grossAmount: number;
  netAmount: number;
}

const EMPTY_FORM: EditForm = { ticketNo: "", grossAmount: 0, netAmount: 0 };

export default function IssueRequestTable() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [editingRow, setEditingRow] = useState<IssueRow | null>(null);
  const [form, setForm] = useState<EditForm>(EMPTY_FORM);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

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
      const issues = res.data ?? [];
      const rows = await Promise.all(
        issues.map(async (issue) => {
          const row = baseRow(issue);
          if (!row.bookingId) return row;
          const booking = await getTicketAction(row.bookingId);
          return booking.data ? enrichRow(row, booking.data) : row;
        }),
      );
      return {
        rows,
        total: res.meta?.total ?? issues.length,
      };
    },
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  const openEdit = useCallback((row: IssueRow) => {
    setForm({
      ticketNo: row.ticketNumber ?? "",
      grossAmount: row.grossAmount,
      netAmount: row.netAmount,
    });
    setEditingRow(row);
  }, []);

  const closeEdit = () => {
    setEditingRow(null);
    setForm(EMPTY_FORM);
  };

  const handleApprove = async () => {
    if (!editingRow) return;
    const ticketNo = form.ticketNo?.trim();
    if (!ticketNo) {
      message.error("Ticket no is required");
      return;
    }
    setIsApproving(true);
    const res = await approveTicketIssueAction(editingRow.requestId, {
      ticket_numbers: [ticketNo],
      gross_amount: form.grossAmount,
      net_amount: form.netAmount,
    });
    setIsApproving(false);
    if (res.success) {
      message.success(res.message || "Issue request approved");
      closeEdit();
      queryClient.invalidateQueries({ queryKey: ["ticket-issue-requests"] });
    } else {
      message.error(res.message || "Failed to approve issue request");
    }
  };

  const handleReject = async () => {
    if (!editingRow) return;
    const { value: reason } = await Swal.fire({
      title: "Reject Issue Request",
      input: "textarea",
      inputPlaceholder: "Enter rejection reason",
      inputValidator: (v) =>
        v?.trim() ? undefined : "Rejection reason is required",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Reject Request",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
    if (!reason) return;
    setIsRejecting(true);
    const res = await rejectTicketIssueAction(editingRow.requestId, {
      reject_reason: reason.trim(),
    });
    setIsRejecting(false);
    if (res.success) {
      message.success(res.message || "Issue request rejected");
      closeEdit();
      queryClient.invalidateQueries({ queryKey: ["ticket-issue-requests"] });
    } else {
      message.error(res.message || "Failed to reject issue request");
    }
  };

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
        title: "Booking Date",
        dataIndex: "bookingDate",
        width: 130,
        render: (v: string) => <DateCell value={v} />,
      },
      {
        title: "Request Date",
        dataIndex: "requestedOn",
        width: 130,
        render: (v: string) => <DateCell value={v} />,
      },
      {
        title: "Booking Ref.",
        dataIndex: "bookingRef",
        width: 170,
        render: (v: string) => (
          <span className="font-semibold text-[#0F1B47]">{v}</span>
        ),
      },
      {
        title: "Pax",
        dataIndex: "pax",
        width: 200,
        render: (v: string) => (
          <span className="line-clamp-2 text-sm text-[#5B6B7A]" title={v}>
            {v}
          </span>
        ),
      },
      {
        title: "GDS PNR",
        dataIndex: "gdsPnr",
        width: 130,
        render: (v: string) => (
          <span className="font-mono text-sm font-semibold tracking-wide text-[#0F1B47]">
            {v}
          </span>
        ),
      },
      {
        title: "Airlines PNR",
        dataIndex: "airlinePnr",
        width: 130,
        render: (v: string) => (
          <span className="font-mono text-sm tracking-wide text-[#5B6B7A]">
            {v}
          </span>
        ),
      },
      {
        title: "Travel Date",
        dataIndex: "travelDate",
        width: 130,
        render: (v: string) => <DateCell value={v} />,
      },
      {
        title: "Route",
        dataIndex: "route",
        width: 160,
        render: (_: string, row: IssueRow) => (
          <RouteCell origin={row.origin} destination={row.destination} />
        ),
      },
      {
        title: "Airlines",
        dataIndex: "airline",
        width: 140,
        render: (v: string, row: IssueRow) => (
          <div className="flex flex-col">
            <span className="font-semibold uppercase text-[#0F1B47]">
              {v}
            </span>
            {row.flightNumber && (
              <span className="text-xs text-[#8FA9BE]">{row.flightNumber}</span>
            )}
          </div>
        ),
      },
      {
        title: "Gross",
        dataIndex: "grossAmount",
        width: 130,
        align: "right" as const,
        render: (v: number, row: IssueRow) => (
          <span className="font-semibold text-[#0F1B47]">
            {row.currency}
            {formatAmount(v)}
          </span>
        ),
      },
      {
        title: "Dis. Fare",
        dataIndex: "discountAmount",
        width: 120,
        align: "right" as const,
        render: (v: number, row: IssueRow) => (
          <span className="font-semibold text-emerald-600">
            {row.currency}
            {formatAmount(v)}
          </span>
        ),
      },
      {
        title: "Action",
        dataIndex: "action",
        width: 320,
        align: "center" as const,
        render: (_: string, row: IssueRow) => (
          <div className="flex items-center justify-center gap-2">
            <Tooltip title="View Ticket" color="#000">
              <IoEyeOutline
                size={20}
                className={`text-green-600 ${
                  row.bookingId ? "cursor-pointer" : "cursor-not-allowed opacity-30"
                }`}
                onClick={() => {
                  if (row.bookingId) {
                    router.push(
                      `/console/bookings/ticket/${encoding(row.bookingId)}`,
                    );
                  }
                }}
              />
            </Tooltip>
            <Tooltip title="Cancel Refund" color="#000">
              <FiRotateCcw
                size={20}
                className={`text-red-600 ${
                  row.bookingId ? "cursor-pointer" : "cursor-not-allowed opacity-30"
                }`}
                onClick={() => {
                  if (row.bookingId) {
                    router.push(
                      `/console/bookings/ticket/${encoding(row.bookingId)}`,
                    );
                  }
                }}
              />
            </Tooltip>
            <Tooltip title="Edit" color="#000">
              <AiOutlineEdit
                size={20}
                className="cursor-pointer text-blue-600"
                onClick={() => openEdit(row)}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [openEdit, router],
  );

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 20);
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

      <Modal
        title="Edit Issue Request"
        open={Boolean(editingRow)}
        onCancel={closeEdit}
        footer={[
          <Button
            key="reject"
            danger
            loading={isRejecting}
            onClick={handleReject}
          >
            Reject
          </Button>,
          <Button key="cancel" onClick={closeEdit}>
            Cancel
          </Button>,
          <Button
            key="approve"
            type="primary"
            className="!bg-primary text-white"
            loading={isApproving}
            onClick={handleApprove}
          >
            Approve
          </Button>,
        ]}
        destroyOnHidden
      >
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ReadOnlyField label="Booking Ref." value={editingRow?.bookingRef ?? "—"} />
            <ReadOnlyField label="Pax" value={editingRow?.pax ?? "—"} />
            <ReadOnlyField label="GDS PNR" value={editingRow?.gdsPnr ?? "—"} />
            <ReadOnlyField label="Airlines PNR" value={editingRow?.airlinePnr ?? "—"} />
            <ReadOnlyField label="Travel Date" value={editingRow?.travelDate ?? "—"} />
            <ReadOnlyField
              label="Route"
              value={
                editingRow
                  ? `${editingRow.origin} → ${editingRow.destination}`
                  : "—"
              }
            />
          </div>

          <hr className="border-gray-100" />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Ticket No <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.ticketNo}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, ticketNo: e.target.value }))
              }
              placeholder="Enter ticket number"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Gross Amount
              </label>
              <InputNumber
                className="w-full"
                min={0}
                value={form.grossAmount}
                onChange={(v) =>
                  setForm((prev) => ({ ...prev, grossAmount: v ?? 0 }))
                }
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Net Amount
              </label>
              <InputNumber
                className="w-full"
                min={0}
                value={form.netAmount}
                onChange={(v) =>
                  setForm((prev) => ({ ...prev, netAmount: v ?? 0 }))
                }
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}