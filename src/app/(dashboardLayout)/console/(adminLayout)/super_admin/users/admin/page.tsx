"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table as AntTable, Tag, type TableProps } from "antd";

import {
  getAllUsersAction,
  type AllUsersResponse,
} from "@/actions/user.action";
import type { AdminUser } from "@/types/user.type";
import { ROLE } from "@/constant/enum/role";

const STATUS_TAG_COLOR: Record<string, string> = {
  ACTIVE: "green",
  PENDING: "gold",
  APPROVED: "green",
  ACCEPTED: "green",
  REJECTED: "red",
  SUSPENDED: "orange",
  INACTIVE: "red",
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleString() : "-";

export default function AdminUserPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isPending } = useQuery<AllUsersResponse>({
    queryKey: ["allUsers", { role: ROLE.ADMIN, page, limit }],
    queryFn: () => getAllUsersAction({ role: ROLE.ADMIN, page, limit }),
  });

  const columns: TableProps<AdminUser>["columns"] = [
    {
      title: "SL",
      key: "sl",
      width: 70,
      render: (_, __, index) => (page - 1) * limit + index + 1,
    },
    {
      title: "Name",
      key: "name",
      render: (_, u) =>
        u.profile?.full_name ||
        [u.profile?.first_name, u.profile?.last_name]
          .filter(Boolean)
          .join(" ") ||
        u.email,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Email Verified",
      key: "email_verified",
      render: (_, r) => (r.email_verified ? "Yes" : "No"),
    },
    {
      title: "Created",
      key: "created_at",
      render: (_, r) => formatDate(r.created_at),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => (
        <Tag color={STATUS_TAG_COLOR[value?.toUpperCase()] ?? "default"}>
          {value}
        </Tag>
      ),
    },
  ];

  return (
    <div className="p-3 md:p-0 md:pt-2">
      <AntTable<AdminUser>
        className="custom-table"
        rowKey="id"
        loading={isPending}
        columns={columns}
        dataSource={data?.data ?? []}
        pagination={{
          current: data?.meta?.page ?? page,
          pageSize: data?.meta?.limit ?? limit,
          total: data?.meta?.total ?? 0,
          onChange: (p) => setPage(p),
          showSizeChanger: false,
        }}
        locale={{ emptyText: "No admin users found." }}
      />
    </div>
  );
}