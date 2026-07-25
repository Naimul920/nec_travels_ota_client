export const ROLE = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  B2B: "B2B",
  B2C: "B2C",
} as const;

export type USER_ROLE = (typeof ROLE)[keyof typeof ROLE];
