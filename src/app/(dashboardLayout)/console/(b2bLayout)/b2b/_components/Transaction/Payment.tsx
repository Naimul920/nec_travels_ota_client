"use client";

import React, { useCallback, useEffect, useState } from "react";
import { App } from "antd";
import { getDepositStatementAction } from "@/actions/deposit.action";
import type { DepositStatementItem } from "@/interface/deposit";
import Table from "@/components/common/Table/Table";
import type { ColumnsType } from "antd/es/table";

const formatDate = (v?: string) => (v ? new Date(v).toLocaleString() : "—");

const formatAmount = (v?: number) =>
  v != null ? Number(v).toLocaleString() : "—";

const CreditTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block rounded-md px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700">
    {children}
  </span>
);

const DebitTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block rounded-md px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700">
    {children}
  </span>
);

const Payment: React.FC = () => {
  const { message } = App.useApp();
  const [data, setData] = useState<DepositStatementItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await getDepositStatementAction({ page: 1, limit: 20 });
    setData(res.success ? res.data : []);
    if (!res.success && res.message) message.error(res.message);
    setLoading(false);
  }, [message]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns: ColumnsType<DepositStatementItem> = [
    { title: "SL", key: "sl", width: 60, render: (_, __, i) => i + 1 },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (v) => v || "—",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (v) => v || "—",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (v, r) =>
        r.direction === "DEBIT" ? (
          <DebitTag>-{formatAmount(v)}</DebitTag>
        ) : (
          <CreditTag>+{formatAmount(v)}</CreditTag>
        ),
    },
    {
      title: "Balance After",
      dataIndex: "balance_after",
      key: "balance_after",
      align: "right",
      render: (v) => <strong>{formatAmount(v)}</strong>,
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (v) => formatDate(v),
    },
  ];

  return (
    <Table
      title="Payments"
      columns={columns}
      loading={loading}
      pagination={{ pageSize: 20, showSizeChanger: true }}
      dataSource={data}
      rowKey="id"
    />
  );
};

export default Payment;