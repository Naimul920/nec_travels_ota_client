import { create } from "zustand";
import {
  getCurrenciesAction,
  type CurrencyItem,
} from "@/actions/currency.action";

interface SystemCurrenciesState {
  currencies: CurrencyItem[];
  loading: boolean;
  error: string | null;
  initialized: boolean;

  initialize: () => Promise<void>;
}

export const useGetSystemCurrencies = create<SystemCurrenciesState>(
  (set, get) => ({
    currencies: [],
    loading: false,
    error: null,
    initialized: false,

    initialize: async () => {
      if (get().initialized) return;

      set({ loading: true, error: null });

      try {
        const currencies = await getCurrenciesAction();
        set({
          currencies,
          loading: false,
          initialized: true,
        });
      } catch (error: any) {
        set({
          error: error?.message || "Failed to load currencies",
          loading: false,
          initialized: true,
        });
      }
    },
  }),
);
