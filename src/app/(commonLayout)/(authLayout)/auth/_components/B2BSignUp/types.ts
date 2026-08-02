export interface B2BSignUpFormValues {
  // Step 1 — Account
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;

  // Step 2 — Company
  agency_name: string;
  business_type: string;
  currency: string;
  currency_Id: string;
  caab_certificate_number: string;
  caab_certificate_expiry: string;
  city: string;
  postcode: string;
  address: string;
  // hear_about_us: string;

  // Step 3 — Documents
  logo: File | null;
  trade_license: File | null;
  caab_certificate: File | null;
  nid: File | null;
  business_card: File | null;
}

export const FILE_FIELDS = [
  "logo",
  "trade_license",
  "caab_certificate",
  "nid",
  "business_card",
] as const;

export type FileFieldName = (typeof FILE_FIELDS)[number];

export const REQUIRED_FILE_FIELDS: FileFieldName[] = [];

export const MAX_FILE_SIZE_MB = 1;
export const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export const TOTAL_STEPS = 4;
