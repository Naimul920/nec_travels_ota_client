import { create } from "zustand";
import {
  detectUserCountry,
  type UserGeo,
} from "@/actions/currency.action";
import countryCodes from "@/constant/countryCodes.json";

interface CountryInfo {
  currency: string;
  dial: string;
}

const COUNTRY_CODES = countryCodes as Record<string, CountryInfo>;

export function getCurrencyCodeByCountry(
  countryCode?: string,
): string | undefined {
  if (!countryCode) return undefined;
  return COUNTRY_CODES[countryCode.toUpperCase()]?.currency;
}

export function getPhoneCodeByCountry(countryCode?: string): string {
  if (!countryCode) return "+880";
  return COUNTRY_CODES[countryCode.toUpperCase()]?.dial || "+880";
}

interface CurrencyState {
  geo: UserGeo | null;
  geoLoading: boolean;
  initialized: boolean;
  selectedCurrencyCode: string;
  phoneCode: string;

  initialize: () => Promise<void>;
}

export const useUserCountryInfoStore = create<CurrencyState>((set, get) => ({
  geo: null,
  geoLoading: false,
  initialized: false,
  selectedCurrencyCode: "",
  phoneCode: "+880",

  initialize: async () => {
    if (get().initialized) return;

    set({ geoLoading: true });

    const geo = await detectUserCountry();
    const countryCode = geo?.countryCode;

    set({
      geo,
      geoLoading: false,
      initialized: true,
      phoneCode: getPhoneCodeByCountry(countryCode),
      selectedCurrencyCode: getCurrencyCodeByCountry(countryCode) || "",
    });
  },
}));



