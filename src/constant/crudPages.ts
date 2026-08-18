import type { CrudField } from "@/components/common/Table/Table";

export interface CrudColumn {
  title?: string;
  dataIndex?: string | string[];
  key?: string;
  width?: number | string;
  valueType?: "text" | "tag";
  tagMap?: Record<string, string>;
}

export interface CrudPageConfig {
  path?: string;
  title: string;
  description?: string;
  columns?: CrudColumn[];
  fields?: CrudField[];
  dataSource?: Record<string, unknown>[];
  rowKey?: string;
  createButtonText?: string;
  modalTitle?: string;
}

const STATUS_MAP: Record<string, string> = {
  active: "green",
  inactive: "red",
  pending: "gold",
  approved: "green",
  rejected: "red",
  success: "green",
  failed: "red",
  issued: "green",
  cancelled: "red",
  refunded: "blue",
  hold: "orange",
  completed: "green",
};

const statusColumn = (title = "Status"): CrudColumn => ({
  title,
  dataIndex: "status",
  key: "status",
  valueType: "tag",
  tagMap: STATUS_MAP,
});

const textField = (
  name: string,
  label: string,
  required = false,
): CrudField => ({ name, label, type: "text", required });

const textareaField = (
  name: string,
  label: string,
  required = false,
): CrudField => ({ name, label, type: "textarea", required });

const numberField = (
  name: string,
  label: string,
  required = false,
): CrudField => ({ name, label, type: "number", required });

const selectField = (
  name: string,
  label: string,
  options: CrudField["options"],
  required = false,
): CrudField => ({ name, label, type: "select", options, required });

const dateField = (name: string, label: string, required = false): CrudField => ({
  name,
  label,
  type: "date",
  required,
});

const ACTIVE_INACTIVE = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const PENDING_STATUS = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const SUPER = "/console/super_admin";
const ADMIN = "/console/admin";
const B2B = "/console/b2b";

