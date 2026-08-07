"use client";

import { useQueryClient } from "@tanstack/react-query";
import { App, Tag, type TableProps } from "antd";

import Table from "@/components/common/Table/Table";
import {
  createPackageAction,
  type PackageItem,
} from "@/actions/commission.action";
import type { CrudField } from "@/components/common/Table/Table";

const PRIORITY_FIELDS: CrudField[] = [
  { name: "package_name", label: "Package Name", type: "text", required: true },
  { name: "ait", label: "AIT (%)", type: "text", required: true },
  { name: "first_priority", label: "First Priority", type: "text" },
  { name: "second_priority", label: "Second Priority", type: "text" },
  { name: "third_priority", label: "Third Priority", type: "text" },
  {
    name: "is_b2c_default",
    label: "B2C Default",
    type: "select",
    options: [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ],
  },
];

export default function CreatePackagePage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const columns: TableProps<PackageItem>["columns"] = [
    {
      title: "Package Name",
      dataIndex: "package_name",
      key: "package_name",
    },
    { title: "AIT (%)", dataIndex: "ait", key: "ait" },
    {
      title: "B2C Default",
      key: "is_b2c_default",
      render: (_, r) =>
        r.is_b2c_default ? (
          <Tag color="blue">Default</Tag>
        ) : (
          <Tag>No</Tag>
        ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, r) => (
        <Tag color={r.status ? "green" : "red"}>
          {r.status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
  ];

  const handleCreate = async (values: Record<string, unknown>) => {
    const result = await createPackageAction({
      package_name: String(values.package_name ?? ""),
      ait: String(values.ait ?? ""),
      first_priority: values.first_priority
        ? String(values.first_priority)
        : null,
      second_priority: values.second_priority
        ? String(values.second_priority)
        : null,
      third_priority: values.third_priority
        ? String(values.third_priority)
        : null,
      is_b2c_default: values.is_b2c_default === "true",
    });
    if (result.success) {
      message.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["packagesList"] });
    } else {
      message.error(result.message);
    }
  };

  return (
    <Table
      className="p-3 md:p-0 md:pt-2"
      title="Create Package"
      columns={columns as never}
      dataSource={[]}
      rowKey="id"
      createButtonText="Create Package"
      createFields={PRIORITY_FIELDS}
      createModalTitle="Create Package"
      onCreate={(values) => handleCreate(values)}
    />
  );
}