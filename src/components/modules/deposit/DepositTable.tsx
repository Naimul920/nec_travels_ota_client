"use client";

import React, { useCallback, useEffect, useState } from "react";
import { App, ConfigProvider, Table as AntTable, Skeleton, Tooltip, Button as AntButton, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CheckOutlined, CloseOutlined, StopOutlined } from "@ant-design/icons";
import TableHeader from "@/components/common/Table/TableHeader";
import {
  approveDepositAction,
  cancelDepositAction,
  getDepositsAction,
  rejectDepositAction,
} from "@/actions/deposit.action";
import type { DepositItem, DepositStatus } from "@/interface/deposit";

const formatDate = (v?: string) => (v ? new Date(v).toLocaleDateString() : "—");

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-200 text-gray-600",
};

const resolveAccountName = (r: DepositItem) =>
  r.bank?.bank_name || r.account?.bank_name || "";

const resolveAccountNumber = (r: DepositItem) =>
  r.bank?.account_number || r.account?.account_number || "";

const DepositTable: React.FC = () => {
  const { message } = App.useApp();
  const [data, setData] = useState<DepositItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await getDepositsAction({ page: 1, limit: 100 });
    setData(res.success ? res.data : []);
    if (!res.success && res.message) message.error(res.message);
    setLoading(false);
  }, [message]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAction = async (
    id: string,
    action: typeof approveDepositAction,
    successText: string,
  ) => {
    setActingId(id);
    const res = await action(id);
    setActingId(null);
    if (res.success) {
      message.success(res.message || successText);
      fetchData();
    } else {
      message.error(res.message || "Action failed");
    }
  };

  const columns: ColumnsType<DepositItem> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Method",
      dataIndex: "type",
      key: "type",
      render: (v: string) => v || "—",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (v: number) =>
        v != null ? <strong>{Number(v).toLocaleString()}</strong> : "—",
    },
    {
      title: "Bank / Account",
      key: "account",
      render: (_, r) => {
        const name = resolveAccountName(r);
        const number = resolveAccountNumber(r);
        if (!name && !number) return "—";
        return (
          <div className="text-sm">
            <div className="font-medium">{name || "—"}</div>
            <div className="text-xs text-gray-500">{number || ""}</div>
          </div>
        );
      },
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      render: (v: string) => v || "—",
    },
    {
      title: "Date",
      dataIndex: "deposit_date",
      key: "deposit_date",
      render: (v: string, r) => formatDate(v || r.created_at),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v: DepositStatus) => (
        <span
          className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLOR[v] ?? "bg-gray-100 text-gray-600"}`}
        >
          {v || "—"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 160,
      render: (_, record) => {
        const approved = record.status === "APPROVED";
        const rejected = record.status === "REJECTED";
        const cancelled = record.status === "CANCELLED";
        const isDone = approved || rejected || cancelled;
        return (
        <div className="flex items-center justify-center gap-1">
          <Tooltip title="Approve">
            <Popconfirm
              title="Approve this deposit?"
              disabled={approved}
              onConfirm={() =>
                handleAction(
                  record.id,
                  approveDepositAction,
                  "Deposit approved successfully",
                )
              }
            >
              <AntButton
                type="text"
                shape="circle"
                size="small"
                disabled={approved}
                icon={<CheckOutlined className="text-green-600" />}
                loading={actingId === record.id}
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Reject">
            <Popconfirm
              title="Reject this deposit?"
              disabled={rejected || approved}
              onConfirm={() =>
                handleAction(
                  record.id,
                  rejectDepositAction,
                  "Deposit rejected",
                )
              }
            >
              <AntButton
                type="text"
                shape="circle"
                size="small"
                disabled={rejected || approved}
                icon={<CloseOutlined className="text-red-600" />}
                loading={actingId === record.id}
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Cancel">
            <Popconfirm
              title="Cancel this deposit?"
              disabled={cancelled || isDone}
              onConfirm={() =>
                handleAction(
                  record.id,
                  cancelDepositAction,
                  "Deposit cancelled",
                )
              }
            >
              <AntButton
                type="text"
                shape="circle"
                size="small"
                disabled={cancelled || isDone}
                icon={<StopOutlined className="text-gray-500" />}
                loading={actingId === record.id}
              />
            </Popconfirm>
          </Tooltip>
        </div>
        );
      },
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00a550",
          borderRadius: 8,
          fontFamily: "var(--font-sans), sans-serif",
        },
        components: {
          Pagination: { itemBg: "#ffffff" },
        },
      }}
    >
      <div className="p-3 md:p-0 md:pt-2">
        <div className="min-w-0">
          <TableHeader title="Payments" />
        </div>

        {loading ? (
          <div className="mt-4 space-y-3">
            <Skeleton active title={{ width: "100%" }} paragraph={false} />
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                active
                title={false}
                paragraph={{ rows: 1, width: ["100%"] }}
              />
            ))}
          </div>
        ) : (
          <AntTable
            className="custom-table"
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            scroll={{ x: "max-content" }}
            locale={{ emptyText: "No data available." }}
          />
        )}
      </div>
    </ConfigProvider>
  );
};

export default DepositTable;