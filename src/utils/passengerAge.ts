import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { PassengerType } from "@/types/passengerAlertBank";

export type PassengerTypeCode = "ADT" | "C03" | "C07" | "INF";

export const AGE_RANGES: Record<
  "adult" | "child" | "kid" | "infant",
  { min: number | null; max: number | null; label: string }
> = {
  adult: { min: 12, max: null, label: "12 years & above" },
  child: { min: 5, max: 11, label: "5 to 11 years" },
  kid: { min: 2, max: 4, label: "2 to 4 years" },
  infant: { min: 0, max: 1, label: "0 to 1 year" },
};

export function calculateAge(
  dateOfBirth: string | null | undefined,
  onDate?: string | null,
): number | null {
  if (!dateOfBirth) return null;
  const dob = dayjs(dateOfBirth);
  if (!dob.isValid()) return null;
  const base = onDate ? dayjs(onDate) : dayjs();
  if (!base.isValid()) return null;
  const diff = base.diff(dob, "year");
  const adjusted = base.subtract(diff, "year");
  return adjusted.isBefore(dob) ? diff - 1 : diff;
}

export function getDateOfBirthDisabledDate(
  type: PassengerType,
): (current: Dayjs) => boolean {
  const today = dayjs().startOf("day");
  const range = AGE_RANGES[type];
  const maxDob = range.max === null ? null : today.subtract(range.max, "year");
  const minDob = range.min === null ? null : today.subtract(range.min, "year");

  return (current: Dayjs) => {
    if (!current) return false;
    const date = current.startOf("day");
    if (date.isAfter(today)) return true;
    if (maxDob && date.isBefore(maxDob)) return true;
    if (minDob && date.isAfter(minDob)) return true;
    return false;
  };
}

export function getPassportExpiryDisabledDate(): (current: Dayjs) => boolean {
  const today = dayjs().startOf("day");
  return (current: Dayjs) => {
    if (!current) return false;
    return !current.startOf("day").isAfter(today);
  };
}

export function getPassengerTypeByAge(age: number | null): PassengerTypeCode {
  if (age === null) return "ADT";
  if (age <= 1) return "INF";
  if (age <= 4) return "C03";
  if (age <= 11) return "C07";
  return "ADT";
}
