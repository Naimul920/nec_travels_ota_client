"use client";

import { useEffect } from "react";
import { useUserCountryInfoStore } from "@/store/user_country.store";

export default function CurrencyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialize = useUserCountryInfoStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}