"use client"; // 1. Next.js 16 Client Component Boundary

import React from "react";
import { useSearch, useSEO } from "@/hooks";
import { useSearchParams } from "next/navigation";
import Table from "@/components/common/Table/Table";
import holdTicketsColumns from "@/helper/tableConstant/holdTickets.constant";

const CreditRequest: React.FC = () => {
  useSEO({
    title: "Credit Request",
  });
  // 3. Initialized Next.js search parameters query parser string
  const searchParams = useSearchParams();

  // 4. Passed computed parameter sequence cleanly down to your search handler hook
  const filteredData = useSearch(null, searchParams.toString());

  return (
    <>
      <Table
        title={"Credit Request"}
        columns={holdTicketsColumns}
        pagination={{ pageSize: 20 }}
        dataSource={filteredData?.map((data, i) => ({
          ...data,
          sl: i + 1,
        }))}
        rowKey="sl"
      />
    </>
  );
};

export default CreditRequest;
