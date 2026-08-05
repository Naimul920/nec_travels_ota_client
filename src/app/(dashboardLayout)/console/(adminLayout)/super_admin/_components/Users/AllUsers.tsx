"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "antd";
import Table from "@/components/common/Table/Table";
import allUsersColumns from "@/utils/tableConstant/allUsers.constant";
import { useAllUsers, useSearch } from "@/hooks";

const AllUsers: React.FC = () => {
  const searchParams = useSearchParams();

  const { data, isLoading, isError } = useAllUsers({ limit: 500 });
  const users = ((data?.data ?? []) as unknown) as Record<string, unknown>[];

  const filteredData = useSearch<Record<string, unknown>>(
    users,
    searchParams.toString(),
  );

  if (isLoading) {
    return (
      <div className="space-y-3 p-3 md:p-0 md:pt-2">
        <Skeleton active />
        <Skeleton active />
      </div>
    );
  }

  if (isError || users.length === 0) {
    return (
      <div className="p-3 md:p-0 md:pt-2">
        <Table
          title="All Users"
          columns={allUsersColumns}
          dataSource={[]}
          pagination={false}
          rowKey="id"
        />
      </div>
    );
  }

  const dataSource = filteredData?.map((user, i) => ({
    ...user,
    sl: i + 1,
    full_name: (user as Record<string, any>).full_name,
  }));

  return (
    <Table
      title="All Users"
      columns={allUsersColumns}
      dataSource={dataSource}
      pagination={{ pageSize: 20, showSizeChanger: true }}
      rowKey="id"
    />
  );
};

export default AllUsers;