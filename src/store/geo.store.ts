"use client";

import { create } from "zustand";

export interface GeoInfo {
  as?: string;
  asname?: string;
  city?: string;
  continent?: string;
  continentCode?: string;
  country?: string;
  countryCode?: string;
  currency?: string;
  district?: string;
  hosting?: boolean;
  isp?: string;
  lat?: number;
  lon?: number;
  mobile?: boolean;
  offset?: number;
  org?: string;
  proxy?: boolean;
  query?: string;
  region?: string;
  regionName?: string;
  reverse?: string;
  status?: string;
  timezone?: string;
  zip?: string;
}

interface GeoState {
  geo: GeoInfo | null;
  geoLoading: boolean;
  geoError: string | null;
  initialized: boolean;
  initialize: () => Promise<void>;
}

const GEO_API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/geo`;

export const useGeoStore = create<GeoState>((set, get) => ({
  geo: null,
  geoLoading: false,
  geoError: null,
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;
    set({ geoLoading: true, geoError: null });

    try {
      const res = await fetch(GEO_API_URL);
      if (!res.ok) {
        throw new Error(`Geo request failed with status ${res.status}`);
      }
      const json = await res.json();
      console.log("json*****************",json)
      const geo: GeoInfo | null = json?.data ?? null;
      set({ geo, geoLoading: false, initialized: true });
    } catch (error: any) {
      set({
        geo: null,
        geoLoading: false,
        geoError: error?.message || "Failed to detect user location",
        initialized: true,
      });
    }
  },
}));

export const getGeoCurrency = (geo: GeoInfo | null): string =>
  geo?.currency || "";

export const getGeoCountryCode = (geo: GeoInfo | null): string =>
  geo?.countryCode || "";