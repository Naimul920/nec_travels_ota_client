"use client";

import React from "react";
import Table from "@/components/common/Table/Table";
import holdTicketsColumns from "@/utils/tableConstant/holdTickets.constant";
import { useSearch } from "@/hooks";
import { useSearchParams } from "next/navigation";

const admData = [
  {
    key: 1,
    sl: 1,
    bookingId: "BK7001",
    origin: "DAC",
    destination: "DXB",
    airline: "Emirates",
    pnr: "PNR701",
    contactNo: "01770000001",
    amount: 52000,
    bookedOn: "01-12-2025",
    travel_date: "10-12-2025",
  },
];

const Adm: React.FC = () => {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const filteredData = useSearch(admData, searchString);

  return (
    <Table
      title="ADM"
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

export default Adm;