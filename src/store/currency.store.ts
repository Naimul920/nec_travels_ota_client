import { create } from "zustand";
import {
  getCurrenciesAction,
  detectUserCurrencyCode,
  type CurrencyItem,
  type UserGeo,
} from "@/actions/currency.action";

const COUNTRY_CURRENCY: Record<string, string> = {
  BD: "BDT",
  US: "USD",
  GB: "GBP",
  DE: "EUR",
  FR: "EUR",
  ES: "EUR",
  IT: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  PT: "EUR",
  IE: "EUR",
  FI: "EUR",
  GR: "EUR",
  IN: "INR",
  PK: "PKR",
  NP: "NPR",
  LK: "LKR",
  MY: "MYR",
  SG: "SGD",
  AE: "AED",
  SA: "SAR",
  QA: "QAR",
  OM: "OMR",
  JP: "JPY",
  CN: "CNY",
  AU: "AUD",
  CA: "CAD",
};

const COUNTRY_DIAL: Record<string, string> = {
  BD: "+880",
  US: "+1",
  CA: "+1",
  GB: "+44",
  AU: "+61",
  IN: "+91",
  PK: "+92",
  NP: "+977",
  LK: "+94",
  MY: "+60",
  SG: "+65",
  AE: "+971",
  SA: "+966",
  QA: "+974",
  OM: "+968",
  JP: "+81",
  CN: "+86",
  DE: "+49",
  FR: "+33",
  IT: "+39",
  ES: "+34",
  NL: "+31",
  BE: "+32",
};

export function getCurrencyCodeByCountry(
  countryCode?: string,
): string | undefined {
  if (!countryCode) return undefined;
  return COUNTRY_CURRENCY[countryCode.toUpperCase()];
}

export function getPhoneCodeByCountry(countryCode?: string): string {
  if (!countryCode) return "+880";
  return COUNTRY_DIAL[countryCode.toUpperCase()] || "+880";
}

interface CurrencyState {
  currencies: CurrencyItem[];
  currenciesLoading: boolean;
  geo: UserGeo | null;
  geoLoading: boolean;
  initialized: boolean;
  selectedCurrencyId: string;
  selectedCurrencyCode: string;
  phoneCode: string;

  initialize: () => Promise<void>;
  setSelectedCurrency: (id: string, code: string) => void;
}

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currencies: [],
  currenciesLoading: false,
  geo: null,
  geoLoading: false,
  initialized: false,
  selectedCurrencyId: "",
  selectedCurrencyCode: "",
  phoneCode: "+880",

  initialize: async () => {
    if (get().initialized) return;

    set({ currenciesLoading: true, geoLoading: true });

    const [currencies, geo] = await Promise.all([
      getCurrenciesAction(),
      detectUserCurrencyCode(),
    ]);

    const countryCode = geo?.countryCode;
    const currencyCode = getCurrencyCodeByCountry(countryCode) || "BDT";
    const match = currencies.find((c) => c.code === currencyCode);
    const selected =
      match ||
      currencies.find((c) => c.code === "BDT") ||
      currencies[0] ||
      null;

    set({
      currencies,
      geo,
      currenciesLoading: false,
      geoLoading: false,
      initialized: true,
      phoneCode: getPhoneCodeByCountry(countryCode),
      selectedCurrencyId: selected?.id || "",
      selectedCurrencyCode: selected?.code || currencyCode,
    });
  },

  setSelectedCurrency: (id, code) =>
    set({ selectedCurrencyId: id, selectedCurrencyCode: code }),
}));
