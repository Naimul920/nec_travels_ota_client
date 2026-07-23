"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FlightState {
  flight: {
    isModifySearch: boolean;
  };
}

interface FlightActions {
  modifySearch: () => void;
}

const initialState: FlightState = {
  flight: {
    isModifySearch: false,
  },
};

export const useFlightStore = create<FlightState & FlightActions>()(
  persist(
    (set) => ({
      ...initialState,
      modifySearch: () =>
        set((state) => ({
          flight: { isModifySearch: !state.flight.isModifySearch },
        })),
    }),
    {
      name: "flight-storage",
    },
  ),
);

export const modifySearch = () => useFlightStore.getState().modifySearch();