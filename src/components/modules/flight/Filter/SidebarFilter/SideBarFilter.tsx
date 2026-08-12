"use client";

import { Slider } from "antd";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Button } from "../../../../ui";
import type { FilterState } from "@/components/modules/flight/FlightSearch/FlightSearch";
import type { Itinerary, Schedule } from "../../../../../interface/flight";
import { getItineraryMaxStops } from "@/utils/flightStops";

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
    "flex items-center justify-center w-7 h-7 rounded border border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors";
  return (
    <div>
      <p className="text-[12px] font-semibold text-gray-700 line-clamp-1 mb-1">
        {label}
      </p>
      <div className="flex items-center justify-between gap-2">
        <button type="button" className={arrowClass} onClick={() => onStep(-1)}>
          <LuChevronLeft size={16} />
        </button>
        <span className="flex-1 text-center text-xs font-medium text-gray-800 line-clamp-1">
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
      departureRange: defaultRange,
      arrivalRange: defaultRange,
    });
  };

  const hasActiveFilters =
    filters.airlines.length > 0 ||
    filters.stops.length > 0 ||
    filters.departureRange[0] > 0 ||
    filters.departureRange[1] < 1440 ||
    filters.arrivalRange[0] > 0 ||
    filters.arrivalRange[1] < 1440;

  const currency = allItins[0]?.passengerFareBreakDown[0]?.currency || "BDT";

  const showReturnDate = tripType === "roundtrip" || tripType === "multicity";

  return (
    <>
      <div className="bg-primary text-white p-2 py-4 md:block hidden">
        <h3 className="text-sm font-bold">Filter By</h3>
      </div>

      {/* Stops */}
      <div className="p-2 border-b border-gray-300">
        <table className="w-full filter-table">
          <thead>
            <tr className="text-gray-700 font-semibold">
              <th className="text-left pb-2">Stop</th>
              <th className="text-right pb-2">From</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {stops.map((item) => (
              <tr key={item.value}>
                <td className="py-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.stops.includes(item.value)}
                      onChange={() =>
                        update({
                          stops: toggle(filters.stops, item.value),
                        })
                      }
                    />
                    <span className="line-clamp-1">
                      {item.label}
                      ({item.total})
                    </span>
                  </label>
                </td>
                <td className="text-right line-clamp-1">
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

      {/* Dates */}
      <div className="p-2 border-b border-gray-300 space-y-3">
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

      {/* Airlines */}
      <div className="p-2 border-b border-gray-300">
        <table className="w-full filter-table">
          <thead>
            <tr className="text-gray-700 font-semibold">
              <th className="text-left pb-2">Airlines</th>
              <th className="text-right pb-2">From</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {airlines.map((item) => (
              <tr key={item.code}>
                <td className="py-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.airlines.includes(item.code)}
                      onChange={() =>
                        update({
                          airlines: toggle(filters.airlines, item.code),
                        })
                      }
                    />
                    <span className="line-clamp-1">
                      {item.code} ({item.count})
                    </span>
                  </label>
                </td>
                <td className="text-right line-clamp-1">
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
      <div className="p-2 border-b border-gray-300">
        <p className="text-[12px] font-semibold text-gray-700 line-clamp-1 mb-1">
          Departure Time
        </p>
        <p className="text-[11px] text-gray-600 my-3 line-clamp-1">
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
      <div className="p-2 border-b border-gray-300">
        <p className="text-[12px] font-semibold text-gray-700 mb-1 line-clamp-1">
          Arrival Time
        </p>
        <p className="text-[11px] text-gray-600 my-3 line-clamp-1">
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
      <div className="p-2 flex items-center justify-between">
        <Button
          className="bg-white text-red-500! hover:text-red-600! border border-gray-200 disabled:opacity-40"
          type="reset"
          onClick={handleReset}
          disabled={!hasActiveFilters}
        >
          Reset
        </Button>
      </div>
    </>
  );
};

export default SideBarFilter;