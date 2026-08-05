"use client";

import React from "react";
import Table from "@/components/common/Table/Table";
import holdTicketsColumns from "@/utils/tableConstant/holdTickets.constant";
import { useSearch } from "@/hooks";
import { useSearchParams } from "next/navigation";

const agentStatementData = [
  {
    key: 1,
    sl: 1,
    bookingId: "BK9001",
    origin: "DAC",
    destination: "DXB",
    airline: "Emirates",
    pnr: "PNR901",
    contactNo: "01790000001",
    amount: 85000,
    bookedOn: "01-12-2025",
    travel_date: "10-12-2025",
  },
];

const AgentStatement: React.FC = () => {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const filteredData = useSearch(agentStatementData, searchString);

  return (
    <Table
      title="Agent Statement"
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

export default AgentStatement;