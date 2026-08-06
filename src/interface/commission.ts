export interface CommissionPackage {
  id: string;
  package_name?: string;
}

export interface CommissionCurrency {
  id?: string;
  code?: string;
  name?: string;
  symbol?: string;
}

export interface CommissionItem {
  id: string;
  airline?: string | null;
  origin?: string | null;
  destination?: string | null;
  business_class_out: number;
  economy_class_out: number;
  business_charge_out: number;
  economy_charge_out: number;
  api_currency_id?: string | null;
  user_currency_id?: string | null;
  package_name?: string | null;
  package_id?: string | null;
  created_at?: string;
  updated_at?: string;
  package?: CommissionPackage | null;
  api_currency?: CommissionCurrency | null;
  user_currency?: CommissionCurrency | null;
}

export interface CommissionMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CommissionListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CommissionItem[];
  meta?: CommissionMeta;
}

export interface CommissionCreateResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: CommissionItem | null;
}