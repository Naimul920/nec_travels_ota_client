"use client";

import React from "react";
import Table from "@/components/common/Table/Table";
import holdTicketsColumns from "@/utils/tableConstant/holdTickets.constant";
import { useSearch } from "@/hooks";
import { useSearchParams } from "next/navigation";

const flownData = [
  {
    key: 1,
    sl: 1,
    bookingId: "BK3001",
    origin: "DAC",
    destination: "LHR",
    airline: "Biman Bangladesh",
    pnr: "PNR301",
    contactNo: "01730000001",
    amount: 120000,
    bookedOn: "01-11-2025",
    travel_date: "15-11-2025",
  },
];

const FlownTickets: React.FC = () => {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const filteredData = useSearch(flownData, searchString);

  return (
    <Table
      title="Flown Tickets list"
      columns={holdTicketsColumns}
      pagination={{ pageSize: 20 }}
      dataSource={filteredData?.map((data, i) => ({
        ...data,
        sl: i + 1,
      }))}
      rowKey="sl"
    />
  );
};

export default FlownTickets;