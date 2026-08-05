"use client";

import React from "react";
import Table from "@/components/common/Table/Table";
import holdTicketsColumns from "@/utils/tableConstant/holdTickets.constant";
import { useSearch } from "@/hooks";
import { useSearchParams } from "next/navigation";

interface SsrPaymentsProps {
  title: string;
}

const SsrPayments: React.FC<SsrPaymentsProps> = ({ title }) => {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const filteredData = useSearch(null, searchString);

  return (
    <Table
      title={title}
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

export default SsrPayments;