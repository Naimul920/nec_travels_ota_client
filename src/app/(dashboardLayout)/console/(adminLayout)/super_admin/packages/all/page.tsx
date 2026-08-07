"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  App,
  Button,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table as AntTable,
  Tag,
  type TableProps,
} from "antd";
import PlusOutlined from "@ant-design/icons/es/icons/PlusOutlined";

import {
  createPackageAction,
  deletePackageAction,
  getPackagesListAction,
  updatePackageStatusAction,
  type CreatePackagePayload,
  type PackagesListResponse,
  type PackageItem,
} from "@/actions/commission.action";

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : "-";

const EMPTY_FORM: CreatePackagePayload = {
  package_name: "",
  ait: "",
  first_priority: null,
  second_priority: null,
  third_priority: null,
  is_b2c_default: false,
};

export default function PackagesPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<CreatePackagePayload>(EMPTY_FORM);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data, isPending } = useQuery<PackagesListResponse>({
    queryKey: ["packagesList", page, limit],
    queryFn: () => getPackagesListAction({ page, limit }),
  });

  const set = <K extends keyof CreatePackagePayload>(
    key: K,
    value: CreatePackagePayload[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const closeCreate = () => {
    setCreateOpen(false);
    setForm(EMPTY_FORM);
  };

  const handleCreate = async () => {
    if (!form.package_name.trim() || !form.ait.trim()) {
      message.error("Package name and AIT are required");
      return;
    }
    setCreating(true);
    const result = await createPackageAction(form);
    setCreating(false);
    if (result.success) {
      message.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["packagesList"] });
      closeCreate();
    } else {
      message.error(result.message);
    }
  };

  const handleStatusToggle = async (item: PackageItem) => {
    const nextStatus = !item.status;
    setUpdatingId(item.id);
    const result = await updatePackageStatusAction(item.id, {
      package_name: item.package_name,
      ait: item.ait,
      first_priority: item.first_priority,
      second_priority: item.second_priority,
      third_priority: item.third_priority,
      is_b2c_default: item.is_b2c_default,
      status: nextStatus,
    });
    setUpdatingId(null);
    if (result.success) {
      message.success(
        nextStatus ? "Package activated" : "Package deactivated",
      );
      queryClient.invalidateQueries({ queryKey: ["packagesList"] });
    } else {
      message.error(result.message);
    }
  };

  const handleDelete = async (id: string) => {
    setUpdatingId(id);
    const result = await deletePackageAction(id);
    setUpdatingId(null);
    if (result.success) {
      message.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["packagesList"] });
    } else {
      message.error(result.message);
    }
  };

  const columns: TableProps<PackageItem>["columns"] = [
    {
      title: "SL",
      key: "sl",
      width: 70,
      render: (_, __, index) => (page - 1) * limit + index + 1,
    },
    {
      title: "Package Name",
      dataIndex: "package_name",
      key: "package_name",
    },
    { title: "AIT (%)", dataIndex: "ait", key: "ait" },
    { title: "First Priority", dataIndex: "first_priority", key: "first_priority" },
    { title: "Second Priority", dataIndex: "second_priority", key: "second_priority" },
    { title: "Third Priority", dataIndex: "third_priority", key: "third_priority" },
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
      title: "Created",
      key: "created_at",
      render: (_, r) => formatDate(r.created_at),
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
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, r) => (
        <Space size={4}>
          <Button
            size="small"
            loading={updatingId === r.id}
            onClick={() => handleStatusToggle(r)}
          >
            {r.status ? "Deactivate" : "Activate"}
          </Button>
          <Popconfirm
            title="Delete this package?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(r.id)}
          >
            <Button
              danger
              size="small"
              loading={updatingId === r.id}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-3 md:p-0 md:pt-2">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">All Packages</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="h-10 !bg-brand text-white"
          onClick={() => setCreateOpen(true)}
        >
          Create Package
        </Button>
      </div>

      <AntTable<PackageItem>
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
        locale={{ emptyText: "No packages found." }}
      />

      <Modal
        title="Create Package"
        open={createOpen}
        onCancel={closeCreate}
        onOk={handleCreate}
        confirmLoading={creating}
        okText="Create"
        destroyOnHidden
      >
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Package Name <span className="ml-0.5 text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter package name"
              value={form.package_name}
              onChange={(e) => set("package_name", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              AIT (%) <span className="ml-0.5 text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter AIT percentage"
              value={form.ait}
              onChange={(e) => set("ait", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              First Priority
            </label>
            <Select
              className="w-full"
              allowClear
              placeholder="Select priority"
              value={form.first_priority || undefined}
              options={[
                { label: "First", value: "first" },
                { label: "Second", value: "second" },
                { label: "Third", value: "third" },
              ]}
              onChange={(v) => set("first_priority", v ?? null)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Second Priority
            </label>
            <Select
              className="w-full"
              allowClear
              placeholder="Select priority"
              value={form.second_priority || undefined}
              options={[
                { label: "First", value: "first" },
                { label: "Second", value: "second" },
                { label: "Third", value: "third" },
              ]}
              onChange={(v) => set("second_priority", v ?? null)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Third Priority
            </label>
            <Select
              className="w-full"
              allowClear
              placeholder="Select priority"
              value={form.third_priority || undefined}
              options={[
                { label: "First", value: "first" },
                { label: "Second", value: "second" },
                { label: "Third", value: "third" },
              ]}
              onChange={(v) => set("third_priority", v ?? null)}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Set as B2C default
            </label>
            <Switch
              checked={form.is_b2c_default}
              onChange={(v) => set("is_b2c_default", v)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}