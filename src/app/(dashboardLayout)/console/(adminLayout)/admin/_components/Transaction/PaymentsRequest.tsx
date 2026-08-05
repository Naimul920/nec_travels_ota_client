"use client";

import React from "react";
import Table from "@/components/common/Table/Table";
import holdTicketsColumns from "@/utils/tableConstant/holdTickets.constant";
import ActionButton from "@/components/common/Action/ActionButton";
import { useSearch } from "@/hooks";
import { useSearchParams } from "next/navigation";

const paymentsData = [
  {
    key: 1,
    sl: 1,
    bookingId: "BK6001",
    origin: "DAC",
    destination: "DXB",
    airline: "Emirates",
    pnr: "PNR601",
    contactNo: "01760000001",
    amount: 85000,
    bookedOn: "01-12-2025",
    travel_date: "10-12-2025",
  },
];

const PaymentsRequest: React.FC = () => {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const filteredData = useSearch(paymentsData, searchString);

  return (
    <Table
      title="Payments Request"
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

export default PaymentsRequest;