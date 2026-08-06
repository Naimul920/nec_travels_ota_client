export type BankType = "BANK" | "MOBILE";

export interface BankItem {
  id: string;
  type: BankType;
  bank_name: string;
  account_name: string;
  account_number: string;
  branch?: string | null;
  routing_number?: string | null;
  account_type?: string | null;
  logo_key?: string | null;
  status?: boolean;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BankListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: BankItem[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BankCreateResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: BankItem | null;
}