export interface DepositItem {
  id: string;
  type?: "BANK" | "MOBILE" | string;
  amount?: number;
  status?: DepositStatus;
  statusLabel?: string;
  reference?: string | null;
  deposit_date?: string;
  created_at?: string;
  updated_at?: string;
  bank?: {
    id?: string;
    bank_name?: string;
    account_name?: string;
    account_number?: string;
    account_type?: string;
  } | null;
  account?: {
    id?: string;
    bank_name?: string;
    account_name?: string;
    account_number?: string;
  } | null;
  user?: {
    id?: string;
    full_name?: string;
    email?: string;
  } | null;
}

export type DepositStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface DepositMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DepositListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DepositItem[];
  meta?: DepositMeta;
}

export interface DepositActionResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: DepositItem | null;
}

export interface DepositStatementItem {
  id: string;
  type?: string;
  direction?: "CREDIT" | "DEBIT";
  amount?: number;
  balance_before?: number;
  balance_after?: number;
  reference_type?: string;
  reference_id?: string;
  description?: string;
  created_at?: string;
}

export interface DepositStatementMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  balance?: number;
}

export interface DepositStatementResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DepositStatementItem[];
  meta?: DepositStatementMeta;
}