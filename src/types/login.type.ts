export interface LoginResponse {
  success?: boolean;
  message?: string;
  redirectTo?: string;
  email_verified?: boolean;
  need_password_change?: boolean;
  data?: Record<string, any>;
}
