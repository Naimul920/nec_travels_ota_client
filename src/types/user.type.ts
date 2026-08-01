export interface UserProfileResponse {
  id: string;
  role: string;
  email: string;
  phone:string;
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


export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}