"use client";

import { useEffect } from "react";
import { useGeoStore } from "@/store/geo.store";

export default function GeoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialize = useGeoStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
