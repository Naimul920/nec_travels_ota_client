"use client";

import React from "react";
import Table from "@/components/common/Table/Table";
import holdTicketsColumns from "@/utils/tableConstant/holdTickets.constant";
import ActionButton from "@/components/common/Action/ActionButton";
import { useSearch } from "@/hooks";
import { useSearchParams } from "next/navigation";

const ticketCopyData = [
  {
    key: 1,
    sl: 1,
    bookingId: "BK4001",
    origin: "DAC",
    destination: "JED",
    airline: "Saudia",
    pnr: "PNR401",
    contactNo: "01740000001",
    amount: 110000,
    bookedOn: "01-12-2025",
    travel_date: "10-12-2025",
  },
];

const TicketCopy: React.FC = () => {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const filteredData = useSearch(ticketCopyData, searchString);

  return (
    <Table
      title="Airlines Ticket Copy Request"
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

export default TicketCopy;