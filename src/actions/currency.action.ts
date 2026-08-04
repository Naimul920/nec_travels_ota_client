"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface CurrencyItem {
  id: string;
  code: string;
  name: string;
  symbol: string;
}

export interface UserGeo {
  status?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  isp?: string;
  org?: string;
  as?: string;
  query?: string;
}

export async function getCurrenciesAction(): Promise<CurrencyItem[]> {
  try {
    const res = await httpClient.get<CurrencyItem[]>("/api/v1/currency");
    return res.data || [];
  } catch (error) {
    console.error("Failed to load currencies:", error);
    return [];
  }
}

// export async function detectUserCurrencyCode(): Promise<UserGeo | null> {
//   try {
//     const res = await httpClient.get<UserGeo>(
//       "https://pro.ip-api.com/json/?key=ygX4gRsbNbvVHAu",
//     );
//     console.log("User Geo Data:", res.data);
//     return res.data;
//   } catch {
//     return null;
//   }
// }

export async function detectUserCurrencyCode(): Promise<UserGeo | null> {
  try {
    const response = await httpClient.get<UserGeo>(
      "https://pro.ip-api.com/json/?key=ygX4gRsbNbvVHAu",
    );
    return response as unknown as UserGeo;
  } catch (error) {
    console.error("Failed to detect user currency:", error);
    return null;
  }
}
