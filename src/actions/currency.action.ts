"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface CurrencyItem {
  id: string;
  code: string;
  name: string;
  symbol: string;
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

export async function detectUserCurrencyCode(): Promise<
  { country_code?: string } | null
> {
  try {
    const res = await httpClient.get<{ country_code?: string }>(
      "https://ipwho.is/",
    );
    return res.data;
  } catch {
    return null;
  }
}
