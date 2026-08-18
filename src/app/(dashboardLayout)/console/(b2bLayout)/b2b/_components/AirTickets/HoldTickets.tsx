"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Tooltip } from "antd";
import Swal from "sweetalert2";
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
} from "react-icons/fi";

type ProductType = "Flight";

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  hold: "bg-sky-50 text-sky-700",
  issued: "bg-emerald-50 text-emerald-700",
  cancel: "bg-red-50 text-red-700",
  issue_pending: "bg-violet-50 text-violet-700",
};

const STATUS_ICON: Record<string, typeof FiClock> = {
  pending: FiClock,
  hold: FiPauseCircle,
  issued: FiCheckCircle,
  cancel: FiXCircle,
  issue_pending: FiClock,
};

const formatDate = (value?: string | null): string =>
  value ? dayjs(value).format("DD-MM-YYYY") : "—";

const mapBookingRow = (booking: BookingItem, index: number) => ({
  key: booking.id,
  sl: index + 1,
  bookingId: booking.booking_reference,
  origin: booking.booking_segments?.[0]?.origin_airport_code ?? "—",
  destination: booking.booking_segments?.[0]?.destination_airport_code ?? "—",
  airline: booking.booking_segments?.[0]?.airline_code ?? "—",
  flightNumber: booking.booking_segments?.[0]?.flight_number ?? "—",
  pnr: booking.gds_pnr || booking.provider_booking_id || "—",
  amount: Number(booking.booking_fare?.total_amount || 0),
  currency: booking.currency?.symbol ?? "৳",
  bookedOn: formatDate(booking.created_at),
  travel_date: formatDate(booking.booking_segments?.[0]?.departure_at),
  status: booking.status.toLowerCase(),
  productType: "Flight" as ProductType,
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

function BookingCell({
  bookingId,
  bookedOn,
}: {
  bookingId: string;
  bookedOn: string;
}) {
  return (
    <div className="flex flex-col">
      <span className="font-semibold text-[#0F1B47]">{bookingId}</span>
      <span className="flex items-center gap-1 text-xs text-[#8FA9BE]">
        <FiCalendar size={11} />
        {bookedOn}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#12233D]/15 bg-white px-6 py-20 text-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#DCEBF9]">
        <FiInbox size={36} className="text-[#8FA9BE]" />
      </div>
      <h3 className="text-xl font-bold text-[#0F1B47]">No hold tickets yet</h3>
      <p className="max-w-sm text-sm text-[#6B7785]">
        Your hold tickets will appear here once you place them.
      </p>
    </div>
  );
}

export default function HoldTickets() {
  const { data: bookingsData, isPending: isLoading } = useQuery({
    queryKey: ["b2b-hold-tickets"],
    queryFn: async () => {
      const res = await getBookingsAction({
        status: ["HOLD", "ISSUE_PENDING"],
      });
      return (res.data ?? []).map(mapBookingRow);
    },
  });

  const handleIssueBooking = (row: BookingRow) => {
    Swal.fire({
      title: "Confirm Issuing Ticket",
      text: `Are you sure you want to issue this ticket (${row.bookingId})?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0F1B47",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Issue",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Ticket Issued",
          `Ticket ${row.bookingId} has been issued successfully.`,
          "success",
        );
      }
    });
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
        title: "Booking",
        dataIndex: "bookingId",
        width: 190,
        render: (_: string, row: BookingRow) => (
          <BookingCell bookingId={row.bookingId} bookedOn={row.bookedOn} />
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
        title: "Amount",
        dataIndex: "amount",
        width: 110,
        align: "right" as const,
        render: (v: number, row: BookingRow) => (
          <span className="font-semibold text-[#0F1B47]">
            {row.currency}
            {Number(v || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
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
        title: "Status",
        dataIndex: "status",
        width: 110,
        render: (v: string) => <StatusBadge status={v} />,
      },
      {
        title: "Action",
        dataIndex: "action",
        width: 110,
        align: "center" as const,
        render: (_: string, row: BookingRow) => (
          <div className="flex items-center justify-center gap-2">
            {row?.pnr && (
              <ActionButton
                viewLink={`/console/bookings/ticket/${encoding(row.key)}`}
              />
            )}
            <Tooltip title="Issue Ticket">
              <button
                type="button"
                onClick={() => handleIssueBooking(row)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-amber-50 text-amber-600 transition-colors hover:bg-amber-100"
                aria-label="Issue Ticket"
              >
                <FiCheckCircle size={18} />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-5 py-10 sm:px-10">
      <div>
        <h1 className="text-2xl font-bold text-[#0F1B47] md:text-3xl">
          Hold Tickets
        </h1>
        <p className="mt-1 text-sm text-[#6B7785]">
          View and issue your on-hold flight tickets.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center rounded-2xl border border-[#12233D]/10 bg-white py-24">
          <div className="animate-spin h-8 w-8 rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : bookingsData?.length ? (
        <Table
          title="Hold Tickets"
          columns={columns}
          pagination={{ pageSize: 20 }}
          dataSource={bookingsData?.map((data, i) => ({
            ...data,
            sl: i + 1,
          }))}
          rowKey="key"
        />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}