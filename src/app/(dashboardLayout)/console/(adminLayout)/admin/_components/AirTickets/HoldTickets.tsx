"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSearch, useIssueTickets } from "@/hooks";
import type { IssueTicketItem } from "@/actions/issueTicket.action";
import Table from "@/components/common/Table/Table";
import holdTicketsColumns from "@/utils/tableConstant/holdTickets.constant";
import ActionButton from "@/components/common/Action/ActionButton";

const HoldTickets: React.FC = () => {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  const { data, isLoading } = useIssueTickets({
    page: 1,
    limit: 100,
    sortBy: "created_at",
  });

  const mappedData = useMemo(() => {
    return (data?.data ?? []).map((item: IssueTicketItem, i: number) => ({
      key: item.id ?? i,
      sl: i + 1,
      bookingId: item.booking_reference ?? item.booking_id ?? item.pnr ?? "-",
      origin: item.origin ?? "",
      destination: item.destination ?? "",
      airline: item.airline ?? "",
      pnr: item.gds_pnr ?? item.pnr ?? "",
      contactNo: item.contact_no ?? item.contactNo ?? "",
      amount: item.total_amount ?? item.amount ?? "",
      bookedOn: formatDate(item.created_at ?? item.booked_on ?? item.bookedOn),
      travel_date: formatDate(item.travel_date),
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

const TicketDetails: React.FC<{ item: IssueTicketItem }> = ({ item }) => {
  const fields = [
    ["Booking Reference", str(item.booking_reference ?? item.booking_id)],
    ["Status", str(item.status)],
    ["PNR", str(item.gds_pnr ?? item.pnr)],
    ["Airline", str(item.airline)],
    ["Origin", str(item.origin)],
    ["Destination", str(item.destination)],
    ["Contact No", str(item.contact_no ?? item.contactNo)],
    ["Amount", str(item.total_amount ?? item.amount)],
    ["Booked On", formatDate(item.created_at ?? item.booked_on ?? item.bookedOn)],
    ["Travel Date", formatDate(item.travel_date)],
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