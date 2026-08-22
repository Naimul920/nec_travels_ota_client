"use client"; // 1. Set explicit Client Component boundary line for stateful filters

import React, { useCallback, useEffect, useMemo, useState } from "react";
// 2. Swapped React Router Hook for Next.js App Router Native Hook Engine
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { NotFound } from "@/components/ui";
import FlightSearchSummary from "@/components/modules/flight/FlightSearchSummary/FlightSearchSummary";
import SearchHeaderFilter from "@/components/modules/flight/Filter/SearchHeaderFilter/SearchHeaderFilter";
import SideBarFilter from "@/components/modules/flight/Filter/SidebarFilter/SideBarFilter";
import { IoFilterSharp, IoClose } from "react-icons/io5";
import FlightCard from "@/components/modules/flight/Card/FlightCard";
import FlightSearchSkeleton from "@/components/modules/flight/Card/FlightSearchSkeleton";
import SearchCountdown from "@/components/modules/flight/Card/SearchCountdown";
import { useFlightSearchMutation } from "@/hooks/useFlightApi";
import { decoding, storeSearchExpiry, encoding, getItineraryMaxStops } from "@/utils";
import type {
  Itinerary,
  SearchPayload,
  Schedule,
} from "../../../../interface/flight";

function timeToMinutes(timeStr: string): number {
  const match = timeStr.match(/^(\d{2}):(\d{2})/);
  if (!match) return 0;
  return parseInt(match[1]) * 60 + parseInt(match[2]);
}

export interface FilterState {
  airlines: string[];
  stops: number[];
  refundable: boolean[];
  departureRange: [number, number];
  arrivalRange: [number, number];
}

