export const DEPARTMENT = {
  IT: "IT",
  OPERATION: "OPERATION",
  SALES: "SALES",
  MARKETING: "MARKETING",
  ACCOUNTS: "ACCOUNTS",
} as const;

export type USER_DEPARTMENT = (typeof DEPARTMENT)[keyof typeof DEPARTMENT];
