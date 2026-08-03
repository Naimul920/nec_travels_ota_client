"use client"; // 1. Next.js 16 Client Component Boundary

import React from "react";
import Table from "@/components/common/Table/Table";
import holdTicketsColumns from "@/utils/tableConstant/holdTickets.constant";
import ActionButton from "@/components/common/Action/ActionButton";
import { useSearch } from "@/hooks";
// 2. Swapped React Router hook with Next.js App Router query utilities
import { useSearchParams } from "next/navigation";

const holdTicketsData = [
  {
    key: 1,
    sl: 1,
    bookingId: "BK1001",
    origin: "DAC",
    destination: "DXB",
    airline: "Emirates",
    pnr: "PNR001",
    contactNo: "01711111111",
    amount: 85000,
    bookedOn: "01-12-2025",
    travel_date: "12-12-2025",
  },
  {
    key: 2,
    sl: 2,
    bookingId: "BK1002",
    origin: "DAC",
    destination: "KUL",
    airline: "Malaysia Airlines",
    pnr: "PNR002",
    contactNo: "01822222222",
    amount: 45000,
    bookedOn: "02-12-2025",
    travel_date: "13-12-2025",
  },
  {
    key: 3,
    sl: 3,
    bookingId: "BK1003",
    origin: "DAC",
    destination: "DEL",
    airline: "Indigo",
    pnr: "PNR003",
    contactNo: "01933333333",
    amount: 25000,
    bookedOn: "03-12-2025",
    travel_date: "12-12-2025",
  },
];

const CancelTickets: React.FC = () => {
  // 3. Initialized Next.js search parameters query parser string
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  // 4. Passed computed parameter sequence safely down to your search handler hook
  const filteredData = useSearch(holdTicketsData, searchString);

  return (
    <>
      <Table
        title={"Cancel Tickets"}
        columns={holdTicketsColumns}
        pagination={{ pageSize: 20 }}
        dataSource={filteredData?.map((data, i) => ({
          ...data,
          sl: i + 1,
          action: (
            <div className="flex items-center justify-center">
              {data?.pnr && <ActionButton viewLink="/admin/user-details" />}
            </div>
          ),
        }))}
        rowKey="sl"
      />
    </>
  );
};

export default CancelTickets;
