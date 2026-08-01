export interface ApiResponse<TData = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: TData;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  success: boolean;
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
}
