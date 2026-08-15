"use client";

import React, { useEffect } from "react";
import SearchCity from "../SearchCity/SearchCity";
import AirpotSwap from "../SearchCity/AirpotSwap";
import { DatePicker } from "antd";
import type { GetProps } from "antd";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import weekday from "dayjs/plugin/weekday";
import TravelerCalculate from "../TravelerCalculate/TravelerCalculate";
import type { TravelerValue } from "../TravelerCalculate/TravelerCalculate";

// Standard Ant Design v5 RangePicker/DatePicker utility type configuration
type DatePickerProps = GetProps<typeof DatePicker>;

dayjs.extend(advancedFormat);
dayjs.extend(weekday);

interface OnewayProps {
  data: {
    fromIata: string;
    toIata: string;
    departureDate: string;
    fromName?: string;
    toName?: string;
  };
  onChange: (
    field: "from" | "to" | "departure" | "return",
    iata: string,
    city?: string,
  ) => void;
  traveler: TravelerValue;
  changeTraveler: <K extends keyof TravelerValue>(
    field: K,
    value: TravelerValue[K],
  ) => void;
}

const Oneway: React.FC<OnewayProps> = ({
  data,
  onChange,
  traveler,
  changeTraveler,
}) => {
  // Disable previous dates relative to current execution time
  const disabledDate: DatePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
  };
// console.log("Oneway data:", data);
  const handleSwap = () => {
    const from = data.fromIata || "";
    const to = data.toIata || "";
    onChange("from", to);
    onChange("to", from);
  };

  useEffect(() => {
    if (!data.departureDate) {
      onChange("departure", dayjs().format("YYYY-MM-DD"));
    }
  }, [data.departureDate, onChange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
      <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2">
        {/* Departure Airport Selector */}
        <SearchCity
          value={data.fromIata}
          onChange={(iata, city) => onChange("from", iata, city)}
          excludeIata={data.toIata}
          placeholder="Leaving from"
          cityName={data.fromName}
        />

        {/* Swap button between fields */}
        <AirpotSwap onSwap={handleSwap} />

        {/* Arrival Airport Selector */}
        <SearchCity
          value={data.toIata}
          onChange={(iata, city) => onChange("to", iata, city)}
          excludeIata={data.fromIata}
          placeholder="Going to"
          cityName={data.toName}
        />
      </div>

      {/* Departure Calendar Date Picker */}
      <div className="relative flex min-h-[72px] flex-col justify-center rounded-md border border-slate-200 bg-white px-3 shadow-sm transition-colors focus-within:border-primary focus-within:shadow-md">
        <p className="mb-0.5 select-none text-[10px] font-medium uppercase tracking-wide text-primary">
          Journey Date
        </p>

        <DatePicker
          className="search-date-picker w-full"
          value={data.departureDate ? dayjs(data.departureDate) : null}
          onChange={(d) => d && onChange("departure", d.format("YYYY-MM-DD"))}
          format="DD MMM YY"
          allowClear={false}
          disabledDate={disabledDate}
        />

        <p className="mt-0.5 line-clamp-1 select-none text-[10px] font-normal uppercase text-gray-400">
          {data.departureDate
            ? dayjs(data.departureDate).format("dddd")
            : "Select Date"}
        </p>
      </div>

      {/* Traveler Breakdown Counter Module */}
      <TravelerCalculate value={traveler} onChange={changeTraveler} />
    </div>
  );
};

export default Oneway;
