"use client";

import { useState, type ReactNode } from "react";
import {
  App,
  Button,
  ConfigProvider,
  Input,
  InputNumber,
  Modal,
  Select,
  Skeleton,
  Table as AntTable,
  type TableProps,
} from "antd";
import PlusOutlined from "@ant-design/icons/es/icons/PlusOutlined";
import TableHeader from "@/components/common/Table/TableHeader";
import clsx from "clsx";

export type CrudFieldType = "text" | "textarea" | "number" | "select" | "date";

export interface CrudFieldOption {
  label: string;
  value: string | number;
}

export interface CrudField {
  name: string;
  label: string;
  type?: CrudFieldType;
  options?: CrudFieldOption[];
  required?: boolean;
  placeholder?: string;
}

interface CustomTableProps<RecordType> {
  className?: string;
  title?: string;
  columns: TableProps<RecordType>["columns"];
  dataSource: RecordType[];
  onChange?: TableProps<RecordType>["onChange"];
  pagination?: TableProps<RecordType>["pagination"];
  rowKey?: string;
  isSelect?: boolean;
  /** Hide the built-in search box (e.g. server-side search handled by the page). */
  hideSearch?: boolean;
  /** Show a skeleton loading state in place of the table body. */
  loading?: boolean;
  /** Render custom content (e.g. a search bar) on the right side of the header. */
  headerExtras?: ReactNode;
  /** Override the table horizontal scroll. A value that always fits the container width. */
  scroll?: TableProps<RecordType>["scroll"];
  /** Custom empty state shown when the data source is empty. */
  emptyText?: ReactNode;
  /** Enable an optional "Create" button at the top of the table. Omit to hide. */
  createButtonText?: string;
  createFields?: CrudField[];
  createModalTitle?: string;
  /** Optional handler. When provided, the component won't add rows itself. */
  onCreate?: (values: Record<string, unknown>) => void;
}

const renderFieldInput = (
  field: CrudField,
  value: unknown,
  onChange: (v: unknown) => void,
) => {
  const placeholder =
    field.placeholder ?? `Enter ${field.label.toLowerCase()}`;

  switch (field.type) {
    case "textarea":
      return (
        <Input.TextArea
          rows={3}
          value={value as string}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <InputNumber
          className="w-full"
          placeholder={placeholder}
          value={value as number}
          onChange={(v) => onChange(v)}
        />
      );
    case "select":
      return (
        <Select
          className="w-full"
          placeholder={placeholder}
          options={field.options ?? []}
          value={value as string | undefined}
          onChange={(v) => onChange(v)}
        />
      );
    case "date":
      return (
        <Input
          type="date"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "text":
    default:
      return (
        <Input
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
};

const Table = <RecordType extends object>({
  className,
  title,
  columns,
  dataSource,
  onChange,
  pagination,
  rowKey = "key",
  isSelect = false,
  hideSearch = false,
  loading = false,
  headerExtras,
  scroll,
  emptyText,
  createButtonText,
  createFields = [],
  createModalTitle,
  onCreate,
}: CustomTableProps<RecordType>) => {
  const { message } = App.useApp();
  const showCreate = Boolean(createFields && createFields.length > 0);

  const [createdRows, setCreatedRows] = useState<RecordType[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);

  const openCreate = () => {
    setFormValues({});
    setIsCreateOpen(true);
  };

  const closeCreate = () => {
    setIsCreateOpen(false);
    setFormValues({});
  };

  const handleSave = () => {
    const missing = createFields.filter(
      (field) =>
        field.required &&
        (formValues[field.name] === undefined ||
          formValues[field.name] === null ||
          formValues[field.name] === ""),
    );
    if (missing.length > 0) {
      message.error(`Please fill: ${missing.map((f) => f.label).join(", ")}`);
      return;
    }

    if (onCreate) {
      onCreate(formValues);
    } else {
      const newRecord = {
        [rowKey]: Date.now(),
        ...formValues,
      } as RecordType;
      setCreatedRows((prev) => [newRecord, ...prev]);
    }

    setSubmitting(true);
    message.success("Created successfully");
    setTimeout(() => {
      setSubmitting(false);
      closeCreate();
    }, 150);
  };

  const effectiveData = [...createdRows, ...dataSource];

  return (
    <div className={clsx("p-3 md:p-0 md:pt-2", className)}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#00a550",
            borderRadius: 8,
            fontFamily: "var(--font-sans), sans-serif",
          },
          components: {
            Pagination: {
              itemBg: "#ffffff",
            },
          },
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 md:pb-5">
        <div className="min-w-0">
          <TableHeader
            title={title}
            isSelect={isSelect}
            hideSearch={hideSearch}
          />
        </div>
        <div className="flex items-center gap-2">
          {headerExtras}
          {showCreate && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="h-10 !bg-primary text-white"
              onClick={openCreate}
            >
              {createButtonText ?? "Create"}
            </Button>
          )}
        </div>
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
          dataSource={effectiveData}
          onChange={onChange}
          pagination={pagination}
          rowKey={rowKey}
          scroll={scroll ?? { x: "max-content" }}
          locale={{
            emptyText: emptyText ?? "No data available.",
          }}
        />
      )}

        <Modal
          title={createModalTitle ?? (title ? `Create ${title}` : "Create")}
          open={isCreateOpen}
          onCancel={closeCreate}
          onOk={handleSave}
          confirmLoading={submitting}
          okText="Save"
          cancelText="Cancel"
          destroyOnHidden
        >
          <div className="mt-4 space-y-4">
            {createFields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={`crud-${field.name}`}
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  {field.label}
                  {field.required && (
                    <span className="ml-0.5 text-red-500">*</span>
                  )}
                </label>
                {renderFieldInput(
                  field,
                  formValues[field.name],
                  (v) =>
                    setFormValues((prev) => ({ ...prev, [field.name]: v })),
                )}
              </div>
            ))}
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default Table;