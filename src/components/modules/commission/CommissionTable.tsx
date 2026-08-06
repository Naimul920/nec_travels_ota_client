"use client";

import React, { useCallback, useEffect, useState } from "react";
import { App, ConfigProvider, Table as AntTable, Skeleton } from "antd";
import type { ColumnsType } from "antd/es/table";
import PlusOutlined from "@ant-design/icons/es/icons/PlusOutlined";
import { Button } from "@/components/ui";
import ActionButton from "@/components/common/Action/ActionButton";
import TableHeader from "@/components/common/Table/TableHeader";
import CommissionModal from "./CommissionModal";
import {
  deleteCommissionAction,
  getCommissionsAction,
  getPackagesAction,
} from "@/actions/commission.action";
import { getCurrenciesAction } from "@/actions/currency.action";
import type { CommissionItem } from "@/interface/commission";

const formatDate = (v?: string) =>
  v ? new Date(v).toLocaleDateString() : "—";

const CommissionTable: React.FC = () => {
  const { message } = App.useApp();
  const [data, setData] = useState<CommissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<CommissionItem | null>(null);
  const [packageOptions, setPackageOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [currencyOptions, setCurrencyOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await getCommissionsAction({ page: 1, limit: 100 });
    setData(res.success ? res.data : []);
    if (!res.success && res.message) {
      message.error(res.message);
    }
    setLoading(false);
  }, [message]);

  useEffect(() => {
    fetchData();
    getPackagesAction().then((packages) => {
      setPackageOptions(
        packages.map((p) => ({
          label: p.package_name || p.id,
          value: p.id,
        })),
      );
    });
    getCurrenciesAction().then((currencies) => {
      setCurrencyOptions(
        currencies.map((c) => ({
          label: `${c.code} — ${c.name}`,
          value: c.id,
        })),
      );
    });
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    const res = await deleteCommissionAction(id);
    if (res.success) {
      message.success(res.message || "Commission deleted successfully");
      fetchData();
    } else {
      message.error(res.message || "Failed to delete commission");
    }
  };

  const columns: ColumnsType<CommissionItem> = [
    {
      title: "Airline",
      dataIndex: "airline",
      key: "airline",
      render: (v: string) => v || "—",
    },
    {
      title: "Route",
      key: "route",
      render: (_, r) => `${r.origin || "—"} → ${r.destination || "—"}`,
    },
    {
      title: "Package",
      key: "package_name",
      render: (_, r) => r.package_name || r.package?.package_name || "—",
    },
    {
      title: "Business %",
      dataIndex: "business_class_out",
      key: "business_class_out",
      width: 110,
    },
    {
      title: "Economy %",
      dataIndex: "economy_class_out",
      key: "economy_class_out",
      width: 110,
    },
    {
      title: "Business Charge",
      dataIndex: "business_charge_out",
      key: "business_charge_out",
      width: 140,
    },
    {
      title: "Economy Charge",
      dataIndex: "economy_charge_out",
      key: "economy_charge_out",
      width: 140,
    },
    {
      title: "API Cur.",
      key: "api_currency",
      render: (_, r) => r.api_currency?.code || "—",
    },
    {
      title: "User Cur.",
      key: "user_currency",
      render: (_, r) => r.user_currency?.code || "—",
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: formatDate,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 140,
      render: (_, record) => (
        <ActionButton
          editContent={
            <CommissionModal
              open
              editing={record}
              onClose={() => setEditing(null)}
              onSaved={fetchData}
              packageOptions={packageOptions}
              currencyOptions={currencyOptions}
            />
          }
          handleDelete={() => handleDelete(record.id)}
        />
      ),
    },
  ];

  const openCreate = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <TableHeader title="All Commission" />
          </div>
          <Button
            type="button"
            variant="primary"
            className="flex h-10 items-center gap-2 px-5 !bg-primary text-white"
            onClick={openCreate}
          >
            <PlusOutlined />
            Create
          </Button>
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
            locale={{ emptyText: "No data available. Click Create to add a new record." }}
          />
        )}
      </div>

      {!editing && (
        <CommissionModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaved={fetchData}
          editing={null}
          packageOptions={packageOptions}
          currencyOptions={currencyOptions}
        />
      )}
    </ConfigProvider>
  );
};

export default CommissionTable;