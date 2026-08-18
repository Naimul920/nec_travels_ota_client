"use client";

import React, { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "antd";
import type { TablePaginationConfig } from "antd";
import { getMyDepositsAction } from "@/actions/deposit.action";
import type { DepositItem } from "@/interface/deposit";
import Table from "@/components/common/Table/Table";
import { FiCalendar, FiInbox, FiSearch } from "react-icons/fi";

const { Search } = Input;

const formatDate = (v?: string | null): string =>
  v ? new Date(v).toLocaleString() : "—";

const formatAmount = (v?: number | string): string =>
  Number(v || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const mapDepositRow = (deposit: DepositItem) => ({
  key: deposit.id,
  bankName: deposit.bank?.bank_name || deposit.account?.bank_name || "—",
  accountNumber:
    deposit.bank?.account_number || deposit.sender_account || "—",
  paymentDate: formatDate(deposit.payment_date || deposit.deposit_date),
  paymentType: deposit.type || (deposit.bank ? "BANK" : "—"),
  amount: Number(deposit.amount || 0),
  transactionId: deposit.transaction_id || deposit.reference || "—",
  remarks: deposit.note || "—",
  attachment: deposit.attachment || "",
});

type DepositRow = ReturnType<typeof mapDepositRow>;

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#12233D]/15 bg-white px-6 py-20 text-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#DCEBF9]">
        <FiInbox size={36} className="text-[#8FA9BE]" />
      </div>
      <h3 className="text-xl font-bold text-[#0F1B47]">No payments found</h3>
      <p className="max-w-sm text-sm text-[#6B7785]">
        Your deposit requests will appear here.
      </p>
    </div>
  );
}

const Payment: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ["b2b-deposits", page, pageSize, searchTerm],
    queryFn: async () => {
      const res = await getMyDepositsAction({
        page,
        limit: pageSize,
        searchTerm,
        sortBy: "created_at",
      });
      const rows = (res.data ?? []).map(mapDepositRow);
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
        title: "Bank Name",
        dataIndex: "bankName",
        width: 180,
        render: (v: string) => (
          <span className="font-semibold text-[#0F1B47]">{v}</span>
        ),
      },
      {
        title: "Account Number",
        dataIndex: "accountNumber",
        width: 180,
        render: (v: string) => (
          <span className="font-mono text-sm text-[#5B6B7A]">{v}</span>
        ),
      },
      {
        title: "Payment Date",
        dataIndex: "paymentDate",
        width: 180,
        render: (v: string) => (
          <span className="inline-flex items-center gap-1.5 text-sm text-[#5B6B7A]">
            <FiCalendar size={13} className="text-[#8FA9BE]" />
            {v}
          </span>
        ),
      },
      {
        title: "Payment Type",
        dataIndex: "paymentType",
        width: 130,
        render: (v: string) => (
          <span className="inline-block rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase text-primary">
            {v}
          </span>
        ),
      },
      {
        title: "Amount",
        dataIndex: "amount",
        width: 140,
        align: "right" as const,
        render: (v: number) => (
          <span className="font-semibold text-[#0F1B47]">
            ৳{formatAmount(v)}
          </span>
        ),
      },
      {
        title: "Transaction ID",
        dataIndex: "transactionId",
        width: 170,
        render: (v: string) => (
          <span className="font-mono text-sm font-semibold tracking-wide text-[#0F1B47]">
            {v}
          </span>
        ),
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
        width: 180,
        render: (v: string) => (
          <span className="line-clamp-1 text-xs text-[#5B6B7A]" title={v}>
            {v}
          </span>
        ),
      },
      {
        title: "Image",
        dataIndex: "attachment",
        width: 90,
        align: "center" as const,
        render: (_: string, row: DepositRow) =>
          row.attachment ? (
            <a
              href={row.attachment}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center"
            >
              <img
                src={row.attachment}
                alt="deposit"
                className="h-10 w-10 rounded border border-gray-200 object-cover"
              />
            </a>
          ) : (
            <span className="text-xs text-[#8FA9BE]">—</span>
          ),
      },
    ],
    [],
  );

  return (
    <div>
      <Table
        title="PAYMENTS"
        hideSearch
        loading={isLoading}
        columns={columns}
        headerExtras={
          <Search
            placeholder="Search payments.."
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
          showTotal: (t) => `${t} payments`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default Payment;