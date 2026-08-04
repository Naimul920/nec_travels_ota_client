import dayjs from "dayjs";

export type PassengerTypeCode = "ADT" | "C03" | "C07" | "INF";

export const AGE_RANGES: Record<
  "adult" | "child" | "kid" | "infant",
  { min: number | null; max: number | null; label: string }
> = {
  adult: { min: 12, max: null, label: "12 years & above" },
  child: { min: 2, max: 11, label: "5 to under 12" },
  kid: { min: 2, max: 11, label: "2 to under 5" },
  infant: { min: null, max: 1, label: "Under 2" },
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

export function getPassengerTypeByAge(age: number | null): PassengerTypeCode {
  if (age === null) return "ADT";
  if (age < 2) return "INF";
  if (age <= 6) return "C03";
  if (age <= 11) return "C07";
  return "ADT";
}
