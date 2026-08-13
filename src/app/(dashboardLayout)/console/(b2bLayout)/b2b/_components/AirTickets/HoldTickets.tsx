"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useSearch } from "@/hooks";
import Table from "@/components/common/Table/Table";
import ActionButton from "@/components/common/Action/ActionButton";
import { getBookingsAction, BookingItem } from "@/actions/booking.action";
import { encoding } from "@/utils";
import {
  FiMapPin,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiPauseCircle,
  FiXCircle,
  FiInbox,
} from "react-icons/fi";

type TabKey = "all" | "pending" | "cancel" | "hold" | "issued";
type ProductType = "Flight" | "Hotel" | "Tour" | "Gift Card";

const tabs: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "hold", label: "Hold" },
  { key: "issued", label: "Issued" },
  { key: "cancel", label: "Cancel" },
];

const productTypes: ProductType[] = ["Flight", "Hotel", "Tour", "Gift Card"];
const years = ["2026", "2025", "2024", "2023", "2022"];

const STATUS_BADGE: Record<string, string> = {
  all: "bg-[#F3F5F7] text-[#5B6B7A]",
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

const mapBookingRow = (booking: BookingItem, index: number) => ({
  key: booking.id,
  sl: index + 1,
  bookingId: booking.booking_reference,
  origin: booking.booking_segments?.[0]?.origin_airport_code ?? "—",
  destination: booking.booking_segments?.[0]?.destination_airport_code ?? "—",
  airline: booking.booking_segments?.[0]?.airline_code ?? "—",
  flightNumber: booking.booking_segments?.[0]?.flight_number ?? "—",
  pnr: booking.gds_pnr || booking.provider_booking_id || "—",
  contactNo: "—",
  amount: Number(booking.booking_fare?.total_amount || 0),
  currency: booking.currency?.symbol ?? "৳",
  bookedOn: formatDate(booking.created_at),
  travel_date: formatDate(booking.booking_segments?.[0]?.departure_at),
  status: booking.status.toLowerCase(),
  productType: "Flight" as ProductType,
  raw: booking,
});

type BookingRow = ReturnType<typeof mapBookingRow>;

const statusTitleMap: Record<TabKey, string> = {
  all: "All Bookings",
  pending: "Pending Bookings",
  cancel: "Cancelled Bookings",
  hold: "Hold Bookings",
  issued: "Issued Bookings",
};

const statusCount = (rows: BookingRow[], tab: TabKey) =>
  tab === "all"
    ? rows.length
    : rows.filter((b) => b.status === tab).length;

function StatusBadge({ status }: { status: string }) {
  const Icon = STATUS_ICON[status] ?? FiClock;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        STATUS_BADGE[status] ?? STATUS_BADGE.pending
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
      <span className="flex items-center gap-1 text-[#8FA9BE]">
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
      <h3 className="text-xl font-bold text-[#0F1B47]">No bookings yet</h3>
      <p className="max-w-sm text-sm text-[#6B7785]">
        Start your travel planning for your next adventure today
      </p>
      <button
        type="button"
        className="mt-2 rounded-xl bg-[#F5C518] px-8 py-3 text-sm font-bold text-[#0F1B47] transition-opacity hover:opacity-90"
      >
        Search
      </button>
    </div>
  );
}

function FilterCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-[#5B6B7A] transition-colors hover:bg-[#F7F4EC]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-[#C7CED6] text-[#0F1B47] focus:ring-[#0F1B47]"
      />
      {label}
    </label>
  );
}

