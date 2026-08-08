"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSearch, useHoldPassengers } from "@/hooks";
import type { SavedPassenger } from "@/actions/booking.action";
import Table from "@/components/common/Table/Table";
import holdTicketsColumns from "@/utils/tableConstant/holdTickets.constant";
import ActionButton from "@/components/common/Action/ActionButton";

const HoldTickets: React.FC = () => {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  const { data, isLoading } = useHoldPassengers({
    page: 1,
    limit: 100,
    sortBy: "created_at",
    sortOrder: "desc",
    status: "HOLD",
    booking_source: "B2B",
  });

  const mappedData = useMemo(() => {
    return (data?.data ?? []).map((item: SavedPassenger, i: number) => ({
      key: item.id ?? i,
      sl: i + 1,
      passenger: formatName(item),
      pnr: item.passport_number ?? "-",
      gender: item.gender ?? "-",
      nationality: item.nationality ?? "-",
      email: item.email ?? "-",
      contactNo: item.phone ?? "-",
      bookedOn: formatDate(item.created_at),
      _raw: item,
    }));
  }, [data]);

  const filteredData = useSearch(mappedData, searchString);

  return (
    <Table
      title="Hold Tickets"
      loading={isLoading}
      columns={holdTicketsColumns}
      pagination={{ pageSize: 20 }}
      dataSource={(filteredData?.map((data) => ({
        ...data,
        action: (
          <div className="flex items-center justify-center">
            <ActionButton
              viewContent={<TicketDetails item={data._raw} />}
            />
          </div>
        ),
      })) ?? [])}
      rowKey="key"
    />
  );
};

const TicketDetails: React.FC<{ item: SavedPassenger }> = ({ item }) => {
  const fields = [
    ["Passenger", formatName(item)],
    ["Passenger Type", str(item.passenger_type)],
    ["Gender", str(item.gender)],
    ["DOB", formatDate(item.dob)],
    ["Nationality", str(item.nationality)],
    ["Passport No", str(item.passport_number)],
    ["Passport Expiry", formatDate(item.passport_expiry)],
    ["Email", str(item.email)],
    ["Phone", str(item.phone)],
    ["Booked On", formatDate(item.created_at)],
  ];

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
      {fields.map(([label, value]) => (
        <div
          key={label}
          className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2"
        >
          <span className="text-sm font-medium text-gray-500">{label}</span>
          <span className="text-sm font-semibold text-gray-900">
            {value || "-"}
          </span>
        </div>
      ))}
    </div>
  );
};

const formatName = (item: SavedPassenger): string =>
  [item.title, item.first_name, item.last_name].filter(Boolean).join(" ") || "-";

const formatDate = (value?: string): string => {
  if (!value) return "-";
  const [date] = value.split("T");
  return date || "-";
};

const str = (value: unknown): string => {
  if (value == null) return "-";
  return String(value);
};

export default HoldTickets;