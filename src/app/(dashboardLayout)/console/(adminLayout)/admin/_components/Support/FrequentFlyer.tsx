"use client";

import React from "react";
import Table from "@/components/common/Table/Table";
import holdTicketsColumns from "@/utils/tableConstant/holdTickets.constant";
import ActionButton from "@/components/common/Action/ActionButton";
import { useSearch } from "@/hooks";
import { useSearchParams } from "next/navigation";

const frequentFlyerData = [
  {
    key: 1,
    sl: 1,
    bookingId: "BK5001",
    origin: "DAC",
    destination: "DXB",
    airline: "Emirates",
    pnr: "PNR501",
    contactNo: "01750000001",
    amount: 95000,
    bookedOn: "01-12-2025",
    travel_date: "10-12-2025",
  },
];

const FrequentFlyer: React.FC = () => {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const filteredData = useSearch(frequentFlyerData, searchString);

  return (
    <Table
      title="Frequent Flyer Number Request"
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

export default FrequentFlyer;