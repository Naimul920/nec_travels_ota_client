export type RecentSearchTripType = "oneway" | "roundtrip" | "multicity";

export interface RecentSearchSegment {
  from: string;
  to: string;
  date: string;
  fromName?: string;
  toName?: string;
}

export interface RecentSearch {
  id: string;
  tripType: RecentSearchTripType;
  q: string;
  query: string;
  from?: string;
  to?: string;
  fromName?: string;
  toName?: string;
  date?: string;
  returnDate?: string;
  segments?: RecentSearchSegment[];
  adults?: number;
  children?: number;
  kids?: number;
  infants?: number;
  cabin?: string;
  searchedAt: number;
}

const STORAGE_KEY = "nec_flight_last_search";

export function getLastSearch(): RecentSearch | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function saveLastSearch(record: RecentSearch): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // storage full/private mode: fail silently
  }
}

export function clearLastSearch(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage full/private mode: fail silently
  }
}