export const CRUD_PAGE_CONFIGS: Record<string, CrudPageConfig> = {
  // ============================ SUPER ADMIN ============================

  [`${SUPER}/agencies/all`]: {
    title: "All Agencies",
    description: "Manage all registered agencies.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Phone", dataIndex: "phone", key: "phone" },
      statusColumn(),
    ],
    fields: [
      textField("name", "Agency Name", true),
      textField("email", "Email", true),
      textField("phone", "Phone"),
      selectField("status", "Status", ACTIVE_INACTIVE),
    ],
  },

  [`${SUPER}/agencies/approvals`]: {
    title: "Agency Approvals",
    description: "Approve or reject agency registration requests.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Submitted", dataIndex: "submittedAt", key: "submittedAt" },
      statusColumn(),
    ],
    fields: [
      textField("name", "Agency Name", true),
      selectField("status", "Status", PENDING_STATUS, true),
    ],
  },

  [`${SUPER}/agencies/credit-limits`]: {
    title: "Credit Limits",
    description: "Set and manage agency credit limits.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Agency", dataIndex: "agency", key: "agency" },
      { title: "Credit Limit", dataIndex: "creditLimit", key: "creditLimit" },
      statusColumn(),
    ],
    fields: [
      textField("agency", "Agency", true),
      numberField("creditLimit", "Credit Limit", true),
    ],
  },

  [`${SUPER}/bookings/cancel-requests`]: {
    title: "Cancel Requests",
    description: "Review and process booking cancellation requests.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "PNR", dataIndex: "pnr", key: "pnr" },
      { title: "Passenger", dataIndex: "passenger", key: "passenger" },
      { title: "Amount", dataIndex: "amount", key: "amount" },
      statusColumn(),
    ],
    fields: [
      textField("pnr", "PNR", true),
      textField("passenger", "Passenger"),
      numberField("amount", "Amount", true),
    ],
  },

  [`${SUPER}/bookings/voided`]: {
    title: "Voided Tickets",
    description: "Manage voided tickets.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "PNR", dataIndex: "pnr", key: "pnr" },
      { title: "Passenger", dataIndex: "passenger", key: "passenger" },
      { title: "Airline", dataIndex: "airline", key: "airline" },
      { title: "Amount", dataIndex: "amount", key: "amount" },
      statusColumn(),
    ],
    fields: [
      textField("pnr", "PNR", true),
      textField("passenger", "Passenger"),
      textField("airline", "Airline"),
      numberField("amount", "Amount", true),
    ],
  },

  [`${SUPER}/bookings/refunded-tickets`]: {
    title: "Refunded Tickets",
    description: "Manage refunded tickets.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "PNR", dataIndex: "pnr", key: "pnr" },
      { title: "Passenger", dataIndex: "passenger", key: "passenger" },
      { title: "Refund Amount", dataIndex: "amount", key: "amount" },
      { title: "Date", dataIndex: "date", key: "date" },
      statusColumn(),
    ],
    fields: [
      textField("pnr", "PNR", true),
      textField("passenger", "Passenger"),
      numberField("amount", "Refund Amount", true),
      dateField("date", "Date"),
    ],
  },

  [`${SUPER}/bookings/flown-tickets`]: {
    title: "Flown Tickets",
    description: "Manage flown tickets.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "PNR", dataIndex: "pnr", key: "pnr" },
      { title: "Passenger", dataIndex: "passenger", key: "passenger" },
      { title: "Flight", dataIndex: "flight", key: "flight" },
      { title: "Date", dataIndex: "date", key: "date" },
      statusColumn(),
    ],
    fields: [
      textField("pnr", "PNR", true),
      textField("passenger", "Passenger"),
      textField("flight", "Flight"),
      dateField("date", "Date"),
    ],
  },

  [`${SUPER}/transaction/payments`]: {
    title: "Payments",
    description: "Manage payment records.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Agency", dataIndex: "agency", key: "agency" },
      { title: "Method", dataIndex: "method", key: "method" },
      { title: "Amount", dataIndex: "amount", key: "amount" },
      { title: "Date", dataIndex: "date", key: "date" },
      statusColumn(),
    ],
    fields: [
      textField("agency", "Agency", true),
      textField("method", "Method"),
      numberField("amount", "Amount", true),
      dateField("date", "Date"),
    ],
  },

  [`${SUPER}/transaction/credits`]: {
    title: "Credit Management",
    description: "Manage agency credit records.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Agency", dataIndex: "agency", key: "agency" },
      { title: "Amount", dataIndex: "amount", key: "amount" },
      { title: "Date", dataIndex: "date", key: "date" },
      statusColumn(),
    ],
    fields: [
      textField("agency", "Agency", true),
      numberField("amount", "Amount", true),
      dateField("date", "Date"),
    ],
  },

  [`${SUPER}/transaction/debit-vouchers`]: {
    title: "Debit Vouchers",
    description: "Manage debit voucher records.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Agency", dataIndex: "agency", key: "agency" },
      { title: "Amount", dataIndex: "amount", key: "amount" },
      { title: "Date", dataIndex: "date", key: "date" },
      statusColumn(),
    ],
    fields: [
      textField("agency", "Agency", true),
      numberField("amount", "Amount", true),
      dateField("date", "Date"),
    ],
  },

  [`${SUPER}/transaction/ledger`]: {
    title: "Master Ledger",
    description: "View the full financial ledger.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Transaction", dataIndex: "transactionId", key: "transactionId" },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        valueType: "tag",
        tagMap: { debit: "red", credit: "green" },
      },
      { title: "Amount", dataIndex: "amount", key: "amount" },
      statusColumn(),
    ],
    fields: [
      textField("description", "Description"),
      selectField("type", "Type", [
        { label: "Credit", value: "credit" },
        { label: "Debit", value: "debit" },
      ], true),
      numberField("amount", "Amount", true),
    ],
  },

  [`${SUPER}/users/admin`]: {
    title: "Admin Users",
    description: "Manage admin users.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Phone", dataIndex: "phone", key: "phone" },
      statusColumn(),
    ],
    fields: [
      textField("name", "Name", true),
      textField("email", "Email", true),
      textField("phone", "Phone"),
    ],
  },

  [`${SUPER}/users/agency`]: {
    title: "Agency Users",
    description: "Manage agency users.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Phone", dataIndex: "phone", key: "phone" },
      statusColumn(),
    ],
    fields: [
      textField("name", "Name", true),
      textField("email", "Email", true),
      textField("phone", "Phone"),
    ],
  },

  [`${SUPER}/users/customer`]: {
    title: "Customer Users",
    description: "Manage customer users.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Phone", dataIndex: "phone", key: "phone" },
      statusColumn(),
    ],
    fields: [
      textField("name", "Name", true),
      textField("email", "Email", true),
      textField("phone", "Phone"),
    ],
  },

  [`${SUPER}/users/approvals`]: {
    title: "Pending Approvals",
    description: "Approve or reject pending user registrations.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Submitted", dataIndex: "submittedAt", key: "submittedAt" },
      statusColumn(),
    ],
    fields: [
      textField("name", "Name", true),
      textField("email", "Email", true),
      selectField("status", "Status", PENDING_STATUS, true),
    ],
  },

  [`${SUPER}/finance/ledger`]: {
    title: "Master Ledger",
    description: "View the full financial ledger.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      {
        title: "Transaction",
        dataIndex: "transactionId",
        key: "transactionId",
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        valueType: "tag",
        tagMap: { debit: "red", credit: "green" },
      },
      { title: "Amount", dataIndex: "amount", key: "amount" },
      statusColumn(),
    ],
    fields: [
      textField("description", "Description"),
      selectField("type", "Type", [
        { label: "Credit", value: "credit" },
        { label: "Debit", value: "debit" },
      ], true),
      numberField("amount", "Amount", true),
    ],
  },

  [`${SUPER}/integrations/gds`]: {
    title: "GDS Configuration",
    description: "Configure Global Distribution System integrations.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Provider", dataIndex: "provider", key: "provider" },
      statusColumn(),
    ],
    fields: [
      textField("name", "Name", true),
      textField("provider", "Provider", true),
    ],
  },

  [`${SUPER}/integrations/markups`]: {
    title: "Markups",
    description: "Configure markup rules.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Type", dataIndex: "type", key: "type" },
      { title: "Value", dataIndex: "value", key: "value" },
      statusColumn(),
    ],
    fields: [
      selectField("type", "Type", [
        { label: "Airline", value: "airline" },
        { label: "Fare", value: "fare" },
        { label: "Route", value: "route" },
      ], true),
      numberField("value", "Value", true),
    ],
  },

  [`${SUPER}/banks/all`]: {
    title: "All Banks",
    description: "Manage all bank accounts.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Bank Name", dataIndex: "bankName", key: "bankName" },
      { title: "Account No", dataIndex: "accountNo", key: "accountNo" },
      { title: "Holder", dataIndex: "accountHolder", key: "accountHolder" },
      statusColumn(),
    ],
    fields: [
      textField("bankName", "Bank Name", true),
      textField("accountNo", "Account No", true),
      textField("accountHolder", "Account Holder", true),
    ],
  },

  [`${SUPER}/banks/add`]: {
    title: "Add Bank",
    description: "Register a new bank account.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Bank Name", dataIndex: "bankName", key: "bankName" },
      { title: "Account No", dataIndex: "accountNo", key: "accountNo" },
      statusColumn(),
    ],
    fields: [
      textField("bankName", "Bank Name", true),
      textField("accountNo", "Account No", true),
      textField("branch", "Branch"),
    ],
  },

  [`${SUPER}/deposits/all`]: {
    title: "All Deposits",
    description: "View all deposit transactions.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Agency", dataIndex: "agency", key: "agency" },
      { title: "Method", dataIndex: "method", key: "method" },
      { title: "Amount", dataIndex: "amount", key: "amount" },
      { title: "Date", dataIndex: "date", key: "date" },
      statusColumn(),
    ],
    fields: [
      textField("agency", "Agency", true),
      selectField("method", "Method", [
        { label: "Bank", value: "bank" },
        { label: "Mobile", value: "mobile" },
      ]),
      numberField("amount", "Amount", true),
      dateField("date", "Date"),
    ],
  },

  [`${SUPER}/deposits/pending`]: {
    title: "Pending Deposits",
    description: "Deposits awaiting verification.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Agency", dataIndex: "agency", key: "agency" },
      { title: "Amount", dataIndex: "amount", key: "amount" },
      { title: "Date", dataIndex: "date", key: "date" },
      statusColumn(),
    ],
    fields: [
      textField("agency", "Agency", true),
      numberField("amount", "Amount", true),
      dateField("date", "Date"),
    ],
  },

  [`${SUPER}/notices/all`]: {
    title: "All Notices",
    description: "Manage all published notices.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Content", dataIndex: "content", key: "content" },
      statusColumn(),
    ],
    fields: [
      textField("title", "Title", true),
      textareaField("content", "Content", true),
    ],
  },

  [`${SUPER}/notices/create`]: {
    title: "Create Notice",
    description: "Publish a new notice.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Title", dataIndex: "title", key: "title" },
      statusColumn(),
    ],
    fields: [
      textField("title", "Title", true),
      textareaField("content", "Content", true),
    ],
  },

  [`${SUPER}/notifications/all`]: {
    title: "All Notifications",
    description: "View all sent notifications.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Recipients", dataIndex: "recipients", key: "recipients" },
      statusColumn(),
    ],
    fields: [
      textField("title", "Title", true),
      textField("recipients", "Recipients"),
    ],
  },

  [`${SUPER}/notifications/send`]: {
    title: "Send Notification",
    description: "Send a new notification.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Recipients", dataIndex: "recipients", key: "recipients" },
      statusColumn(),
    ],
    fields: [
      textField("title", "Title", true),
      textField("recipients", "Recipients"),
      textareaField("message", "Message"),
    ],
  },

  [`${SUPER}/newsletter/subscribers`]: {
    title: "Subscribers",
    description: "Manage newsletter subscribers.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Subscribed At", dataIndex: "subscribedAt", key: "subscribedAt" },
      statusColumn(),
    ],
    fields: [textField("email", "Email", true)],
  },

  [`${SUPER}/newsletter/campaigns`]: {
    title: "Campaigns",
    description: "Manage newsletter campaigns.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Subject", dataIndex: "subject", key: "subject" },
      statusColumn(),
    ],
    fields: [
      textField("name", "Campaign Name", true),
      textField("subject", "Subject", true),
    ],
  },

  [`${SUPER}/commissions/rules`]: {
    title: "Commission Rules",
    description: "Configure commission rules.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Type", dataIndex: "type", key: "type" },
      { title: "Value", dataIndex: "value", key: "value" },
      statusColumn(),
    ],
    fields: [
      textField("name", "Rule Name", true),
      numberField("value", "Value", true),
    ],
  },

  [`${SUPER}/commissions/history`]: {
    title: "Commission History",
    description: "View commission payment history.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Agency", dataIndex: "agency", key: "agency" },
      { title: "Amount", dataIndex: "amount", key: "amount" },
      { title: "Date", dataIndex: "date", key: "date" },
      statusColumn(),
    ],
    fields: [
      textField("agency", "Agency", true),
      numberField("amount", "Amount", true),
      dateField("date", "Date"),
    ],
  },

  [`${SUPER}/users/roles`]: {
    title: "Roles & Permissions",
    description: "Manage user roles and permissions.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Users", dataIndex: "users", key: "users" },
      statusColumn(),
    ],
    fields: [
      textField("name", "Role Name", true),
      textField("permissions", "Permissions"),
    ],
  },

  [`${SUPER}/packages/all`]: {
    title: "All Packages",
    description: "Manage all travel packages.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Destination", dataIndex: "destination", key: "destination" },
      { title: "Price", dataIndex: "price", key: "price" },
      statusColumn(),
    ],
    fields: [
      textField("name", "Package Name", true),
      textField("destination", "Destination", true),
      numberField("price", "Price", true),
    ],
  },

  [`${SUPER}/packages/create`]: {
    title: "Create Package",
    description: "Create a new travel package.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Destination", dataIndex: "destination", key: "destination" },
      { title: "Price", dataIndex: "price", key: "price" },
      statusColumn(),
    ],
    fields: [
      textField("name", "Package Name", true),
      textField("destination", "Destination", true),
      numberField("price", "Price", true),
    ],
  },

  [`${SUPER}/currencies/list`]: {
    title: "Currency List",
    description: "Manage supported currencies.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Code", dataIndex: "code", key: "code" },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Symbol", dataIndex: "symbol", key: "symbol" },
      statusColumn(),
    ],
    fields: [
      textField("code", "Code", true),
      textField("name", "Name", true),
      textField("symbol", "Symbol"),
    ],
  },

  [`${SUPER}/currencies/rates`]: {
    title: "Exchange Rates",
    description: "Manage currency exchange rates.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Currency", dataIndex: "currency", key: "currency" },
      { title: "Buy Rate", dataIndex: "buyRate", key: "buyRate" },
      { title: "Sell Rate", dataIndex: "sellRate", key: "sellRate" },
      statusColumn(),
    ],
    fields: [
      textField("currency", "Currency", true),
      numberField("buyRate", "Buy Rate", true),
      numberField("sellRate", "Sell Rate", true),
    ],
  },

  [`${SUPER}/settings/profile`]: {
    title: "Profile Settings",
    description: "Manage system profile settings.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Field", dataIndex: "field", key: "field" },
      { title: "Value", dataIndex: "value", key: "value" },
      statusColumn(),
    ],
    fields: [textField("field", "Field", true), textField("value", "Value")],
  },

  [`${SUPER}/settings/notices`]: {
    title: "Notice Settings",
    description: "Manage notice display settings.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Title", dataIndex: "title", key: "title" },
      statusColumn(),
    ],
    fields: [textField("title", "Title", true)],
  },

  // ============================ B2B ============================

  [`${B2B}/support/add-ssr/seat-selection`]: {
    title: "Seat Selection",
    description: "Add SSR seat selection requests.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "PNR", dataIndex: "pnr", key: "pnr" },
      { title: "Passenger", dataIndex: "passenger", key: "passenger" },
      { title: "Seat", dataIndex: "seat", key: "seat" },
      statusColumn(),
    ],
    fields: [
      textField("pnr", "PNR", true),
      textField("passenger", "Passenger"),
      textField("seat", "Seat", true),
    ],
  },

  [`${B2B}/support/add-ssr/meals`]: {
    title: "Meals",
    description: "Add SSR meal requests.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "PNR", dataIndex: "pnr", key: "pnr" },
      { title: "Passenger", dataIndex: "passenger", key: "passenger" },
      { title: "Meal", dataIndex: "meal", key: "meal" },
      statusColumn(),
    ],
    fields: [
      textField("pnr", "PNR", true),
      textField("passenger", "Passenger"),
      textField("meal", "Meal", true),
    ],
  },

  [`${B2B}/support/add-ssr/wheelchair`]: {
    title: "Wheelchair",
    description: "Add SSR wheelchair requests.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "PNR", dataIndex: "pnr", key: "pnr" },
      { title: "Passenger", dataIndex: "passenger", key: "passenger" },
      { title: "Type", dataIndex: "type", key: "type" },
      statusColumn(),
    ],
    fields: [
      textField("pnr", "PNR", true),
      textField("passenger", "Passenger"),
      textField("type", "Type"),
    ],
  },

  [`${B2B}/support/add-ssr/vvip-notes`]: {
    title: "VVIP Notes",
    description: "Add SSR VVIP note requests.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "PNR", dataIndex: "pnr", key: "pnr" },
      { title: "Passenger", dataIndex: "passenger", key: "passenger" },
      { title: "Note", dataIndex: "note", key: "note" },
      statusColumn(),
    ],
    fields: [
      textField("pnr", "PNR", true),
      textField("passenger", "Passenger"),
      textareaField("note", "Note"),
    ],
  },

  [`${B2B}/support/add-ssr/fare-difference`]: {
    title: "Fare Difference",
    description: "Add fare difference requests.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "PNR", dataIndex: "pnr", key: "pnr" },
      { title: "Amount", dataIndex: "amount", key: "amount" },
      statusColumn(),
    ],
    fields: [
      textField("pnr", "PNR", true),
      numberField("amount", "Amount", true),
    ],
  },

  [`${B2B}/support/add-ssr/extra-baggage`]: {
    title: "Extra Baggage",
    description: "Add SSR extra baggage requests.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "PNR", dataIndex: "pnr", key: "pnr" },
      { title: "Weight", dataIndex: "weight", key: "weight" },
      { title: "Amount", dataIndex: "amount", key: "amount" },
      statusColumn(),
    ],
    fields: [
      textField("pnr", "PNR", true),
      textField("weight", "Weight"),
      numberField("amount", "Amount", true),
    ],
  },

  [`${B2B}/support/add-ssr/additional-charges`]: {
    title: "Additional Charges",
    description: "Add additional charge requests.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "PNR", dataIndex: "pnr", key: "pnr" },
      { title: "Charge", dataIndex: "charge", key: "charge" },
      { title: "Amount", dataIndex: "amount", key: "amount" },
      statusColumn(),
    ],
    fields: [
      textField("pnr", "PNR", true),
      textField("charge", "Charge"),
      numberField("amount", "Amount", true),
    ],
  },

  [`${B2B}/support/ticket-copy`]: {
    title: "Airlines Ticket Copy",
    description: "Request airline ticket copies.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "PNR", dataIndex: "pnr", key: "pnr" },
      { title: "Passenger", dataIndex: "passenger", key: "passenger" },
      statusColumn(),
    ],
    fields: [
      textField("pnr", "PNR", true),
      textField("passenger", "Passenger"),
    ],
  },

  [`${B2B}/support/frequent-flyer`]: {
    title: "Frequent Flyer Number",
    description: "Add frequent flyer number requests.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "PNR", dataIndex: "pnr", key: "pnr" },
      { title: "Passenger", dataIndex: "passenger", key: "passenger" },
      { title: "Number", dataIndex: "number", key: "number" },
      statusColumn(),
    ],
    fields: [
      textField("pnr", "PNR", true),
      textField("passenger", "Passenger"),
      textField("number", "Flyer Number", true),
    ],
  },

  [`${B2B}/finance/ssr-payments`]: {
    title: "SSR Payments",
    description: "Manage SSR payment records.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "PNR", dataIndex: "pnr", key: "pnr" },
      { title: "Type", dataIndex: "type", key: "type" },
      { title: "Amount", dataIndex: "amount", key: "amount" },
      statusColumn(),
    ],
    fields: [
      textField("pnr", "PNR", true),
      textField("type", "Type"),
      numberField("amount", "Amount", true),
    ],
  },

  [`${B2B}/finance/adm`]: {
    title: "ADM",
    description: "Manage Agency Debit Memos.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "PNR", dataIndex: "pnr", key: "pnr" },
      { title: "Airline", dataIndex: "airline", key: "airline" },
      { title: "Amount", dataIndex: "amount", key: "amount" },
      statusColumn(),
    ],
    fields: [
      textField("pnr", "PNR", true),
      textField("airline", "Airline"),
      numberField("amount", "Amount", true),
    ],
  },

  [`${B2B}/contact/youtube`]: {
    title: "YouTube",
    description: "Manage the YouTube contact link.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "URL", dataIndex: "url", key: "url" },
      statusColumn(),
    ],
    fields: [
      textField("title", "Title", true),
      textField("url", "URL", true),
    ],
  },

  // ============================ CONVERTED EXISTING LEAVES ============================

  [`${SUPER}/finance/debit-vouchers`]: {
    title: "Debit Vouchers",
    description: "Manage debit voucher records.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Agency", dataIndex: "agency", key: "agency" },
      { title: "Amount", dataIndex: "amount", key: "amount" },
      { title: "Date", dataIndex: "date", key: "date" },
      statusColumn(),
    ],
    fields: [
      textField("agency", "Agency", true),
      numberField("amount", "Amount", true),
      dateField("date", "Date"),
    ],
  },

  [`${SUPER}/support/tickets`]: {
    title: "Support Tickets",
    description: "Manage support tickets.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Subject", dataIndex: "subject", key: "subject" },
      { title: "Priority", dataIndex: "priority", key: "priority" },
      statusColumn(),
    ],
    fields: [
      textField("subject", "Subject", true),
      selectField("priority", "Priority", [
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium" },
        { label: "High", value: "high" },
      ], true),
    ],
  },

  [`${ADMIN}/agencies`]: {
    title: "Agency List",
    description: "Manage your agencies.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Phone", dataIndex: "phone", key: "phone" },
      statusColumn(),
    ],
    fields: [
      textField("name", "Agency Name", true),
      textField("email", "Email", true),
      textField("phone", "Phone"),
    ],
  },

  [`${ADMIN}/admins`]: {
    title: "My Admins",
    description: "Manage your admin users.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Email", dataIndex: "email", key: "email" },
      statusColumn(),
    ],
    fields: [
      textField("name", "Name", true),
      textField("email", "Email", true),
    ],
  },

  [`${ADMIN}/settings/edit-agency`]: {
    title: "Edit Agency",
    description: "Update your agency configuration.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Field", dataIndex: "field", key: "field" },
      { title: "Value", dataIndex: "value", key: "value" },
      statusColumn(),
    ],
    fields: [textField("field", "Field", true), textField("value", "Value")],
  },

  [`${ADMIN}/settings/edit-currency`]: {
    title: "Edit Currency",
    description: "Configure the default currency and exchange rates.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Currency", dataIndex: "currency", key: "currency" },
      { title: "Rate", dataIndex: "rate", key: "rate" },
      statusColumn(),
    ],
    fields: [
      textField("currency", "Currency", true),
      numberField("rate", "Rate", true),
    ],
  },

  [`${ADMIN}/settings/edit-bank-info`]: {
    title: "Edit Bank Info",
    description: "Manage the bank account details shown to your partners.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Bank Name", dataIndex: "bankName", key: "bankName" },
      { title: "Account No", dataIndex: "accountNo", key: "accountNo" },
      { title: "Holder", dataIndex: "accountHolder", key: "accountHolder" },
      statusColumn(),
    ],
    fields: [
      textField("bankName", "Bank Name", true),
      textField("accountNo", "Account No", true),
      textField("accountHolder", "Account Holder"),
    ],
  },

  [`${ADMIN}/settings/notice-edit`]: {
    title: "Notice Edit",
    description: "Create and publish notices.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Content", dataIndex: "content", key: "content" },
      statusColumn(),
    ],
    fields: [
      textField("title", "Title", true),
      textareaField("content", "Content"),
    ],
  },

  [`${ADMIN}/settings/popup-notice`]: {
    title: "Pop-up Notice",
    description: "Configure the pop-up announcements shown on login.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Title", dataIndex: "title", key: "title" },
      statusColumn(),
    ],
    fields: [textField("title", "Title", true)],
  },

  [`${B2B}/passengers`]: {
    title: "My Passengers",
    description: "Manage your saved passengers.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Phone", dataIndex: "phone", key: "phone" },
      statusColumn(),
    ],
    fields: [
      textField("name", "Name", true),
      textField("email", "Email"),
      textField("phone", "Phone"),
    ],
  },

  [`${B2B}/contact/whatsapp`]: {
    title: "WhatsApp Link",
    description: "Manage your WhatsApp contact link.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Label", dataIndex: "label", key: "label" },
      { title: "URL", dataIndex: "url", key: "url" },
      statusColumn(),
    ],
    fields: [
      textField("label", "Label", true),
      textField("url", "URL", true),
    ],
  },

  [`${B2B}/contact/facebook`]: {
    title: "Facebook Link",
    description: "Manage your Facebook contact link.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Label", dataIndex: "label", key: "label" },
      { title: "URL", dataIndex: "url", key: "url" },
      statusColumn(),
    ],
    fields: [
      textField("label", "Label", true),
      textField("url", "URL", true),
    ],
  },

  [`${B2B}/contact/instagram`]: {
    title: "Instagram Link",
    description: "Manage your Instagram contact link.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Label", dataIndex: "label", key: "label" },
      { title: "URL", dataIndex: "url", key: "url" },
      statusColumn(),
    ],
    fields: [
      textField("label", "Label", true),
      textField("url", "URL", true),
    ],
  },

  [`${B2B}/contact/website`]: {
    title: "Website Link",
    description: "Manage your website contact link.",
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Label", dataIndex: "label", key: "label" },
      { title: "URL", dataIndex: "url", key: "url" },
      statusColumn(),
    ],
    fields: [
      textField("label", "Label", true),
      textField("url", "URL", true),
    ],
  },
};

