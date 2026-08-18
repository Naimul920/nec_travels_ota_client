"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Input, Modal, Tooltip } from "antd";
import type { TablePaginationConfig } from "antd";
import Table from "@/components/common/Table/Table";
import ActionButton from "@/components/common/Action/ActionButton";
import {
  getAdminBookingsAction,
  getBookingsAction,
  BookingItem,
} from "@/actions/booking.action";
import {
  approveTicketIssueAction,
  getTicketIssueRequestsAction,
  rejectTicketIssueAction,
  type TicketIssueRequest,
} from "@/actions/issueTicket.action";
import { encoding } from "@/utils";
import Swal from "sweetalert2";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiPauseCircle,
  FiXCircle,
  FiInbox,
  FiSearch,
  FiEdit2,
  FiRotateCcw,
} from "react-icons/fi";

const { Search } = Input;

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  hold: "bg-sky-50 text-sky-700",
  issued: "bg-emerald-50 text-emerald-700",
  cancel: "bg-red-50 text-red-700",
  cancelled: "bg-red-50 text-red-700",
  issue_pending: "bg-violet-50 text-violet-700",
  issue: "bg-emerald-50 text-emerald-700",
  void: "bg-gray-100 text-gray-700",
  reissued: "bg-teal-50 text-teal-700",
  reissued_pending: "bg-amber-50 text-amber-700",
  ssr: "bg-indigo-50 text-indigo-700",
  ssr_pending: "bg-amber-50 text-amber-700",
  refunded: "bg-emerald-50 text-emerald-700",
  refunded_pending: "bg-amber-50 text-amber-700",
};

const STATUS_ICON: Record<string, typeof FiClock> = {
  pending: FiClock,
  hold: FiPauseCircle,
  issued: FiCheckCircle,
  cancel: FiXCircle,
  cancelled: FiXCircle,
  issue_pending: FiClock,
  issue: FiCheckCircle,
  void: FiXCircle,
  reissued: FiCheckCircle,
  reissued_pending: FiClock,
  ssr: FiClock,
  ssr_pending: FiClock,
  refunded: FiCheckCircle,
  refunded_pending: FiClock,
};

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
    .map((p) => `${p.title ? `${p.title} ` : ""}${p.first_name} ${p.last_name}`.trim())
    .join(", ");
};

const mapBookingRow = (booking: BookingItem) => ({
  key: booking.id,
  raw: booking,
  bookingReference: booking.booking_reference,
  bookedOn: formatDate(booking.created_at),
  applyDate: formatDate(booking.updated_at || booking.created_at),
  issuedOn: formatDate(booking.tickets?.issued_at),
  passenger: getPassengerNames(booking.booking_passengers),
  origin: booking.booking_segments?.[0]?.origin_airport_code ?? "—",
  destination: booking.booking_segments?.[0]?.destination_airport_code ?? "—",
  airline: booking.booking_segments?.[0]?.airline_code ?? "—",
  flightNumber: booking.booking_segments?.[0]?.flight_number ?? "—",
  pnr: booking.gds_pnr || booking.provider_booking_id || "—",
  grossAmount: Number(
    booking.booking_fare?.gross_fare || booking.total_amount || 0,
  ),
  discountAmount: Number(booking.booking_fare?.discount || 0),
  refundAmount: Number(booking.refund_amount || 0),
  currency: booking.currency?.symbol ?? "৳",
  travel_date: formatDate(booking.booking_segments?.[0]?.departure_at),
  status: booking.status.toLowerCase(),
  remarks: booking.remarks || "—",
});

type BookingRow = ReturnType<typeof mapBookingRow>;

