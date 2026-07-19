"use client"; // 1. Set explicit Client Component boundary line for stateful filters

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useState } from "react";
// 2. Swapped React Router Hook for Next.js App Router Native Hook Engine
import { useSearchParams } from "next/navigation";
import NotFound from "@/components/flight/NotFound/NotFound";
import FlightSearchSummary from "@/components/flight/FlightSearchSummary/FlightSearchSummary";
import SearchHeaderFilter from "@/components/flight/Filter/SearchHeaderFilter/SearchHeaderFilter";
import SideBarFilter from "@/components/flight/Filter/SidebarFilter/SideBarFilter";
import { Button } from "@/components/ui";
import { IoFilterSharp, IoClose } from "react-icons/io5";
import FlightCard from "@/components/flight/Card/FlightCard";
import { useFlightSearchMutation } from "@/redux/api/flight/flightApiSlice";
import { decoding } from "@/utils";
import type {
  Itinerary,
  SearchPayload,
  Schedule,
} from "../../../interface/flight";
import InfiniteScroll from "react-infinite-scroll-component";

const PAGE_SIZE = 5;

function timeToMinutes(timeStr: string): number {
  const match = timeStr.match(/^(\d{2}):(\d{2})/);
  if (!match) return 0;
  return parseInt(match[1]) * 60 + parseInt(match[2]);
}

export interface FilterState {
  airlines: string[];
  stops: number[];
  departureRange: [number, number];
  arrivalRange: [number, number];
}

