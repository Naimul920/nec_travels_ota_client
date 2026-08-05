"use client";

import React from "react";
import Table from "@/components/common/Table/Table";
import holdTicketsColumns from "@/utils/tableConstant/holdTickets.constant";
import { useSearch } from "@/hooks";
import { useSearchParams } from "next/navigation";

const salesStatementData = [
  {
    key: 1,
    sl: 1,
    bookingId: "BK8001",
    origin: "DAC",
    destination: "DXB",
    airline: "Emirates",
    pnr: "PNR801",
    contactNo: "01780000001",
    amount: 85000,
    bookedOn: "01-12-2025",
    travel_date: "10-12-2025",
  },
];

const SalesStatement: React.FC = () => {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const filteredData = useSearch(salesStatementData, searchString);

  return (
    <Table
      title="Sales Statement"
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

export default SalesStatement;