"use client";

import { Slider } from "antd";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { FilterState } from "@/components/modules/flight/FlightSearch/FlightSearch";
import type { Itinerary, Schedule } from "../../../../../interface/flight";
import { getItineraryMaxStops } from "@/utils/flightStops";
import { getAirlineName } from "@/utils/airline";

interface Props {
  allItins: Itinerary[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  carrierCodes: string[];
  minPrice: number;
  tripType: string;
  departureDate: string;
  returnDate: string;
  onDateStep: (leg: "departure" | "return", delta: number) => void;
}

const defaultRange: [number, number] = [0, 1440];

const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hour12 = h % 12 || 12;
  const ampm = h < 12 ? "AM" : "PM";
  return `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
};

const getDisplayFare = (itin: Itinerary): number =>
  itin.saleCurrencyAmount?.offerAmount ??
  itin.saleCurrencyAmount?.totalAmount ??
  0;

const formatDateLabel = (date: string): string => {
  if (!date) return "Select date";
  const d = dayjs(date);
  return d.isValid() ? d.format("ddd DD MMM YYYY") : date;
};

const DateStep: React.FC<{
  label: string;
  date: string;
  onStep: (delta: number) => void;
}> = ({ label, date, onStep }) => {
  const arrowClass =
    "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-brand hover:bg-brand/5 hover:text-brand";
  return (
    <div>
      <p className="mb-2 line-clamp-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <div className="flex items-center justify-between gap-2">
        <button type="button" className={arrowClass} onClick={() => onStep(-1)}>
          <LuChevronLeft size={16} />
        </button>
        <span className="flex-1 text-center text-xs font-bold text-[#12233D] line-clamp-1">
          {formatDateLabel(date)}
        </span>
        <button type="button" className={arrowClass} onClick={() => onStep(1)}>
          <LuChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

const SideBarFilter: React.FC<Props> = ({
  allItins,
  filters,
  onFilterChange,
  carrierCodes,
  tripType,
  departureDate,
  returnDate,
  onDateStep,
}) => {
  const update = (patch: Partial<FilterState>) => {
    onFilterChange({ ...filters, ...patch });
  };

  const toggle = <T,>(arr: T[], value: T): T[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const airlines = useMemo(() => {
    return carrierCodes.map((code: string) => {
      const matching = allItins.filter((itin) =>
        itin?.flightDetails?.some((fd) =>
          fd?.schedules?.some((s: Schedule) => s.marketingCarrierCode === code),
        ),
      );
      const minFare = matching.length
        ? Math.min(...matching.map((i) => getDisplayFare(i)))
        : 0;
      return { code, count: matching.length, minPrice: minFare };
    });
  }, [allItins, carrierCodes]);

  const stops = useMemo(() => {
    const buckets = [
      { value: 0, label: "Nonstop", test: (max: number) => max === 0 },
      { value: 1, label: "1 Stop", test: (max: number) => max === 1 },
      { value: 2, label: "2+ Stops", test: (max: number) => max > 1 },
    ];
    return buckets.map((bucket) => {
      const matching = allItins.filter((itin) =>
        bucket.test(getItineraryMaxStops(itin)),
      );
      const minFare = matching.length
        ? Math.min(...matching.map((i) => getDisplayFare(i)))
        : 0;
      return {
        value: bucket.value,
        label: bucket.label,
        total: matching.length,
        minPrice: minFare,
      };
    });
  }, [allItins]);

  const handleReset = () => {
    onFilterChange({
      airlines: [],
      stops: [],
      refundable: [],
      departureRange: defaultRange,
      arrivalRange: defaultRange,
    });
  };

  const hasActiveFilters =
    filters.airlines.length > 0 ||
    filters.stops.length > 0 ||
    filters.refundable.length > 0 ||
    filters.departureRange[0] > 0 ||
    filters.departureRange[1] < 1440 ||
    filters.arrivalRange[0] > 0 ||
    filters.arrivalRange[1] < 1440;

  const currency = allItins[0]?.passengerFareBreakDown[0]?.currency || "BDT";

  const showReturnDate = tripType === "roundtrip" || tripType === "multicity";

  return (
    <>
      <div className="hidden border-b border-slate-100 px-4 py-4 lg:block">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand">Refine results</p>
            <h3 className="mt-0.5 text-base font-bold text-[#12233D]">Flight filters</h3>
          </div>
          {hasActiveFilters && (
            <button type="button" onClick={handleReset} className="text-xs font-bold text-rose-500 hover:text-rose-600">Clear all</button>
          )}
        </div>
      </div>
 {/* Dates */}
      <div className="space-y-4 border-b border-slate-100 p-4">
        <DateStep
          label="Departure Date"
          date={departureDate}
          onStep={(delta) => onDateStep("departure", delta)}
        />
        {showReturnDate && (
          <DateStep
            label="Return Date"
            date={returnDate}
            onStep={(delta) => onDateStep("return", delta)}
          />
        )}
      </div>
      {/* Stops */}
      <div className="border-b border-slate-100 p-4">
        <table className="w-full filter-table">
          <thead>
            <tr className="text-xs font-bold text-[#12233D]">
              <th className="pb-3 text-left">Flight stops</th>
              {/* <th className="text-right pb-2">From</th> */}
            </tr>
          </thead>
          <tbody className="text-xs text-slate-600">
            {stops.map((item) => (
              <tr key={item.value}>
                <td className="py-1">
                  <label className="flex cursor-pointer items-center gap-2.5 py-1">
                    <input
                      type="checkbox" className="h-4 w-4 rounded accent-brand"
                      checked={filters.stops.includes(item.value)}
                      onChange={() =>
                        update({
                          stops: toggle(filters.stops, item.value),
                        })
                      }
                    />
                    <span className="line-clamp-1">
                      {item.label} <span className="text-slate-400">({item.total})</span>
                    </span>
                  </label>
                </td>
                <td className="text-right text-[11px] font-semibold text-slate-500 line-clamp-1">
                  {currency} {item.minPrice.toLocaleString()}
                </td>
              </tr>
            ))}
            {stops.length === 0 && (
              <tr>
                <td className="py-1 text-gray-400 text-xs">No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

     

      {/* Refundability */}
      <div className="border-b border-slate-100 p-4">
        <p className="mb-3 line-clamp-1 text-xs font-bold text-[#12233D]">
          Refundable
        </p>
        <div className="space-y-2">
          {[
            { value: true, label: "Refundable", total: allItins.filter((i) => i.isRefundable).length },
            { value: false, label: "Non-Refundable", total: allItins.filter((i) => !i.isRefundable).length },
          ].map((item) => (
            <label
              key={String(item.value)}
              className="flex cursor-pointer items-center gap-2.5 text-xs text-slate-600"
            >
              <input
                type="checkbox" className="h-4 w-4 rounded accent-brand"
                checked={filters.refundable.includes(item.value)}
                onChange={() =>
                  update({
                    refundable: toggle(filters.refundable, item.value),
                  })
                }
              />
              <span className="line-clamp-1">
                {item.label} <span className="text-slate-400">({item.total})</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Airlines */}
      <div className="border-b border-slate-100 p-4">
        <table className="w-full filter-table">
          <thead>
            <tr className="text-xs font-bold text-[#12233D]">
              <th className="pb-3 text-left">Airlines</th>
              <th className="pb-3 text-right">From</th>
            </tr>
          </thead>
          <tbody className="text-xs text-slate-600">
            {airlines.map((item) => (
              <tr key={item.code}>
                <td className="py-1">
                  <label className="flex cursor-pointer items-center gap-2.5 py-1">
                    <input
                      type="checkbox" className="h-4 w-4 rounded accent-brand"
                      checked={filters.airlines.includes(item.code)}
                      onChange={() =>
                        update({
                          airlines: toggle(filters.airlines, item.code),
                        })
                      }
                    />
                    <span className="line-clamp-1">
                      {item.code} - {getAirlineName(item.code)} ({item.count})
                    </span>
                  </label>
                </td>
                <td className="text-right text-[11px] font-semibold text-slate-500 line-clamp-1">
                  {currency} {item.minPrice.toLocaleString()}
                </td>
              </tr>
            ))}
            {airlines.length === 0 && (
              <tr>
                <td className="py-1 text-gray-400 text-xs">No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      

      {/* Departure Time */}
      <div className="border-b border-slate-100 p-4">
        <p className="mb-1 line-clamp-1 text-xs font-bold text-[#12233D]">
          Departure Time
        </p>
        <p className="my-3 line-clamp-1 rounded-lg bg-slate-50 px-2 py-1.5 text-center text-[11px] font-semibold text-slate-500">
          {formatTime(filters.departureRange[0])} -{" "}
          {formatTime(filters.departureRange[1])}
        </p>
        <Slider
          range
          min={0}
          max={1440}
          step={30}
          value={filters.departureRange}
          onChange={(value) =>
            update({ departureRange: value as [number, number] })
          }
          tooltip={{
            formatter: (value) => formatTime(value || 0),
          }}
        />
      </div>

      {/* Arrival Time */}
      <div className="border-b border-slate-100 p-4">
        <p className="mb-1 line-clamp-1 text-xs font-bold text-[#12233D]">
          Arrival Time
        </p>
        <p className="my-3 line-clamp-1 rounded-lg bg-slate-50 px-2 py-1.5 text-center text-[11px] font-semibold text-slate-500">
          {formatTime(filters.arrivalRange[0])} -{" "}
          {formatTime(filters.arrivalRange[1])}
        </p>
        <Slider
          range
          min={0}
          max={1440}
          step={30}
          value={filters.arrivalRange}
          onChange={(value) =>
            update({ arrivalRange: value as [number, number] })
          }
          tooltip={{
            formatter: (value) => formatTime(value || 0),
          }}
        />
      </div>

      {/* Actions */}
      <div className="p-4 lg:hidden">
        <button
          className="h-11 w-full rounded-xl border border-rose-200 bg-rose-50 text-sm font-bold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          onClick={handleReset}
          disabled={!hasActiveFilters}
        >
          Clear all filters
        </button>
      </div>
    </>
  );
};

export default SideBarFilter;
