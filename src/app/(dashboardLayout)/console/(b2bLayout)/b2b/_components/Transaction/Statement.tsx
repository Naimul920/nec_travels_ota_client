"use client";

import React, { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "antd";
import type { TablePaginationConfig } from "antd";
import { getDepositStatementAction } from "@/actions/deposit.action";
import type { DepositStatementItem } from "@/interface/deposit";
import Table from "@/components/common/Table/Table";
import { FiCalendar, FiInbox, FiSearch } from "react-icons/fi";

const { Search } = Input;

const formatDate = (v?: string): string =>
  v ? new Date(v).toLocaleString() : "—";

const formatAmount = (v?: number): string =>
  v != null
    ? Number(v).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "—";

const mapStatementRow = (item: DepositStatementItem) => ({
  key: item.id,
  date: formatDate(item.created_at),
  bookingReference: item.booking_reference || item.reference_id || "—",
  pnr: item.pnr || "—",
  serviceType: item.service_type || item.type || "—",
  debit: item.direction === "DEBIT" ? Number(item.amount || 0) : null,
  credit: item.direction === "CREDIT" ? Number(item.amount || 0) : null,
  runningBalance: item.balance_after,
  remarks: item.description || item.note || "—",
});

type StatementRow = ReturnType<typeof mapStatementRow>;

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#12233D]/15 bg-white px-6 py-20 text-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#DCEBF9]">
        <FiInbox size={36} className="text-[#8FA9BE]" />
      </div>
      <h3 className="text-xl font-bold text-[#0F1B47]">
        No statement records found
      </h3>
      <p className="max-w-sm text-sm text-[#6B7785]">
        Your transaction statement will appear here.
      </p>
    </div>
  );
}

const Statement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ["b2b-statement", page, pageSize, searchTerm],
    queryFn: async () => {
      const res = await getDepositStatementAction({
        page,
        limit: pageSize,
        searchTerm,
        sortBy: "created_at",
      });
      const rows = (res.data ?? []).map(mapStatementRow);
      return {
        rows,
        total: res.meta?.total ?? rows.length,
      };
    },
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  const handleSearch = (value: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearchTerm(value.trim());
      setPage(1);
    }, 400);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 20);
  };

  const columns = useMemo(
    () => [
      {
        title: "SL",
        dataIndex: "sl",
        width: 56,
        align: "center" as const,
        render: (v: number) => (
          <span className="text-sm font-medium text-[#8FA9BE]">{v}</span>
        ),
      },
      {
        title: "Date",
        dataIndex: "date",
        width: 180,
        render: (v: string) => (
          <span className="inline-flex items-center gap-1.5 text-sm text-[#5B6B7A]">
            <FiCalendar size={13} className="text-[#8FA9BE]" />
            {v}
          </span>
        ),
      },
      {
        title: "Booking Reference",
        dataIndex: "bookingReference",
        width: 180,
        render: (v: string) => (
          <span className="font-semibold text-[#0F1B47]">{v}</span>
        ),
      },
      {
        title: "PNR",
        dataIndex: "pnr",
        width: 130,
        render: (v: string) => (
          <span className="font-mono text-sm font-semibold tracking-wide text-[#0F1B47]">
            {v}
          </span>
        ),
      },
      {
        title: "Service Types",
        dataIndex: "serviceType",
        width: 160,
        render: (v: string) => (
          <span className="inline-block rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase text-primary">
            {v}
          </span>
        ),
      },
      {
        title: "Debit",
        dataIndex: "debit",
        width: 120,
        align: "right" as const,
        render: (v: number | null) => (
          <span className="font-semibold text-red-600">
            {v != null ? `${formatAmount(v)}` : "—"}
          </span>
        ),
      },
      {
        title: "Credit",
        dataIndex: "credit",
        width: 120,
        align: "right" as const,
        render: (v: number | null) => (
          <span className="font-semibold text-emerald-600">
            {v != null ? `+${formatAmount(v)}` : "—"}
          </span>
        ),
      },
      {
        title: "Running Balance",
        dataIndex: "runningBalance",
        width: 150,
        align: "right" as const,
        render: (v: number | undefined) => (
          <span className="font-bold text-[#0F1B47]">
            ৳{formatAmount(v)}
          </span>
        ),
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
        width: 200,
        render: (v: string) => (
          <span className="line-clamp-1 text-xs text-[#5B6B7A]" title={v}>
            {v}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <Table
        title="STATEMENT"
        hideSearch
        loading={isLoading}
        columns={columns}
        headerExtras={
          <Search
            placeholder="Search statement.."
            allowClear
            size="large"
            className="w-72"
            prefix={<FiSearch className="text-gray-400" />}
            onSearch={(v) => handleSearch(v)}
            onChange={(e) => handleSearch(e.target.value)}
          />
        }
        emptyText={<EmptyState />}
        dataSource={rows.map((data, i) => ({
          ...data,
          sl: (page - 1) * pageSize + i + 1,
        }))}
        rowKey="key"
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
          showTotal: (t) => `${t} records`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default Statement;