function StatusBadge({ status }: { status: string }) {
  const Icon = STATUS_ICON[status] ?? FiClock;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        STATUS_BADGE[status] ?? STATUS_BADGE.hold
      }`}
    >
      <Icon size={13} />
      {status}
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#12233D]/15 bg-white px-6 py-20 text-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#DCEBF9]">
        <FiInbox size={36} className="text-[#8FA9BE]" />
      </div>
      <h3 className="text-xl font-bold text-[#0F1B47]">No bookings found</h3>
      <p className="max-w-sm text-sm text-[#6B7785]">
        Bookings for this status will appear here.
      </p>
    </div>
  );
}

interface BookingsTableProps {
  status: string | string[];
  title: string;
  bookingSource?: string;
  dateColumn?: "created_at" | "issued_at";
  /** Show an extra "Apply Date" column before the main date column. */
  applyDate?: boolean;
  /** Show the "Refund Amount" column. */
  refundAmount?: boolean;
  /** Fetch from the admin all-bookings endpoint (admin / super admin). */
  admin?: boolean;
}

function BookingEditModal({
  booking,
  issueId,
  open,
  onClose,
  onSaved,
}: {
  booking: BookingItem;
  issueId?: string;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const firstSegment = booking.booking_segments?.[0];
  const pax = (booking.booking_passengers ?? [])
    .map((p) =>
      `${p.title ? `${p.title} ` : ""}${p.first_name} ${p.last_name}`.trim(),
    )
    .join(", ");
  const route = firstSegment
    ? `${firstSegment.origin_airport_code} - ${firstSegment.destination_airport_code}`
    : "—";

  const [ticketNo, setTicketNo] = useState("");
  const [grossAmount, setGrossAmount] = useState(() =>
    String(booking.booking_fare?.gross_fare ?? booking.total_amount ?? ""),
  );
  const [netAmount, setNetAmount] = useState(() =>
    String(booking.booking_fare?.offer_amount ?? booking.total_amount ?? ""),
  );

  const rows = [
    { label: "BOOKING REF.", value: booking.booking_reference ?? "—" },
    { label: "PAX", value: pax || "—" },
    { label: "GDS PNR", value: booking.gds_pnr ?? booking.provider_booking_id ?? "—" },
    { label: "AIR LINES PNR", value: firstSegment?.airline_pnr ?? "—" },
    {
      label: "TRAVEL DATE",
      value: firstSegment?.departure_at
        ? dayjs(firstSegment.departure_at).format("DD-MM-YYYY")
        : "—",
    },
    { label: "ROUTE", value: route },
  ];

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!ticketNo.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Ticket No Required",
        text: "Please enter the ticket number before saving.",
        confirmButtonColor: "#0F1B47",
      });
      return;
    }

    if (!issueId) {
      Swal.fire({
        icon: "error",
        title: "Issue Request Not Found",
        text: "No matching issue request was found for this booking.",
        confirmButtonColor: "#0F1B47",
      });
      return;
    }

    setIsSaving(true);
    const res = await approveTicketIssueAction(issueId, {
      ticket_numbers: [ticketNo.trim()],
      ...(grossAmount.trim() ? { gross_amount: Number(grossAmount) } : {}),
      ...(netAmount.trim() ? { net_amount: Number(netAmount) } : {}),
    });
    setIsSaving(false);

    if (res.success) {
      Swal.fire(
        "Booking Updated",
        res.message || "Ticket issued successfully.",
        "success",
      );
      onClose();
      onSaved();
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed to Update",
        text: res.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#0F1B47",
      });
    }
  };

  return (
    <Modal
      title={`Edit Booking - ${booking.booking_reference}`}
      open={open}
      onCancel={() => {
        if (!isSaving) onClose();
      }}
      onOk={handleSave}
      okText="Save"
      cancelText="Cancel"
      confirmLoading={isSaving}
      destroyOnHidden
    >
      <div className="mt-4">
        <div className="divide-y divide-gray-100 rounded-md border border-gray-200">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 px-3 py-2"
            >
              <span className="w-32 shrink-0 text-xs font-semibold uppercase tracking-wide text-gray-400">
                {row.label}
              </span>
              <span className="text-sm font-medium text-gray-900">
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Ticket No <span className="text-red-500">*</span>
            </span>
            <Input
              value={ticketNo}
              placeholder="Enter ticket number"
              onChange={(e) => setTicketNo(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Gross Amount
            </span>
            <Input
              value={grossAmount}
              placeholder="Gross amount"
              onChange={(e) => setGrossAmount(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Net Amount
            </span>
            <Input
              value={netAmount}
              placeholder="Net amount"
              onChange={(e) => setNetAmount(e.target.value)}
            />
          </label>
        </div>
      </div>
    </Modal>
  );
}

export default function BookingsTable({
  status,
  title,
  bookingSource,
  dateColumn = "created_at",
  applyDate = false,
  refundAmount = false,
  admin = false,
}: BookingsTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBooking, setEditingBooking] = useState<BookingItem | null>(
    null,
  );
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queryClient = useQueryClient();

  const { data: issueRequests } = useQuery({
    queryKey: ["ticket-issue-requests", "BookingsTable", status],
    queryFn: () =>
      getTicketIssueRequestsAction({
        limit: 1000,
        status: Array.isArray(status) ? status.join(",") : status,
      }),
    enabled: admin,
  });

  const issueIdByBooking = useMemo(() => {
    const map = new Map<string, string>();
    (issueRequests?.data ?? []).forEach((r: TicketIssueRequest) => {
      if (r.booking_id) map.set(r.booking_id, r.id);
    });
    return map;
  }, [issueRequests]);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["b2b-bookings"] });
    queryClient.invalidateQueries({
      queryKey: ["ticket-issue-requests", "BookingsTable"],
    });
  }, [queryClient]);

  const handleCancelRefund = useCallback(
    async (row: BookingRow) => {
      const { value: reason, isConfirmed } = await Swal.fire({
        title: "Cancel / Refund Booking",
        text: `Reject issue request for booking (${row.bookingReference ?? ""})?`,
        icon: "warning",
        input: "textarea",
        inputPlaceholder: "Enter rejection / refund reason",
        inputValidator: (v) =>
          v?.trim() ? undefined : "A rejection reason is required",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Reject & Refund",
        cancelButtonText: "Keep Booking",
        reverseButtons: true,
      });

      if (!isConfirmed || !reason?.trim()) return;

      const issueId = issueIdByBooking.get(row.key);
      if (!issueId) {
        Swal.fire({
          icon: "error",
          title: "Issue Request Not Found",
          text: "No matching issue request was found for this booking.",
          confirmButtonColor: "#0F1B47",
        });
        return;
      }

      const res = await rejectTicketIssueAction(issueId, {
        reject_reason: reason.trim(),
      });

      if (res.success) {
        Swal.fire(
          "Booking Cancelled",
          res.message ||
            "The issue request has been rejected and refund initiated.",
          "success",
        );
        refresh();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Reject",
          text: res.message || "Something went wrong. Please try again.",
          confirmButtonColor: "#0F1B47",
        });
      }
    },
    [refresh, issueIdByBooking],
  );

  const { data, isPending: isLoading } = useQuery({
    queryKey: [
      "b2b-bookings",
      admin ? "admin" : "mine",
      status,
      bookingSource,
      page,
      pageSize,
      searchTerm,
    ],
    queryFn: async () => {
      const res = admin
        ? await getAdminBookingsAction({
            page,
            limit: pageSize,
            status: Array.isArray(status) ? status.join(",") : status,
            searchTerm,
            bookingSource: bookingSource ?? "B2B",
            sortBy: "created_at",
            sortOrder: "desc",
          })
        : await getBookingsAction({
            page,
            limit: pageSize,
            status,
            bookingSource,
            searchTerm,
            sortBy: "created_at",
            sortOrder: "desc",
          });
      return {
        rows: (res.data ?? []).map(mapBookingRow),
        total: res.meta?.total ?? res.data?.length ?? 0,
      };
    },
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  const handleSearch = (value: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearchTerm(value.trim());
      setPage(1);
    }, 400);
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
      ...(applyDate
        ? [
            {
              title: "Apply Date",
              dataIndex: "applyDate",
              width: 120,
              render: (v: string) => (
                <span className="inline-flex items-center gap-1.5 text-sm text-[#5B6B7A]">
                  <FiCalendar size={13} className="text-[#8FA9BE]" />
                  {v}
                </span>
              ),
            },
          ]
        : []),
      {
        title: dateColumn === "issued_at" ? "Issuing Date" : "Booking Date",
        dataIndex: "bookedOn",
        width: 130,
        render: (_: string, row: BookingRow) => (
          <span className="inline-flex items-center gap-1.5 text-sm text-[#5B6B7A]">
            <FiCalendar size={13} className="text-[#8FA9BE]" />
            {dateColumn === "issued_at" ? row.issuedOn : row.bookedOn}
          </span>
        ),
      },
      {
        title: "Booking Reference",
        dataIndex: "bookingReference",
        width: 170,
        render: (v: string) => (
          <span className="font-semibold text-[#0F1B47]">{v}</span>
        ),
      },
      {
        title: "Passenger",
        dataIndex: "passenger",
        width: 200,
        render: (v: string) => (
          <span className="text-sm text-[#5B6B7A]">{v}</span>
        ),
      },
      {
        title: "PNR",
        dataIndex: "pnr",
        width: 120,
        render: (v: string) => (
          <span className="font-mono text-sm font-semibold tracking-wide text-[#0F1B47]">
            {v}
          </span>
        ),
      },
      {
        title: "Travel Date",
        dataIndex: "travel_date",
        width: 130,
        render: (v: string) => (
          <span className="inline-flex items-center gap-1.5 text-sm text-[#5B6B7A]">
            <FiCalendar size={13} className="text-[#8FA9BE]" />
            {v}
          </span>
        ),
      },
      {
        title: "Route",
        dataIndex: "route",
        width: 160,
        render: (_: string, row: BookingRow) => (
          <RouteCell origin={row.origin} destination={row.destination} />
        ),
      },
      {
        title: "Airline",
        dataIndex: "airline",
        width: 120,
        render: (v: string, row: BookingRow) => (
          <div className="flex flex-col">
            <span className="font-semibold uppercase text-[#0F1B47]">
              {v}
            </span>
            <span className="text-xs text-[#8FA9BE]">{row.flightNumber}</span>
          </div>
        ),
      },
      {
        title: "Gross Amount",
        dataIndex: "grossAmount",
        width: 130,
        align: "right" as const,
        render: (v: number, row: BookingRow) => (
          <span className="font-semibold text-[#0F1B47]">
            {row.currency}
            {formatAmount(v)}
          </span>
        ),
      },
      {
        title: "Discount Amount",
        dataIndex: "discountAmount",
        width: 130,
        align: "right" as const,
        render: (v: number, row: BookingRow) => (
          <span className="font-semibold text-emerald-600">
            {row.currency}
            {formatAmount(v)}
          </span>
        ),
      },
      ...(refundAmount
        ? [
            {
              title: "Refund Amount",
              dataIndex: "refundAmount",
              width: 130,
              align: "right" as const,
              render: (v: number, row: BookingRow) => (
                <span className="font-semibold text-[#0F1B47]">
                  {row.currency}
                  {formatAmount(v)}
                </span>
              ),
            },
          ]
        : []),
      {
        title: "Status",
        dataIndex: "status",
        width: 110,
        render: (v: string) => <StatusBadge status={v} />,
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
        width: 180,
        render: (v: string) => (
          <span className="line-clamp-1 text-xs text-[#5B6B7A]" title={v}>
            {v}
          </span>
        ),
      },
      {
        title: "Action",
        dataIndex: "action",
        width: 120,
        align: "center" as const,
        render: (_: string, row: BookingRow) => (
          <div className="flex items-center justify-center gap-2">
            {row?.pnr && (
              <ActionButton
                viewLink={`/console/bookings/ticket/${encoding(row.key)}`}
              />
            )}
            <Tooltip title="Cancel / Refund" color="#000">
              <FiRotateCcw
                size={20}
                className="cursor-pointer text-amber-600 hover:text-amber-700"
                onClick={() => handleCancelRefund(row)}
              />
            </Tooltip>
            <Tooltip title="Edit" color="#000">
              <FiEdit2
                size={20}
                className="cursor-pointer text-blue-600 hover:text-blue-700"
                onClick={() => setEditingBooking(row.raw)}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [applyDate, dateColumn, refundAmount, handleCancelRefund],
  );

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 20);
  };

  return (
    <div className="">
      <Table
        title={title.toUpperCase()}
        hideSearch
        loading={isLoading}
        columns={columns}
        headerExtras={
          <Search
            placeholder="Search bookings.."
            allowClear
            size="large"
            className="w-72"
            prefix={<FiSearch className="text-gray-400" />}
            onSearch={(v) => handleSearch(v)}
            onChange={(e) => handleSearch(e.target.value)}
          />
        }
        emptyText={<EmptyState />}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
          showTotal: (t) => `${t} bookings`,
        }}
        dataSource={rows.map((data, i) => ({
          ...data,
          sl: (page - 1) * pageSize + i + 1,
        }))}
        rowKey="key"
        onChange={handleTableChange}
      />

      {editingBooking && (
        <BookingEditModal
          booking={editingBooking}
          issueId={issueIdByBooking.get(editingBooking.id)}
          open
          onClose={() => setEditingBooking(null)}
          onSaved={refresh}
        />
      )}
    </div>
  );
}