export const getCrudConfig = (path: string): CrudPageConfig => {
  const config = CRUD_PAGE_CONFIGS[path];
  if (config) return config;
  const segment = path.split("/").filter(Boolean).pop() ?? path;
  const title = segment.charAt(0).toUpperCase() + segment.slice(1);
  return {
    title,
    columns: [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "Name", dataIndex: "name", key: "name" },
      statusColumn(),
    ],
    fields: [textField("name", "Name", true)],
  };
};

const NUMERIC_KEYS = [
  "amount",
  "price",
  "value",
  "creditLimit",
  "rate",
  "buyRate",
  "sellRate",
];
const STATUS_KEYS = ["active", "pending", "inactive", "completed"];

export const generateSampleData = (
  config: CrudPageConfig,
  count = 4,
): Record<string, unknown>[] => {
  const columns = config.columns ?? [];
  const rowKeyName = config.rowKey ?? "id";

  return Array.from({ length: count }, (_, r) => {
    const row: Record<string, unknown> = { [rowKeyName]: r + 1 };

    columns.forEach((col) => {
      const key = Array.isArray(col.dataIndex)
        ? col.dataIndex[0]
        : col.dataIndex;
      if (!key || key === rowKeyName) return;

      if (key === "status") {
        row[key] = STATUS_KEYS[r % STATUS_KEYS.length];
      } else if (NUMERIC_KEYS.includes(key)) {
        row[key] = (r + 1) * 1250;
      } else if (key === "date" || key.toLowerCase().includes("date")) {
        row[key] = `2026-01-0${r + 1}`;
      } else if (key === "url") {
        row[key] = `https://example.com/${r + 1}`;
      } else {
        row[key] = `${key} ${r + 1}`;
      }
    });

    return row;
  });
};
