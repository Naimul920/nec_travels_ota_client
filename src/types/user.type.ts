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
    image_key?: string | null;
    image?: string | null;
  };
  wallet?: {
    balance?: number;
    creditBalance?: number;
  };
  balance?: number;
  creditBalance?: number;
}
