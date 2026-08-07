"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  App,
  Button,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table as AntTable,
  Tag,
  type TableProps,
} from "antd";

import {
  getAllUsersAction,
  reviewB2BUserAction,
  type AllUsersResponse,
  type ApproveB2BUserPayload,
} from "@/actions/user.action";
import { getCurrenciesAction } from "@/actions/currency.action";
import { getPackagesAction } from "@/actions/commission.action";
import type { AdminUser } from "@/types/user.type";
import { ROLE } from "@/constant/enum/role";

const STATUS_TAG_COLOR: Record<string, string> = {
  PENDING: "gold",
  APPROVED: "green",
  ACCEPTED: "green",
  REJECTED: "red",
  SUSPENDED: "orange",
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleString() : "-";

const getDisplayName = (user: AdminUser) =>
  user.profile?.full_name ||
  [user.profile?.first_name, user.profile?.last_name]
    .filter(Boolean)
    .join(" ") ||
  user.email;

const EMPTY_APPROVE_FORM: ApproveB2BUserPayload = {
  package_id: "",
  currency_Id: "",
  credit_limit: 0,
};

export default function ApprovalsPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [approvingUser, setApprovingUser] = useState<AdminUser | null>(null);
  const [approving, setApproving] = useState(false);
  const [approveForm, setApproveForm] = useState<ApproveB2BUserPayload>(
    EMPTY_APPROVE_FORM,
  );

  const { data, isPending } = useQuery<AllUsersResponse>({
    queryKey: ["allUsers", { status: "PENDING", role: ROLE.B2B, page, limit }],
    queryFn: () =>
      getAllUsersAction({ status: "PENDING", role: ROLE.B2B, page, limit }),
  });

  const { data: currencies = [] } = useQuery({
    queryKey: ["currencies"],
    queryFn: getCurrenciesAction,
    staleTime: 5 * 60 * 1000,
  });

  const { data: packages = [] } = useQuery({
    queryKey: ["packages"],
    queryFn: getPackagesAction,
    staleTime: 5 * 60 * 1000,
  });

  const closeApprove = () => {
    setApprovingUser(null);
    setApproveForm(EMPTY_APPROVE_FORM);
  };

  const runReview = async (
    user: AdminUser,
    action: "reject" | "suspend",
  ) => {
    setReviewingId(user.id);
    const result = await reviewB2BUserAction(user.id, action);
    setReviewingId(null);
    if (result.success) {
      message.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    } else {
      message.error(result.message);
    }
  };

  const handleApprove = () => {
    if (!approvingUser) return;
    if (!approveForm.package_id || !approveForm.currency_Id) {
      message.error("Please select a package and currency");
      return;
    }
    setApproving(true);
    reviewB2BUserAction(approvingUser.id, "approve", approveForm).then(
      (result) => {
        setApproving(false);
        if (result.success) {
          message.success(result.message);
          queryClient.invalidateQueries({ queryKey: ["allUsers"] });
          closeApprove();
        } else {
          message.error(result.message);
        }
      },
    );
  };

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
      render: (_, user) => getDisplayName(user),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Email Verified",
      key: "email_verified",
      render: (_, r) => (r.email_verified ? "Yes" : "No"),
    },
    {
      title: "Submitted",
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
    {
      title: "Actions",
      key: "actions",
      width: 260,
      render: (_, r) => (
        <Space size={4}>
          <Button
            type="primary"
            size="small"
            onClick={() => setApprovingUser(r)}
          >
            Approve
          </Button>
          <Popconfirm
            title="Reject this user?"
            onConfirm={() => runReview(r, "reject")}
          >
            <Button danger size="small" loading={reviewingId === r.id}>
              Reject
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Suspend this user?"
            onConfirm={() => runReview(r, "suspend")}
          >
            <Button danger size="small" loading={reviewingId === r.id}>
              Suspend
            </Button>
          </Popconfirm>
        </Space>
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
        locale={{ emptyText: "No pending approvals." }}
      />

      <Modal
        title={`Approve ${approvingUser ? getDisplayName(approvingUser) : ""}`}
        open={Boolean(approvingUser)}
        onCancel={closeApprove}
        onOk={handleApprove}
        confirmLoading={approving}
        okText="Approve"
        destroyOnHidden
      >
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Package <span className="ml-0.5 text-red-500">*</span>
            </label>
            <Select
              className="w-full"
              placeholder="Select package"
              value={approveForm.package_id || undefined}
              options={packages.map((p) => ({
                label: p.package_name,
                value: p.id,
              }))}
              onChange={(v) =>
                setApproveForm((f) => ({ ...f, package_id: v }))
              }
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Currency <span className="ml-0.5 text-red-500">*</span>
            </label>
            <Select
              className="w-full"
              placeholder="Select currency"
              value={approveForm.currency_Id || undefined}
              options={currencies.map((c) => ({
                label: `${c.name} (${c.code})`,
                value: c.id,
              }))}
              onChange={(v) =>
                setApproveForm((f) => ({ ...f, currency_Id: v }))
              }
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Credit Limit
            </label>
            <InputNumber
              className="w-full"
              min={0}
              placeholder="Enter credit limit"
              value={approveForm.credit_limit}
              onChange={(v) =>
                setApproveForm((f) => ({ ...f, credit_limit: v ?? 0 }))
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}