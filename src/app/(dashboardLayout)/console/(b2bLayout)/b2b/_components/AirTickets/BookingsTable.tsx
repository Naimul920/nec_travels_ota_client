"use client";

import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Input } from "antd";
import type { TablePaginationConfig } from "antd";
import Table from "@/components/common/Table/Table";
import ActionButton from "@/components/common/Action/ActionButton";
import { getBookingsAction, BookingItem } from "@/actions/booking.action";
import { encoding } from "@/utils";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiPauseCircle,
  FiXCircle,
  FiInbox,
  FiSearch,
} from "react-icons/fi";

const { Search } = Input;

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  hold: "bg-sky-50 text-sky-700",
  issued: "bg-emerald-50 text-emerald-700",
  cancel: "bg-red-50 text-red-700",
};

const STATUS_ICON: Record<string, typeof FiClock> = {
  pending: FiClock,
  hold: FiPauseCircle,
  issued: FiCheckCircle,
  cancel: FiXCircle,
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
  bookingReference: booking.booking_reference,
  bookedOn: formatDate(booking.created_at),
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
  currency: booking.currency?.symbol ?? "৳",
  travel_date: formatDate(booking.booking_segments?.[0]?.departure_at),
  status: booking.status.toLowerCase(),
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
  status: string;
  title: string;
  bookingSource?: string;
  dateColumn?: "created_at" | "issued_at";
}

export default function BookingsTable({
  status,
  title,
  bookingSource,
  dateColumn = "created_at",
}: BookingsTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ["b2b-bookings", status, bookingSource, page, pageSize, searchTerm],
    queryFn: async () => {
      const res = await getBookingsAction({
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
      {
        title: "Status",
        dataIndex: "status",
        width: 110,
        render: (v: string) => <StatusBadge status={v} />,
      },
      {
        title: "Action",
        dataIndex: "action",
        width: 60,
        align: "center" as const,
        render: (_: string, row: BookingRow) => (
          <div className="flex items-center justify-center gap-2">
            {row?.pnr && (
              <ActionButton
                viewLink={`/console/bookings/ticket/${encoding(row.key)}`}
              />
            )}
          </div>
        ),
      },
    ],
    [dateColumn],
  );

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 20);
  };

  return (
    <div className="">
      <Table
        title={title}
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
    </div>
  );
}