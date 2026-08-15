"use client";

import React, { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input, Tooltip } from "antd";
import Swal from "sweetalert2";
import { FiSearch, FiEdit2, FiShield, FiTrash2 } from "react-icons/fi";
import { Table as AntTable, type TableProps } from "antd";
import {
  getAllUsersAction,
  type AllUsersResponse,
  changeUserStatusAction,
  deleteUserAction,
} from "@/actions/user.action";
import type { AdminUser } from "@/types/user.type";
import UserUpdateModal from "./UserUpdateModal";
import UserPasswordModal from "./UserPasswordModal";

const { Search } = Input;

function YesNoChip({ value, label }: { value: boolean; label: string }) {
  return (
    <span
      title={label}
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        value ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      {value ? "Yes" : "No"}
    </span>
  );
}

const formatDateTime = (value?: string | null) =>
  value ? new Date(value).toLocaleString() : "-";

const STATUS_ACTIONS: { status: string; action: string; label: string }[] = [
  { status: "ACTIVE", action: "suspend", label: "Suspend" },
  { status: "SUSPENDED", action: "activate", label: "Approve" },
  { status: "BLOCKED", action: "unblock", label: "Unblock" },
  { status: "INACTIVE", action: "activate", label: "Approve" },
  { status: "PENDING", action: "activate", label: "Approve" },
];

const AllUsers: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [passwordUser, setPasswordUser] = useState<AdminUser | null>(null);

  const { data, isPending } = useQuery<AllUsersResponse>({
    queryKey: ["allUsers", { page, limit, searchTerm }],
    queryFn: () =>
      getAllUsersAction({
        page,
        limit,
        searchTerm,
        sortBy: "created_at",
      }),
  });

  const handleSearch = (value: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearchTerm(value.trim());
      setPage(1);
    }, 400);
  };

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["allUsers"] });

  const handleStatusAction = async (
    user: AdminUser,
    action: string,
    label: string,
  ) => {
    const result = await Swal.fire({
      title: `Confirm ${label}`,
      text: `Are you sure you want to ${label.toLowerCase()} ${user.email}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0F1B47",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${label}`,
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;

    const res = await changeUserStatusAction(user.id, action as never);
    Swal.fire({
      icon: res.success ? "success" : "error",
      title: res.success ? "Success" : "Failed",
      text: res.message,
    });
    if (res.success) invalidate();
  };

  const handleDelete = async (user: AdminUser) => {
    const result = await Swal.fire({
      title: "Delete User?",
      text: `This will permanently delete ${user.email}. This cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;

    const res = await deleteUserAction(user.id);
    Swal.fire({
      icon: res.success ? "success" : "error",
      title: res.success ? "Deleted" : "Failed",
      text: res.message,
    });
    if (res.success) invalidate();
  };

  const actionOf = (status: string) =>
    STATUS_ACTIONS.find((s) => s.status === status.toUpperCase());

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
      width: 200,
      render: (_, u) => {
        const display =
          u.profile?.full_name ||
          [u.profile?.first_name, u.profile?.last_name]
            .filter(Boolean)
            .join(" ") ||
          u.email;
        const avatar = u.profile?.image_url;
        return (
          <div className="flex items-center gap-2.5">
            {avatar ? (
              <img
                src={avatar}
                alt={display}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold uppercase text-slate-500">
                {display.charAt(0)}
              </span>
            )}
            <span className="font-medium">{display}</span>
          </div>
        );
      },
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium uppercase text-slate-700">
          {role}
        </span>
      ),
    },
    {
      title: "Email Verified",
      dataIndex: "email_verified",
      key: "email_verified",
      render: (v: boolean | undefined) => (
        <YesNoChip value={!!v} label="Email Verified" />
      ),
    },
    {
      title: "Two-Step",
      dataIndex: "two_step_verified",
      key: "two_step_verified",
      render: (v: boolean | undefined) => (
        <YesNoChip value={!!v} label="Two-Step Verified" />
      ),
    },
    {
      title: "Password Change",
      dataIndex: "need_password_change",
      key: "need_password_change",
      render: (v: boolean | undefined) => (
        <YesNoChip value={!!v} label="Needs Password Change" />
      ),
    },
    {
      title: "Last Login",
      dataIndex: "last_login_at",
      key: "last_login_at",
      width: 180,
      render: (v: string | null) => (
        <span className="text-xs text-gray-600">{formatDateTime(v)}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
            status?.toUpperCase() === "ACTIVE"
              ? "bg-emerald-50 text-emerald-700"
              : status?.toUpperCase() === "SUSPENDED" ||
                  status?.toUpperCase() === "BLOCKED"
                ? "bg-red-50 text-red-700"
                : "bg-amber-50 text-amber-700"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 260,
      render: (_, user) => {
        const sa = actionOf(user.status);
        return (
          <div className="flex items-center gap-2">
            <Tooltip title="Edit User">
              <button
                type="button"
                onClick={() => setEditingUser(user)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
              >
                <FiEdit2 size={16} />
              </button>
            </Tooltip>
            <Tooltip title="Change Password">
              <button
                type="button"
                onClick={() => setPasswordUser(user)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors hover:bg-indigo-100"
              >
                <FiShield size={16} />
              </button>
            </Tooltip>
            {sa && (
              <button
                type="button"
                onClick={() => handleStatusAction(user, sa.action, sa.label)}
                className="cursor-pointer rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-100"
              >
                {sa.label}
              </button>
            )}
            <Tooltip title="Delete">
              <button
                type="button"
                onClick={() => handleDelete(user)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-50 text-red-600 transition-colors hover:bg-red-100"
              >
                <FiTrash2 size={16} />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const dataSource = data?.data;

  return (
    <div className="p-3 md:p-0 md:pt-2">
      <div className="mb-4 flex justify-end">
        <Search
          placeholder="Search users.."
          allowClear
          size="large"
          className="w-full max-w-72"
          prefix={<FiSearch className="text-gray-400" />}
          onSearch={(v) => handleSearch(v)}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <AntTable<AdminUser>
        className="custom-table"
        title={() => <div className="text-lg font-semibold">All Users</div>}
        rowKey="id"
        loading={isPending}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: "100%" }}
        pagination={{
          current: data?.meta?.page ?? page,
          pageSize: limit,
          total: data?.meta?.total ?? 0,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
          showTotal: (t) => `${t} users`,
          onChange: (p, ps) => {
            setPage(p);
            if (ps) setLimit(ps);
          },
        }}
        locale={{ emptyText: "No users found." }}
      />

      {editingUser && (
        <UserUpdateModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null);
            invalidate();
          }}
        />
      )}

      {passwordUser && (
        <UserPasswordModal
          user={passwordUser}
          onClose={() => setPasswordUser(null)}
          onSuccess={() => setPasswordUser(null)}
        />
      )}
    </div>
  );
};

export default AllUsers;