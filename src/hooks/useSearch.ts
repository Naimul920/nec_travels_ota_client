import { useMemo } from "react";

type SearchableRecord = Record<string, unknown>;

const useSearch = <T extends SearchableRecord>(
  dataList: T[] | null,
  queryString: string, // 1. Passed down cleanly via useSearchParams().toString() from the consumer
): T[] => {
  return useMemo(() => {
    if (!dataList || dataList.length === 0) {
      return [];
    }

    // 2. Safely executes inside Next.js environment context
    const searchParams = new URLSearchParams(queryString);

    const search = searchParams.get("search")?.toLowerCase() || "";
    const travelDate = searchParams.get("travel_date") || "";

    if (!search && !travelDate) {
      return dataList;
    }

    let filteredData = [...dataList];

    // Filter by Travel Date
    if (travelDate) {
      filteredData = filteredData.filter((item) =>
        String(item?.travel_date ?? "").includes(travelDate),
      );
    }

    // Deep string matching fuzzy global search
    if (search) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((value) => {
          if (value == null) return false;

          if (typeof value === "string" || typeof value === "number") {
            return value.toString().toLowerCase().includes(search);
          }

          return false;
        }),
      );
    }

    return filteredData;
  }, [dataList, queryString]);
};

export default useSearch;
