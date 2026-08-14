"use client";

import React from "react";
import SearchCity from "../SearchCity/SearchCity";
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
  };
  onChange: (
    field: "from" | "to" | "departure" | "return",
    value: string
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
          label="Departure City"
          value={data.fromIata}
          onChange={(iata) => onChange("from", iata)}
          excludeIata={data.toIata}
        />

        {/* Swap button between fields */}
        <AirpotSwap onSwap={handleSwap} />

        {/* Arrival Airport Selector */}
        <SearchCity
          label="Arrival City"
          value={data.toIata}
          onChange={(iata) => onChange("to", iata)}
          excludeIata={data.fromIata}
        />
      </div>

      {/* Departure Date Picker */}
      <div className="relative flex min-h-[74px] flex-col rounded-lg border border-primary/40 bg-white p-2.5 shadow-sm transition-colors focus-within:border-primary">
        <p className="mb-0.5 select-none text-[10px] font-bold uppercase tracking-wider text-gray-500">
          Departure Date
        </p>

        <DatePicker
          className="search-date-picker"
          value={data.departureDate ? dayjs(data.departureDate) : null}
          onChange={(d) => d && onChange("departure", d.format("YYYY-MM-DD"))}
          format="DD MMM YY"
          allowClear={false}
          disabledDate={disabledDeparture}
        />

        <p className="mt-0.5 line-clamp-1 select-none text-[10px] text-gray-500">
          {data.departureDate
            ? dayjs(data.departureDate).format("dddd")
            : "Select Date"}
        </p>
      </div>

      {/* Return Date Picker */}
      <div className="relative flex min-h-[74px] flex-col rounded-lg border border-primary/40 bg-white p-2.5 shadow-sm transition-colors focus-within:border-primary">
        <p className="mb-0.5 select-none text-[10px] font-bold uppercase tracking-wider text-gray-500">
          Return Date
        </p>

        <DatePicker
          className="search-date-picker"
          value={data.returnDate ? dayjs(data.returnDate) : null}
          onChange={(d) => d && onChange("return", d.format("YYYY-MM-DD"))}
          format="DD MMM YY"
          allowClear={false}
          disabledDate={disabledReturn}
        />

        <p className="mt-0.5 line-clamp-1 select-none text-[10px] text-gray-500">
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