"use client";

import React from "react";
import Table from "@/components/common/Table/Table";
import holdTicketsColumns from "@/utils/tableConstant/holdTickets.constant";
import ActionButton from "@/components/common/Action/ActionButton";
import { useSearch } from "@/hooks";
import { useSearchParams } from "next/navigation";

const pendingData = [
  {
    key: 1,
    sl: 1,
    bookingId: "BK2001",
    origin: "DAC",
    destination: "DXB",
    airline: "Emirates",
    pnr: "PNR201",
    contactNo: "01720000001",
    amount: 90000,
    bookedOn: "10-12-2025",
    travel_date: "20-12-2025",
  },
  {
    key: 2,
    sl: 2,
    bookingId: "BK2002",
    origin: "DAC",
    destination: "KUL",
    airline: "Malaysia Airlines",
    pnr: "PNR202",
    contactNo: "01820000002",
    amount: 48000,
    bookedOn: "11-12-2025",
    travel_date: "21-12-2025",
  },
];

const PendingOrder: React.FC = () => {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const filteredData = useSearch(pendingData, searchString);

  return (
    <Table
      title="Pending Order / Ordered Queue"
      columns={holdTicketsColumns}
      pagination={{ pageSize: 20 }}
      dataSource={filteredData?.map((data, i) => ({
        ...data,
        sl: i + 1,
        action: (
          <div className="flex items-center justify-center">
            {data?.pnr && (
              <ActionButton viewLink={`/admin/user-details?pnr=${data.pnr}`} />
            )}
          </div>
        ),
      }))}
      rowKey="sl"
    />
  );
};

export default PendingOrder;