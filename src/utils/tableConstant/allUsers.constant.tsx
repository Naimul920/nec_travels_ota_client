import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "geekblue",
  B2B: "purple",
  B2C: "cyan",
  SUPER_ADMIN: "red",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "green",
  INACTIVE: "red",
  PENDING: "orange",
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

const allUsersColumns: ColumnsType = [
  {
    title: "SL",
    dataIndex: "sl",
    width: 60,
    align: "center",
  },
  {
    title: "Name",
    dataIndex: "full_name",
    render: (_, record: Record<string, any>) => (
      <span className="font-medium">
        {record.full_name || record.email}
      </span>
    ),
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Phone",
    dataIndex: "phone",
  },
  {
    title: "Role",
    dataIndex: "role",
    render: (role: string) => (
      <Tag color={ROLE_COLORS[role] ?? "default"}>{role}</Tag>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (status: string) => (
      <Tag color={STATUS_COLORS[status] ?? "default"}>{status}</Tag>
    ),
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    render: (value: string) => formatDate(value),
  },
];

export default allUsersColumns;