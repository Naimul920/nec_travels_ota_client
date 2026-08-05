const EXPIRY_PREFIX = "flight_search_expiry_";

export const storeSearchExpiry = (searchId: string, expiresAt?: string) => {
  if (typeof window === "undefined" || !searchId || !expiresAt) return;
  sessionStorage.setItem(EXPIRY_PREFIX + searchId, expiresAt);
};

export const getSearchExpiry = (searchId?: string): string | null => {
  if (typeof window === "undefined" || !searchId) return null;
  return sessionStorage.getItem(EXPIRY_PREFIX + searchId);
};

export const clearSearchExpiry = (searchId?: string) => {
  if (typeof window === "undefined" || !searchId) return;
  sessionStorage.removeItem(EXPIRY_PREFIX + searchId);
};
