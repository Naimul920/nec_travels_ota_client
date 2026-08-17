"use client";

import React, { useMemo } from "react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useAdminBookings, useSearch } from "@/hooks";
import type { BookingItem } from "@/actions/booking.action";
import Table from "@/components/common/Table/Table";
import ActionButton from "@/components/common/Action/ActionButton";
import { encoding } from "@/utils";

interface AdminBookingsTableProps {
  status: string;
  title?: string;
}

const formatDate = (value?: string | null): string =>
  value ? dayjs(value).format("DD-MM-YYYY") : "—";

const STATUS_BADGE: Record<string, string> = {
  hold: "bg-sky-50 text-sky-700",
  pending: "bg-amber-50 text-amber-700",
  issued: "bg-emerald-50 text-emerald-700",
  confirmed: "bg-emerald-50 text-emerald-700",
  cancel: "bg-red-50 text-red-700",
  cancelled: "bg-red-50 text-red-700",
  void: "bg-gray-100 text-gray-700",
  voided: "bg-gray-100 text-gray-700",
  refunded: "bg-purple-50 text-purple-700",
};

function StatusBadge({ status }: { status: string }) {
  const key = (status ?? "").toLowerCase();
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        STATUS_BADGE[key] ?? "bg-gray-50 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

const mapBookingRow = (booking: BookingItem, index: number) => ({
  key: booking.id,
  sl: index + 1,
  bookingId: booking.booking_reference,
  booking_source: booking.booking_source,
  origin: booking.booking_segments?.[0]?.origin_airport_code ?? "—",
  destination: booking.booking_segments?.[0]?.destination_airport_code ?? "—",
  airline: booking.booking_segments?.[0]?.airline_code ?? "—",
  flightNumber: booking.booking_segments?.[0]?.flight_number ?? "—",
  pnr: booking.gds_pnr || booking.provider_booking_id || "—",
  passenger:
    booking.booking_passengers?.[0]
      ? `${booking.booking_passengers[0].first_name} ${booking.booking_passengers[0].last_name}`
      : "—",
  contactNo: booking.user?.phone || "—",
  email: booking.user?.email || "—",
  amount: Number(booking.booking_fare?.total_amount || booking.total_amount || 0),
  currency: booking.currency?.symbol ?? "৳",
  bookedOn: formatDate(booking.created_at),
  travel_date: formatDate(booking.booking_segments?.[0]?.departure_at),
  status: booking.status,
});

type BookingRow = ReturnType<typeof mapBookingRow>;

const AdminBookingsTable: React.FC<AdminBookingsTableProps> = ({
  status,
  title,
}) => {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  const { data, isLoading } = useAdminBookings({
    page: 1,
    limit: 10,
    sortBy: "created_at",
    sortOrder: "desc",
    status,
  });

  const rows = useMemo(
    () => (data?.data ?? []).map(mapBookingRow),
    [data?.data],
  );
  const filteredData = useSearch<BookingRow>(rows, searchString);

  const columns = useMemo(
    () => [
      { title: "SL", dataIndex: "sl", width: 60, align: "center" as const },
      { title: "Booking", dataIndex: "bookingId" },
      {
        title: "Route",
        dataIndex: "route",
        render: (_: string, row: BookingRow) =>
          `${row.origin} → ${row.destination}`,
      },
      {
        title: "Airline",
        dataIndex: "airline",
        render: (_: string, row: BookingRow) => (
          <span className="uppercase">
            {row.airline} {row.flightNumber}
          </span>
        ),
      },
      { title: "PNR", dataIndex: "pnr" },
      { title: "Passenger", dataIndex: "passenger" },
      { title: "Contact No", dataIndex: "contactNo" },
      {
        title: "Amount",
        dataIndex: "amount",
        render: (_: string, row: BookingRow) =>
          `${row.currency}${Number(row.amount || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      },
      { title: "Booked On", dataIndex: "bookedOn" },
      { title: "Source", dataIndex: "booking_source" },
      {
        title: "Status",
        dataIndex: "status",
        render: (v: string) => <StatusBadge status={v} />,
      },
      {
        title: "Action",
        dataIndex: "action",
        align: "center" as const,
        render: (_: string, row: BookingRow) => (
          <ActionButton viewLink={`/console/bookings/ticket/${encoding(row.key)}`} />
        ),
      },
    ],
    [],
  );

  return (
    <Table
      title={title ?? status}
      loading={isLoading}
      columns={columns}
      pagination={{ pageSize: 10 }}
      dataSource={filteredData ?? []}
      rowKey="key"
    />
  );
};

export default AdminBookingsTable;
