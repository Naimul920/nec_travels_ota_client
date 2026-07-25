"use client"; // 1. Next.js 16 Client Component Boundary

import React from "react";
// 2. Swapped React Router hook with Next.js App Router query utilities
import { useSearchParams } from "next/navigation";
import { useSearch, useSEO } from "@/hooks";
import Table from "@/components/common/Table/Table";
import holdTicketsColumns from "@/helper/tableConstant/holdTickets.constant";
import ActionButton from "@/components/common/Action/ActionButton";

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

const HoldTickets: React.FC = () => {
  useSEO({
    title: "Hold Tickets",
  });

  // 3. Initialized Next.js search parameters query parser string
  const searchParams = useSearchParams();
  const searchString = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";

  // 4. Passed computed parameter sequence safely down to your search handler hook
  const filteredData = useSearch(holdTicketsData, searchString);

  const handleDelete = (id: string) => {
    console.log("deleted", id);
  };

  return (
    <>
      <Table
        title={"Hold Tickets"}
        columns={holdTicketsColumns}
        pagination={{ pageSize: 20 }}
        dataSource={filteredData?.map((data, i) => ({
          ...data,
          sl: i + 1,
          action: (
            <div className="flex items-center justify-center">
              {data?.pnr && (
                <ActionButton
                  // Pass modal content for view
                  viewContent={
                    <div>
                      <p>
                        <strong>PNR:</strong> {data.pnr}
                      </p>
                    </div>
                  }
                  // Pass modal content for edit
                  editContent={
                    <div>
                      <p>Edit PNR: {data.pnr}</p>
                    </div>
                  }
                  // Pass delete handler
                  handleDelete={() => handleDelete(data.pnr)}
                />
              )}
            </div>
          ),
        }))}
        rowKey="sl"
      />
    </>
  );
};

export default HoldTickets;
