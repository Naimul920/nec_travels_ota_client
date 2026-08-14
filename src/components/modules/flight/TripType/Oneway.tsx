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
  };
  onChange: (
    field: "from" | "to" | "departure" | "return",
    iata: string,
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
          label="From"
          value={data.fromIata}
          onChange={(iata) => onChange("from", iata)}
          excludeIata={data.toIata}
        />

        {/* Swap button between fields */}
        <AirpotSwap onSwap={handleSwap} />

        {/* Arrival Airport Selector */}
        <SearchCity
          label="To"
          value={data.toIata}
          onChange={(iata) => onChange("to", iata)}
          excludeIata={data.fromIata}
        />
      </div>

      {/* Departure Calendar Date Picker */}
      <div className="relative flex min-h-[74px] flex-col rounded-lg border border-primary/40 bg-white p-2.5 shadow-sm transition-colors focus-within:border-primary">
        <p className="mb-0.5 select-none text-[10px] font-bold uppercase tracking-wider text-gray-500">
          Journey Date
        </p>

        <DatePicker
          className="search-date-picker"
          value={data.departureDate ? dayjs(data.departureDate) : null}
          onChange={(d) => d && onChange("departure", d.format("YYYY-MM-DD"))}
          format="DD MMM YY"
          allowClear={false}
          disabledDate={disabledDate}
        />

        <p className="mt-0.5 line-clamp-1 select-none text-[10px] text-gray-500">
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