export default function HoldTickets() {
  const [activeTab, setActiveTab] = useState<TabKey>("hold");
  const [selectedProductTypes, setSelectedProductTypes] = useState<
    ProductType[]
  >([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  const { data: bookingsData, isPending: isLoading } = useQuery({
    queryKey: ["b2b-bookings"],
    queryFn: async () => {
      const res = await getBookingsAction();
      return (res.data ?? []).map(mapBookingRow);
    },
  });

  const toggleFilter = <T,>(value: T, list: T[], setList: (v: T[]) => void) => {
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );
  };

  const resetFilters = () => {
    setSelectedProductTypes([]);
    setSelectedYears([]);
  };

  const filteredByStatus = useMemo(() => {
    const allData = bookingsData ?? [];
    let data =
      activeTab === "all"
        ? allData
        : allData.filter((b) => b.status === activeTab);

    if (selectedProductTypes.length) {
      data = data.filter((b) => selectedProductTypes.includes(b.productType));
    }
    if (selectedYears.length) {
      data = data.filter((b) =>
        selectedYears.some((y) => b.travel_date.endsWith(y)),
      );
    }
    return data;
  }, [bookingsData, activeTab, selectedProductTypes, selectedYears]);

  const filteredData = useSearch(filteredByStatus, searchString);
  const hasResults = !!filteredData?.length;
  const total = bookingsData?.length ?? 0;

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
        align: "center" as const,
        render: (_: string, row: BookingRow) => (
          <div className="flex items-center justify-center">
            {row?.pnr && (
              <ActionButton
                viewLink={`/console/bookings/ticket/${encoding(row.key)}`}
              />
            )}
          </div>
        ),
      },
    ],
    [activeTab],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-5 py-16 sm:px-10">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1B47] md:text-3xl">
            My Bookings
          </h1>
          <p className="mt-1 text-sm text-[#6B7785]">
            Track and manage all your travel reservations in one place.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-[#12233D]/10 bg-white px-4 py-2.5 text-sm text-[#5B6B7A]">
          <FiMapPin className="text-[#F5C518]" size={16} />
          <span className="font-medium text-[#0F1B47]">{total}</span> bookings
          found
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {tabs.map(({ key, label }) => {
          const active = activeTab === key;
          const count = statusCount(bookingsData ?? [], key);
          const Icon =
            key === "all" ? FiInbox : (STATUS_ICON[key] ?? FiClock);
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`group flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                active
                  ? "border-[#0F1B47] bg-[#0F1B47] text-white shadow-lg shadow-[#0F1B47]/10"
                  : "border-[#12233D]/10 bg-white text-[#0F1B47] hover:-translate-y-0.5 hover:border-[#0F1B47]/30 hover:shadow-md"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-base ${
                  active
                    ? "bg-white/15 text-[#F5C518]"
                    : "bg-[#F7F4EC] text-[#0F1B47]"
                }`}
              >
                <Icon size={17} />
              </span>
              <span className="text-sm font-medium opacity-80">{label}</span>
              <span className="text-2xl font-bold leading-none">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className="h-fit rounded-2xl border border-[#12233D]/10 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0F1B47]">Filters</h2>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-medium text-[#9AA5B1] transition-colors hover:text-[#5B6B7A]"
            >
              Reset
            </button>
          </div>

          <div className="mb-4 border-t border-[#12233D]/10" />

          <div className="mb-5">
            <h3 className="mb-2 text-sm font-bold text-[#0F1B47]">
              Product Type
            </h3>
            <div className="space-y-0.5">
              {productTypes.map((type) => (
                <FilterCheckbox
                  key={type}
                  label={type}
                  checked={selectedProductTypes.includes(type)}
                  onChange={() =>
                    toggleFilter(
                      type,
                      selectedProductTypes,
                      setSelectedProductTypes,
                    )
                  }
                />
              ))}
            </div>
          </div>

          <div className="mb-5 border-t border-[#12233D]/10" />

          <div>
            <h3 className="mb-2 text-sm font-bold text-[#0F1B47]">Year</h3>
            <div className="space-y-0.5">
              {years.map((year) => (
                <FilterCheckbox
                  key={year}
                  label={year}
                  checked={selectedYears.includes(year)}
                  onChange={() =>
                    toggleFilter(year, selectedYears, setSelectedYears)
                  }
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Table */}
        <div>
          {isLoading ? (
            <div className="flex justify-center rounded-2xl border border-[#12233D]/10 bg-white py-24">
              <div className="animate-spin h-8 w-8 rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : hasResults ? (
            <Table
              title={statusTitleMap[activeTab]}
              columns={columns}
              pagination={{ pageSize: 20 }}
              dataSource={filteredData?.map((data, i) => ({
                ...data,
                sl: i + 1,
              }))}
              rowKey="key"
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}