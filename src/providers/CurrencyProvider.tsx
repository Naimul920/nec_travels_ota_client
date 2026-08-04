"use client";

import { useEffect } from "react";
import { useCurrencyStore } from "@/store/currency.store";

export default function CurrencyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialize = useCurrencyStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}