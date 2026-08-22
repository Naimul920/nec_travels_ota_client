"use client";

import React, { useEffect } from "react";
import SearchCity, {
  DEFAULT_AIRPORT_DAC,
  DEFAULT_AIRPORT_CXB,
} from "../SearchCity/SearchCity";
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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="relative grid grid-cols-1 gap-3 sm:col-span-2 sm:grid-cols-2 lg:col-span-2">
        {/* Departure Airport Selector */}
        <SearchCity
          value={data.fromIata}
          onChange={(iata, city) => onChange("from", iata, city)}
          excludeIata={data.toIata}
          placeholder="Leaving from"
          cityName={data.fromName}
          defaultAirport={DEFAULT_AIRPORT_DAC}
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
          defaultAirport={DEFAULT_AIRPORT_CXB}
        />
      </div>

      {/* Departure Calendar Date Picker */}
      <div className="relative flex min-h-20 flex-col justify-center rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10">
        <p className="mb-1 select-none text-[10px] font-bold uppercase tracking-[0.12em] text-brand">
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

        <p className="mt-1 line-clamp-1 select-none text-[10px] font-medium uppercase text-slate-400">
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
