export interface UserProfileResponse {
  id: string;
  role: string;
  email: string;
  phone:string;
  agency_code?:string;
  admin?: { department?: string };
  profile?: {
    full_name?: string;
    first_name?:string;
    last_name?:string;
    agency_name?: string | null;
    // image_key?: string | null;
    image?: string | null;
  };
  b2b_user?: {
    logo?: string | null;
    agency_code?: string | null;
    agency_name?: string | null;
  };
  wallet?: {
    balance?: number;
    creditBalance?: number;
  };
  currency?:{
    code?: string;
  }
  balance?: number;
  creditBalance?: number;
}


export interface AdminUser {
  id: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  email_verified: boolean;
  two_step_verified: boolean;
  need_password_change: boolean;
  currency_id: string;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  profile?: {
    id?: string;
    user_id?: string;
    first_name?: string | null;
    last_name?: string | null;
    full_name?: string | null;
    image_url?: string | null;
    image_key?: string | null;
    created_at?: string;
    updated_at?: string;
  };
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}