const FlightSearch: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    airlines: [],
    stops: [],
    refundable: [],
    departureRange: [0, 1440],
    arrivalRange: [0, 1440],
  });

  // 3. Extracted query data using Next.js 16 Search Parameters Parser
  const searchParamsHook = useSearchParams();
  const rawQParam = searchParamsHook.get("q") || "";
  const decode = decoding(rawQParam);

  const searchParams = useMemo(
    () => new URLSearchParams(decode as string),
    [decode],
  );

  const tripType = searchParams.get("tripType");

  const isTripTypeValid = useMemo(() => {
    return ["oneway", "roundtrip", "multicity"].includes(tripType ?? "");
  }, [tripType]);

  const {
    mutate: flightSearch,
    data,
    isPending,
    isError,
  } = useFlightSearchMutation();

  const payload: SearchPayload | null = useMemo(() => {
    if (!tripType) return null;

    const adult = Number(searchParams.get("adult") || 1);
    const child = Number(searchParams.get("child") || 0);
    const kid = Number(searchParams.get("kid") || 0);
    const infant = Number(searchParams.get("infant") || 0);
    const flight_class = (searchParams.get("cabin") || "economy").toLowerCase();

    // if (tripType === "multicity") {
    //   const segmentsStr = searchParams.get("segments");
    //   const segments =
    //     segmentsStr?.split(",").map((seg) => {
    //       const [from, to, start_date] = seg.split("-");
    //       return { from, to, start_date };
    //     }) || [];
    //   return {
    //     flight: "multicity",
    //     no_of_adult: adult,
    //     no_of_children: child,
    //     no_of_kids: kid,
    //     no_of_infant: infant,
    //     flight_class,
    //     segments,
    //   };
    // }

    if (tripType === "multicity") {
      const segmentsStr = searchParams.get("segments");
      const segments =
        segmentsStr?.split(",").map((seg) => {
          const parts = seg.split("-");
          const from = parts[0];
          const to = parts[1];
          const start_date = parts.slice(2).join("-"); // rejoin the date parts
          return { from, to, start_date };
        }) || [];
      return {
        flight: "multicity",
        no_of_adult: adult,
        no_of_children: child,
        no_of_kids: kid,
        no_of_infant: infant,
        flight_class,
        segments,
      };
    }

    if (tripType === "roundtrip") {
      return {
        flight: "roundtrip",
        from: searchParams.get("from") || "",
        to: searchParams.get("to") || "",
        start_date: searchParams.get("date") || "",
        return_date: searchParams.get("returnDate") || "",
        no_of_adult: adult,
        no_of_children: child,
        no_of_kids: kid,
        no_of_infant: infant,
        flight_class,
      };
    }

    return {
      flight: "oneway",
      from: searchParams.get("from") || "",
      to: searchParams.get("to") || "",
      start_date: searchParams.get("date") || "",
      no_of_adult: adult,
      no_of_children: child,
      no_of_kids: kid,
      no_of_infant: infant,
      flight_class,
    };
  }, [tripType, searchParams]);

  useEffect(() => {
    if (payload) {
      flightSearch(payload);
    }
  }, [payload, flightSearch]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sidebarOpen]);

  // 4. Tracks Next.js native param instances string changes to reset standard layouts
  const searchParamsString = searchParamsHook.toString();
  useEffect(() => {
    setFilters({
      airlines: [],
      stops: [],
      refundable: [],
      departureRange: [0, 1440],
      arrivalRange: [0, 1440],
    });
  }, [searchParamsString]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allItins = data?.data?.itinDetails ?? [];

  useEffect(() => {
    if (data?.data?.searchId) {
      storeSearchExpiry(data.data.searchId, data.data.expiresAt);
    }
  }, [data]);

  const carrierCodes = useMemo(() => {
    const codes = new Set<string>();
    allItins.forEach((itin: any) => {
      itin?.flightDetails?.forEach((fd: any) => {
        fd?.schedules?.forEach((s: Schedule) => {
          codes.add(s.marketingCarrierCode);
        });
      });
    });
    return Array.from(codes).sort();
  }, [allItins]);

  const filteredFlights = useMemo(() => {
    let list = allItins;
    if (filters.airlines.length > 0) {
      list = list.filter((itin: any) =>
        itin?.flightDetails?.some((fd: any) =>
          fd?.schedules?.some((s: Schedule) =>
            filters.airlines.includes(s.marketingCarrierCode),
          ),
        ),
      );
    }
    if (filters.refundable.length > 0) {
      list = list.filter((itin: any) =>
        filters.refundable.includes(Boolean(itin?.isRefundable)),
      );
    }
    if (filters.stops.length > 0) {
      list = list.filter(
        (itin: any) =>
          itin &&
          filters.stops.some((stop) => {
            const max = getItineraryMaxStops(itin);
            // value 2 acts as a "2+ stops" bucket
            return stop === 2 ? max >= 2 : max === stop;
          }),
      );
    }
    if (filters.departureRange[0] > 0 || filters.departureRange[1] < 1440) {
      list = list.filter((itin: any) =>
        itin?.flightDetails?.some((fd: any) =>
          fd?.schedules?.some((s: Schedule) => {
            const dep = timeToMinutes(s.departure.time);
            return (
              dep >= filters.departureRange[0] &&
              dep <= filters.departureRange[1]
            );
          }),
        ),
      );
    }
    if (filters.arrivalRange[0] > 0 || filters.arrivalRange[1] < 1440) {
      list = list.filter((itin: any) =>
        itin?.flightDetails?.some((fd: any) =>
          fd?.schedules?.some((s: Schedule) => {
            const arr = timeToMinutes(s.arrival.time);
            return (
              arr >= filters.arrivalRange[0] && arr <= filters.arrivalRange[1]
            );
          }),
        ),
      );
    }
    return list;
  }, [allItins, filters]);

  const totalFlights = filteredFlights.length;
  const activeFilterCount =
    filters.airlines.length +
    filters.stops.length +
    filters.refundable.length +
    Number(filters.departureRange[0] > 0 || filters.departureRange[1] < 1440) +
    Number(filters.arrivalRange[0] > 0 || filters.arrivalRange[1] < 1440);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleAirlineSelect = useCallback((code: string | null) => {
    setFilters((prev) => ({
      ...prev,
      airlines: code ? [code] : [],
    }));
  }, []);

  const router = useRouter();
  const pathname = usePathname();
  const isB2B = pathname.startsWith("/console/b2b");

  const departureDate = searchParams.get("date");
  const returnDate = searchParams.get("returnDate");

  const multicityDates = useMemo(() => {
    if (tripType !== "multicity") return { first: "", last: "" };
    const segmentsStr = searchParams.get("segments") || "";
    const dates = segmentsStr.split(",").map((seg) => {
      const parts = seg.split("-");
      return parts.slice(2).join("-");
    });
    return {
      first: dates[0] || "",
      last: dates[dates.length - 1] || "",
    };
  }, [tripType, searchParams]);

  const handleDateStep = useCallback(
    (leg: "departure" | "return", direction: number) => {
      if (!tripType) return;
      const updated = new URLSearchParams(searchParams.toString());

      if (tripType === "multicity") {
        const segmentsStr = updated.get("segments");
        if (!segmentsStr) return;
        const segments = segmentsStr.split(",").map((seg) => {
          const parts = seg.split("-");
          return {
            from: parts[0],
            to: parts[1],
            start_date: parts.slice(2).join("-"),
          };
        });
        if (segments.length === 0) return;
        const targetIdx =
          leg === "return" && segments.length > 1
            ? segments.length - 1
            : 0;
        const current = dayjs(segments[targetIdx].start_date);
        const nextDate = (current.isValid() ? current : dayjs())
          .add(direction, "day")
          .format("YYYY-MM-DD");
        segments[targetIdx].start_date = nextDate;
        updated.set(
          "segments",
          segments
            .map((s) => `${s.from}-${s.to}-${s.start_date}`)
            .join(","),
        );
      } else {
        const key = leg === "return" ? "returnDate" : "date";
        const current = dayjs(searchParams.get(key));
        const nextDate = (current.isValid() ? current : dayjs())
          .add(direction, "day")
          .format("YYYY-MM-DD");
        updated.set(key, nextDate);
      }

      router.push(`${pathname}?q=${encoding(updated.toString())}`);
    },
    [tripType, searchParams, pathname, router],
  );

  const minPrice = useMemo(() => {
    if (allItins.length === 0) return 0;
    const fares = allItins
      .map((i: any) => i.saleCurrencyAmount?.offerAmount ?? i.saleCurrencyAmount?.totalAmount)
      .filter((f): f is number => typeof f === "number" && Number.isFinite(f));
    return fares.length ? Math.min(...fares) : 0;
  }, [allItins]);

  if (!isTripTypeValid) {
    return (
      <NotFound
        title="Something went wrong"
        description="Oh Snap! We're working on fixing the issue."
        showReload
        // 5. Handled window reload check via global safe execution blocks to prevent server compile crashes
        onReload={() => {
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/80 pb-12" id="mainScrollContainer">
      <div className="mx-auto w-full max-w-[1440px] px-3 py-4 sm:px-5 lg:px-8">
        <FlightSearchSummary />

        {isPending && <FlightSearchSkeleton cardCount={3} />}

      {!isPending && (
        <>
          <div className="mb-4 flex min-h-16 flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#12233D] transition hover:border-brand hover:text-brand lg:hidden"
            >
              <IoFilterSharp aria-hidden="true" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">Search results</p>
                <h2 className="mt-0.5 text-sm font-bold text-[#12233D] sm:text-base">
                {isPending
                  ? "Searching..."
                  : `${totalFlights} Available Flights`}
                </h2>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <SearchCountdown expiresAt={data?.data?.expiresAt} />
                {isB2B ? (
                  <label className="flex cursor-pointer select-none items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                      <input
                        type="checkbox"
                        checked={showDiscounted}
                        onChange={(e) => setShowDiscounted(e.target.checked)}
                        className="h-4 w-4 accent-brand"
                      />
                      Discounted fare
                  </label>
                ) : (
                  <p className="hidden text-xs font-medium text-slate-500 sm:block">
                    <span className="text-brand">*</span> Includes VAT and tax
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5">
            <aside className="col-span-3 hidden lg:block xl:col-span-3">
              <div className="custom-scrollbar sticky top-16 max-h-[calc(100vh-5rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <SideBarFilter
                  allItins={allItins}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  carrierCodes={carrierCodes}
                  minPrice={minPrice}
                  tripType={tripType ?? ""}
                  departureDate={departureDate ?? multicityDates.first}
                  returnDate={returnDate ?? multicityDates.last}
                  onDateStep={handleDateStep}
                />
              </div>
            </aside>

            {sidebarOpen && (
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-[1px] lg:hidden"
              />
            )}

            <aside
              aria-label="Flight filters"
              className={`fixed left-0 top-0 z-50 h-dvh w-[min(90vw,380px)] overflow-hidden bg-white shadow-2xl lg:hidden
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
              <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand">Refine results</p>
                  <h3 className="text-sm font-bold text-[#12233D]">Flight filters</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close flight filters"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                >
                  <IoClose size={20} aria-hidden="true" />
                </button>
              </div>
              <div className="custom-scrollbar h-[calc(100%-4rem)] overflow-y-auto">
                <SideBarFilter
                  allItins={allItins}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  carrierCodes={carrierCodes}
                  minPrice={minPrice}
                  tripType={tripType ?? ""}
                  departureDate={departureDate ?? multicityDates.first}
                  returnDate={returnDate ?? multicityDates.last}
                  onDateStep={handleDateStep}
                />
              </div>
            </aside>

            <section className="col-span-12 min-w-0 lg:col-span-9 xl:col-span-9">
              <div className="sticky top-0 z-20 pb-3">
                <SearchHeaderFilter
                  carrierCodes={carrierCodes}
                  allItins={allItins}
                  selectedCode={filters.airlines[0] || null}
                  onSelect={handleAirlineSelect}
                />
              </div>

              {isError && (
                <div className="rounded-2xl border border-rose-200 bg-white px-6 py-14 text-center shadow-sm">
                  <p className="text-base font-bold text-rose-600">We couldn’t load these flights</p>
                  <p className="mt-2 text-sm text-slate-500">Please refresh the page or modify your search and try again.</p>
                </div>
              )}

              {!isPending && !isError && totalFlights === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                  <p className="text-base font-bold text-[#12233D]">No matching flights found</p>
                  <p className="mt-2 text-sm text-slate-500">Try clearing some filters or changing your travel dates.</p>
                </div>
              )}

              {!isPending && !isError && totalFlights > 0 && (
                <div className="space-y-4">
                  {filteredFlights.map(
                    (itinerary: Itinerary, filteredIndex: number) => (
                      <FlightCard
                        key={filteredIndex}
                        itinerary={itinerary}
                        index={allItins.indexOf(itinerary)}
                        searchId={data?.data?.searchId ?? ""}
                        passengerCount={{
                          adult: data?.data?.noOfAdult ?? 0,
                          child: data?.data?.noOfChildren ?? 0,
                          kid: data?.data?.noOfKids ?? 0,
                          infant: data?.data?.noOfInfant ?? 0,
                        }}
                        showDiscount={showDiscounted}
                      />
                    ),
                  )}
                </div>
              )}
            </section>
          </div>
        </>
      )}
      </div>
    </main>
  );
};

export default FlightSearch;
