"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Table from "@/components/common/Table/Table";
import allUsersColumns from "@/utils/tableConstant/allUsers.constant";
import { useAllUsers, useSearch } from "@/hooks";

const AllUsers: React.FC = () => {
  const searchParams = useSearchParams();

  const { data, isLoading } = useAllUsers({ limit: 500 });
  const users = ((data?.data ?? []) as unknown) as Record<string, unknown>[];

  const filteredData = useSearch<Record<string, unknown>>(
    users,
    searchParams.toString(),
  );

  const dataSource = filteredData?.map((user, i) => ({
    ...user,
    sl: i + 1,
    full_name: (user as Record<string, any>).full_name,
  }));

  return (
    <Table
      title="All Users"
      loading={isLoading}
      columns={allUsersColumns}
      dataSource={dataSource ?? []}
      pagination={{ pageSize: 20, showSizeChanger: true }}
      rowKey="id"
    />
  );
};

export default AllUsers;