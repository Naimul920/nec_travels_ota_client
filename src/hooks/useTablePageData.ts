"use client";

import { useEffect, useState } from "react";
import {
  generateSampleData,
  type CrudPageConfig,
} from "@/constant/crudPages";

interface SampleDataState {
  data: Record<string, unknown>[];
  loading: boolean;
}

/**
 * Simulates an asynchronous API fetch for a table page. While "loading",
 * the shared Table shows its skeleton loader. Replace with real API calls
 * (useQuery / server action) and remove the timeout to use live data.
 */
export const useTablePageData = (
  config: CrudPageConfig,
  delay = 900,
): SampleDataState => {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(generateSampleData(config));
      setLoading(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [config, delay]);

  return { data, loading };
};