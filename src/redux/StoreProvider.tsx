"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import Loader from "@/components/common/Loader/Loader";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
      {/* <PersistGate loading={<Loader />} persistor={persistor}> */}
        {children}
      </PersistGate>
    </Provider>
  );
}
