export const BOOKING_STATUS = [
  "DRAFT",
  "PENDING_APPROVAL",
  "APPROVED",
  "REJECTED",
  "PAYMENT_PENDING",
  "PAYMENT_COMPLETED",
  "TICKET_PENDING",
  "TICKET_ISSUED",
  "HOLD",
  "CANCELLED",
  "ISSUE",
  "ISSUE_PENDING",
  "VOID",
  "REFUNDED",
  "REFUNDED_PENDING",
  "REISSUED",
  "REISSUED_PENDING",
  "SSR",
  "SSR_PENDING",
] as const;

export type BookingStatus = (typeof BOOKING_STATUS)[number];

/** Normalizes a single or comma-separated list of statuses into the API's `A,B` query format. */
export const buildStatusParam = (
  status?: string | string[],
): string | undefined => {
  if (!status) return undefined;
  const values = Array.isArray(status) ? status : [status];
  const joined = values.map((v) => v.trim()).filter(Boolean).join(",");
  return joined || undefined;
};