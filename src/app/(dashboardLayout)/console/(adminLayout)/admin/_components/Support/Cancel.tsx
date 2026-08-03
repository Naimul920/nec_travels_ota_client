"use client"; // 1. Next.js 16 Client Component Boundary

import React from "react";
// 2. Swapped React Router hook with Next.js App Router query utilities
import { useSearchParams } from "next/navigation";
import { useSearch } from "@/hooks";
import Table from "@/components/common/Table/Table";
import holdTicketsColumns from "@/utils/tableConstant/holdTickets.constant";

const Cancel: React.FC = () => {
  // 3. Initialized Next.js search parameters query parser hook
  const searchParams = useSearchParams();

  // 4. Passed computed parameter sequence cleanly down to your search handler hook
  const filteredData = useSearch(null, searchParams.toString());

  return (
    <>
      <Table
        title={"Cancel"}
        columns={holdTicketsColumns}
        pagination={{ pageSize: 20 }}
        dataSource={filteredData?.map((data, i) => ({
          ...data,
          sl: i + 1,
          action: (
            <div className="flex items-center justify-center">
              {/* {data?.pnr && <ActionButton viewLink="/admin/user-details" />} */}
            </div>
          ),
        }))}
        rowKey="sl"
      />
    </>
  );
};

export default Cancel;
