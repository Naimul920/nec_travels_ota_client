export interface LoginResponse {
  success?: boolean;
  message?: string;
  redirectTo?: string;
  email_verified?: boolean;
  need_password_change?: boolean;
  code?: string;
  data?: Record<string, any>;
}
