"use client"; // 1. Next.js 16 Client Component Directive

import { Slider } from "antd";
import React, { useMemo, useState } from "react";
import { Button } from "../../../../ui";
// 2. Updated path parameters mapping style depending on your root directory aliasing layout
import type { FilterState } from "@/components/modules/flight/FlightSearch/FlightSearch";
import type { Itinerary, Schedule } from "../../../../../interface/flight";

interface Props {
  allItins: Itinerary[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  carrierCodes: string[];
  stopOptions: number[];
  minPrice: number;
}

const defaultRange: [number, number] = [0, 1440];

const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hour12 = h % 12 || 12;
  const ampm = h < 12 ? "AM" : "PM";
  return `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
};

const SideBarFilter: React.FC<Props> = ({
  allItins,
  filters,
  onFilterChange,
  carrierCodes,
  stopOptions,
}) => {
  const [localAirlines, setLocalAirlines] = useState<string[]>(
    filters.airlines,
  );
  const [localStops, setLocalStops] = useState<number[]>(filters.stops);
  const [localDeparture, setLocalDeparture] = useState<[number, number]>(
    filters.departureRange,
  );
  const [localArrival, setLocalArrival] = useState<[number, number]>(
    filters.arrivalRange,
  );

  const airlines = useMemo(() => {
    return carrierCodes.map((code: string) => {
      const matching = allItins.filter((itin) =>
        itin.flightDetails.some((fd) =>
          fd.schedules.some((s: Schedule) => s.marketingCarrierCode === code),
        ),
      );
      const minFare = matching.length
        ? Math.min(...matching.map((i) => i.saleCurrencyAmount.totalFare))
        : 0;
      return { code, count: matching.length, minPrice: minFare };
    });
  }, [allItins, carrierCodes]);

  const stops = useMemo(() => {
    return stopOptions.map((stop: number) => {
      const matching = allItins.filter((itin) =>
        itin.flightDetails.some((fd) =>
          fd.schedules.some((s: Schedule) => s.stopCount === stop),
        ),
      );
      const minFare = matching.length
        ? Math.min(...matching.map((i) => i.saleCurrencyAmount.totalFare))
        : 0;
      return { count: stop, total: matching.length, minPrice: minFare };
    });
  }, [allItins, stopOptions]);

  const handleApply = () => {
    onFilterChange({
      airlines: localAirlines,
      stops: localStops,
      departureRange: localDeparture,
      arrivalRange: localArrival,
    });
  };

  const handleReset = () => {
    setLocalAirlines([]);
    setLocalStops([]);
    setLocalDeparture(defaultRange);
    setLocalArrival(defaultRange);
    onFilterChange({
      airlines: [],
      stops: [],
      departureRange: defaultRange,
      arrivalRange: defaultRange,
    });
  };

  const currency = allItins[0]?.passengerFareBreakDown[0]?.currency || "BDT";

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
              <tr key={item.count}>
                <td className="py-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localStops.includes(item.count)}
                      onChange={() =>
                        setLocalStops((prev) =>
                          prev.includes(item.count)
                            ? prev.filter((s) => s !== item.count)
                            : [...prev, item.count],
                        )
                      }
                    />
                    <span className="line-clamp-1">
                      {item.count === 0
                        ? "Nonstop"
                        : `${item.count} Stop${item.count > 1 ? "s" : ""}`}
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
                      checked={localAirlines.includes(item.code)}
                      onChange={() =>
                        setLocalAirlines((prev) =>
                          prev.includes(item.code)
                            ? prev.filter((c) => c !== item.code)
                            : [...prev, item.code],
                        )
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
          {formatTime(localDeparture[0])} - {formatTime(localDeparture[1])}
        </p>
        <Slider
          range
          min={0}
          max={1440}
          step={30}
          value={localDeparture}
          onChange={(value) => setLocalDeparture(value as [number, number])}
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
          {formatTime(localArrival[0])} - {formatTime(localArrival[1])}
        </p>
        <Slider
          range
          min={0}
          max={1440}
          step={30}
          value={localArrival}
          onChange={(value) => setLocalArrival(value as [number, number])}
          tooltip={{
            formatter: (value) => formatTime(value || 0),
          }}
        />
      </div>

      {/* Actions */}
      <div className="p-2 flex items-center justify-between">
        <Button
          className="bg-white text-red-500 hover:text-red-600 border border-gray-200"
          type="reset"
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button onClick={handleApply}>Apply</Button>
      </div>
    </>
  );
};

export default SideBarFilter;
