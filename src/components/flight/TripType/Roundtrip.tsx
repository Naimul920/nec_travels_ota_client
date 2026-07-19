"use client";

import React from "react";
import SearchCity from "../SearchCity/SearchCity";
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
      {/* Departure Airport Selector */}
      <SearchCity
        label="Departure City"
        value={data.fromIata}
        onChange={(iata) => onChange("from", iata)}
        handelSwap={handleSwap}
      />

      {/* Arrival Airport Selector */}
      <SearchCity
        label="Arrival City"
        value={data.toIata}
        onChange={(iata) => onChange("to", iata)}
      />

      {/* Departure Date Picker */}
      <div className="relative ring-1 ring-primary rounded-lg p-3 bg-white">
        <p className="text-gray-500 md:text-xs text-[10px] font-bold uppercase">
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

        <p className="md:text-xs text-[10px] text-gray-500">
          {data.departureDate ? dayjs(data.departureDate).format("dddd") : "Select Date"}
        </p>
      </div>

      {/* Return Date Picker */}
      <div className="relative ring-1 ring-primary rounded-lg p-3 bg-white">
        <p className="text-gray-500 md:text-xs text-[10px] font-bold uppercase">
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

        <p className="md:text-xs text-[10px] text-gray-500">
          {data.returnDate ? dayjs(data.returnDate).format("dddd") : "Select Date"}
        </p>
      </div>

      {/* Traveler & Cabin Class Module */}
      <TravelerCalculate value={traveler} onChange={changeTraveler} />
    </div>
  );
};

export default Roundtrip;