const FlightSearch: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [filters, setFilters] = useState<FilterState>({
    airlines: [],
    stops: [],
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

  const [flightSearch, { data, isLoading, isError }] =
    useFlightSearchMutation();

  const payload: SearchPayload | null = useMemo(() => {
    if (!tripType) return null;

    const adult = Number(searchParams.get("adult") || 1);
    const child = Number(searchParams.get("child") || 0);
    const kid = Number(searchParams.get("kid") || 0);
    const infant = Number(searchParams.get("infant") || 0);
    const flight_class = (searchParams.get("cabin") || "economy").toLowerCase();

    if (tripType === "multicity") {
      const segmentsStr = searchParams.get("segments");
      const segments =
        segmentsStr?.split(",").map((seg) => {
          const [from, to, start_date] = seg.split("-");
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
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
  }, [sidebarOpen]);

  // 4. Tracks Next.js native param instances string changes to reset standard layouts
  const searchParamsString = searchParamsHook.toString();
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setFilters({
      airlines: [],
      stops: [],
      departureRange: [0, 1440],
      arrivalRange: [0, 1440],
    });
  }, [searchParamsString]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allItins = data?.data?.itinDetails ?? [];

  const carrierCodes = useMemo(() => {
    const codes = new Set<string>();
    allItins.forEach((itin: any) => {
      itin.flightDetails.forEach((fd: any) => {
        fd.schedules.forEach((s: Schedule) => {
          codes.add(s.marketingCarrierCode);
        });
      });
    });
    return Array.from(codes).sort();
  }, [allItins]);

  const stopOptions = useMemo(() => {
    const stops = new Set<number>();
    allItins.forEach((itin: any) => {
      itin.flightDetails.forEach((fd: any) => {
        fd.schedules.forEach((s: Schedule) => {
          stops.add(s.stopCount);
        });
      });
    });
    return Array.from(stops).sort();
  }, [allItins]);

  const filteredFlights = useMemo(() => {
    let list = allItins;
    if (filters.airlines.length > 0) {
      list = list.filter((itin: any) =>
        itin.flightDetails.some((fd: any) =>
          fd.schedules.some((s: Schedule) =>
            filters.airlines.includes(s.marketingCarrierCode),
          ),
        ),
      );
    }
    if (filters.stops.length > 0) {
      list = list.filter((itin: any) =>
        itin.flightDetails.some((fd: any) =>
          fd.schedules.some((s: Schedule) =>
            filters.stops.includes(s.stopCount),
          ),
        ),
      );
    }
    if (filters.departureRange[0] > 0 || filters.departureRange[1] < 1440) {
      list = list.filter((itin: any) =>
        itin.flightDetails.some((fd: any) =>
          fd.schedules.some((s: Schedule) => {
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
        itin.flightDetails.some((fd: any) =>
          fd.schedules.some((s: Schedule) => {
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
  const paginatedFlights = filteredFlights.slice(0, visibleCount);

  const fetchMoreFlights = useCallback(() => {
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
    }, 300);
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleAirlineSelect = useCallback((code: string | null) => {
    setFilters((prev) => ({
      ...prev,
      airlines: code ? [code] : [],
    }));
    setVisibleCount(PAGE_SIZE);
  }, []);

  const minPrice = useMemo(() => {
    if (allItins.length === 0) return 0;
    return Math.min(
      ...allItins.map((i: any) => i.saleCurrencyAmount.totalFare),
    );
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
    <div className="mx-4 md:mx-0" id="mainScrollContainer">
      <FlightSearchSummary />

      <div className="flex items-center justify-between mb-2">
        <Button
          onClick={() => setSidebarOpen(true)}
          className="bg-transparent text-black! p-0! md:hidden"
        >
          <IoFilterSharp size={15} />
        </Button>

        <h3 className="md:text-sm text-xs font-semibold">
          {isLoading ? "Searching..." : `${totalFlights} Available Flights`}
        </h3>

        <p className="md:text-sm text-xs">
          <sup className="text-secondary">*</sup>Price Includes VAT & Tax
        </p>
      </div>

      <div className="grid grid-cols-12 md:gap-5">
        <div className="lg:col-span-2 hidden lg:block ">
          <div className="bg-white shadow rounded-b-sm sticky top-0 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <SideBarFilter
              allItins={allItins}
              filters={filters}
              onFilterChange={handleFilterChange}
              carrierCodes={carrierCodes}
              stopOptions={stopOptions}
              minPrice={minPrice}
            />
          </div>
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden pointer-events-none" />
        )}

        <div
          className={`fixed top-0 left-0 h-full w-full bg-white z-99 md:hidden overflow-y-scroll
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-sm">Filter Flights</h3>
            <Button
              onClick={() => setSidebarOpen(false)}
              className="bg-transparent text-secondary! p-0"
            >
              <IoClose size={22} />
            </Button>
          </div>
          <div className="overflow-y-auto h-[calc(100%-56px)] custom-scrollbar">
            <SideBarFilter
              allItins={allItins}
              filters={filters}
              onFilterChange={handleFilterChange}
              carrierCodes={carrierCodes}
              stopOptions={stopOptions}
              minPrice={minPrice}
            />
          </div>
        </div>

        <div className="lg:col-span-10 col-span-12">
          <div className="sticky top-0 z-10">
            <SearchHeaderFilter
              carrierCodes={carrierCodes}
              allItins={allItins}
              selectedCode={filters.airlines[0] || null}
              onSelect={handleAirlineSelect}
            />
          </div>

          {isLoading && (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          )}

          {isError && (
            <div className="text-center py-10 text-red-500 text-sm">
              Failed to load flights. Please try again.
            </div>
          )}

          {!isLoading && !isError && totalFlights === 0 && (
            <div className="text-center py-10 text-gray-500 text-sm">
              No flights found for this search.
            </div>
          )}

          {!isLoading && !isError && totalFlights > 0 && (
            <InfiniteScroll
              dataLength={visibleCount}
              next={fetchMoreFlights}
              hasMore={visibleCount < filteredFlights.length}
              scrollableTarget="mainScrollContainer"
              loader={
                <p className="text-center text-xs py-3">
                  Loading more flights...
                </p>
              }
              endMessage={
                <p className="text-center text-xs py-3 text-gray-400">
                  No more flights available
                </p>
              }
            >
              <div className="py-2 space-y-2">
                {paginatedFlights.map((itinerary: Itinerary, index: number) => (
                  <FlightCard
                    key={index}
                    itinerary={itinerary}
                    passengerCount={{
                      adult: data?.data?.noOfAdult ?? 0,
                      child: data?.data?.noOfChildren ?? 0,
                      kid: data?.data?.noOfKids ?? 0,
                      infant: data?.data?.noOfInfant ?? 0,
                    }}
                  />
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
