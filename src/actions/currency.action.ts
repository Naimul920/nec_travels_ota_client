"use server";

import { getCountryApiKey } from "@/constant";
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
    console.log("get currency from my server",res)
    return res.data || [];
  } catch (error) {
    console.error("Failed to load currencies:", error);
    return [];
  }
}

export async function detectUserCountry(): Promise<UserGeo | null> {
  try {
    const response = await httpClient.get<UserGeo>(
      `https://pro.ip-api.com/json/?key=${getCountryApiKey}`,
    );
    console.log("response**************",response)
    return response as unknown as UserGeo;
  } catch (error) {
    console.error("Failed to detect user currency:", error);
    return null;
  }
}
