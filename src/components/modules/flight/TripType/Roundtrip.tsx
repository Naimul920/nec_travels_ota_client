"use client";

import React from "react";
import SearchCity, {
  DEFAULT_AIRPORT_CXB,
} from "../SearchCity/SearchCity";
import AirpotSwap from "../SearchCity/AirpotSwap";
import { DatePicker } from "antd";
import type { GetProps } from "antd";
import dayjs from "dayjs";
import TravelerCalculate from "../TravelerCalculate/TravelerCalculate";
import type { TravelerValue } from "../TravelerCalculate/TravelerCalculate";

// Clean Ant Design dynamic type layout binding
type DatePickerProps = GetProps<typeof DatePicker>;

interface RoundtripProps {
  data: {
    fromIata: string;
    toIata: string;
    departureDate: string;
    returnDate: string;
    fromName?: string;
    toName?: string;
  };
  onChange: (
    field: "from" | "to" | "departure" | "return",
    value: string,
    city?: string
  ) => void;
  traveler: TravelerValue;
  changeTraveler: <K extends keyof TravelerValue>(
    field: K,
    value: TravelerValue[K]
  ) => void;
}

const Roundtrip: React.FC<RoundtripProps> = ({
  data,
  onChange,
  traveler,
  changeTraveler,
}) => {
  // Prevent selecting days in the past for departure
  const disabledDeparture: DatePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
  };

  // Prevent selecting days before today OR before the selected departure date
  const disabledReturn: DatePickerProps["disabledDate"] = (current) => {
    return !!(
      current &&
      (current < dayjs().startOf("day") ||
        (data.departureDate && current < dayjs(data.departureDate).startOf("day")))
    );
  };

  const handleSwap = () => {
    const from = data.fromIata || "";
    const to = data.toIata || "";
    onChange("from", to);
    onChange("to", from);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
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
          defaultAirport={DEFAULT_AIRPORT_CXB}
        />
      </div>

      {/* Departure Date Picker */}
      <div className="relative flex min-h-[72px] flex-col justify-center rounded-md border border-slate-200 bg-white px-3 shadow-sm transition-colors focus-within:border-primary focus-within:shadow-md">
        <p className="mb-0.5 select-none text-[10px] font-medium uppercase tracking-wide text-primary">
          Departure Date
        </p>

        <DatePicker
          className="search-date-picker w-full"
          value={data.departureDate ? dayjs(data.departureDate) : null}
          onChange={(d) => d && onChange("departure", d.format("YYYY-MM-DD"))}
          format="DD MMM YY"
          allowClear={false}
          disabledDate={disabledDeparture}
        />

        <p className="mt-0.5 line-clamp-1 select-none text-[10px] font-normal uppercase text-gray-400">
          {data.departureDate
            ? dayjs(data.departureDate).format("dddd")
            : "Select Date"}
        </p>
      </div>

      {/* Return Date Picker */}
      <div className="relative flex min-h-[72px] flex-col justify-center rounded-md border border-slate-200 bg-white px-3 shadow-sm transition-colors focus-within:border-primary focus-within:shadow-md">
        <p className="mb-0.5 select-none text-[10px] font-medium uppercase tracking-wide text-primary">
          Return Date
        </p>

        <DatePicker
          className="search-date-picker w-full"
          value={data.returnDate ? dayjs(data.returnDate) : null}
          onChange={(d) => d && onChange("return", d.format("YYYY-MM-DD"))}
          format="DD MMM YY"
          allowClear={false}
          disabledDate={disabledReturn}
        />

        <p className="mt-0.5 line-clamp-1 select-none text-[10px] font-normal uppercase text-gray-400">
          {data.returnDate
            ? dayjs(data.returnDate).format("dddd")
            : "Select Date"}
        </p>
      </div>

      {/* Traveler & Cabin Class Module */}
      <TravelerCalculate value={traveler} onChange={changeTraveler} />
    </div>
  );
};

export default Roundtrip;