"use client";

import React from "react";
import { DatePicker } from "antd";
import type { GetProps } from "antd";
import dayjs from "dayjs";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Button } from "@/components/ui";
import SearchCity from "../SearchCity/SearchCity";
import AirpotSwap from "../SearchCity/AirpotSwap";
import TravelerCalculate from "../TravelerCalculate/TravelerCalculate";
import type { TravelerValue } from "../TravelerCalculate/TravelerCalculate";

type DatePickerProps = GetProps<typeof DatePicker>;

export interface MultiCityRow {
  fromIata: string;
  toIata: string;
  departureDate: string;
}

interface MultiCityProps {
  data: MultiCityRow[];
  onChange: (
    index: number,
    field: "from" | "to" | "departure",
    value: string,
  ) => void;
  setData: React.Dispatch<React.SetStateAction<MultiCityRow[]>>;
  traveler: TravelerValue;
  changeTraveler: <K extends keyof TravelerValue>(
    field: K,
    value: TravelerValue[K],
  ) => void;
}

const MultiCity: React.FC<MultiCityProps> = ({
  data,
  onChange,
  setData,
  traveler,
  changeTraveler,
}) => {
  const disabledDate =
    (index: number): DatePickerProps["disabledDate"] =>
    (current) => {
      const today = dayjs().startOf("day");
      if (!current || current < today) return true;

      if (index > 0 && data[index - 1]?.departureDate) {
        const prevDate = dayjs(data[index - 1].departureDate).startOf("day");
        if (current < prevDate) return true;
      }
      return false;
    };

  const handleSwap = (index: number) => {
    const from = data[index]?.fromIata || "";
    const to = data[index]?.toIata || "";
    onChange(index, "from", to);
    onChange(index, "to", from);
  };

  const addRow = () => {
    if (data.length >= 5) return;

    const lastRowDate =
      data[data.length - 1]?.departureDate || dayjs().format("YYYY-MM-DD");

    // Append a new empty flight row with immutable state update
    setData((prev) => [
      ...prev,
      {
        fromIata: "",
        toIata: "",
        departureDate: lastRowDate,
      },
    ]);
  };

  const removeRow = () => {
    if (data.length > 1) {
      setData((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-9 flex flex-col gap-4">
        {data.map((row, index) => (
          <div
            key={`leg-${index}`}
            className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center"
          >
            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3 md:col-span-2">
              {/* Departure City */}
              <SearchCity
                label={`Flight ${index + 1} Departure`}
                value={row.fromIata || ""}
                onChange={(iata) => onChange(index, "from", iata)}
                excludeIata={row.toIata}
              />

              {/* Swap button between fields */}
              <AirpotSwap onSwap={() => handleSwap(index)} />

              {/* Arrival City */}
              <SearchCity
                label={`Flight ${index + 1} Arrival`}
                value={row.toIata || ""}
                onChange={(iata) => onChange(index, "to", iata)}
                excludeIata={row.fromIata}
              />
            </div>

            {/* Departure Date */}
            <div className="flex min-h-[74px] flex-col rounded-lg border border-primary/40 bg-white p-2.5 shadow-sm transition-colors focus-within:border-primary">
              <p className="mb-0.5 select-none text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Departure Date
              </p>
              <DatePicker
                className="search-date-picker w-full"
                value={row.departureDate ? dayjs(row.departureDate) : null}
                onChange={(d) =>
                  d && onChange(index, "departure", d.format("YYYY-MM-DD"))
                }
                format="DD MMM YY"
                allowClear={false}
                disabledDate={disabledDate(index)}
              />
              <p className="mt-0.5 text-[10px] text-gray-500">
                {row.departureDate
                  ? dayjs(row.departureDate).format("dddd")
                  : "Select Date"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 justify-between">
        <TravelerCalculate value={traveler} onChange={changeTraveler} />

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={addRow}
            disabled={data.length >= 5}
            className={`flex-1 bg-primary text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity ${
              data.length >= 5 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FaPlus /> Add City
          </Button>
          <Button
            type="button"
            onClick={removeRow}
            disabled={data.length <= 1}
            className={`bg-red-500 text-white p-3 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity ${
              data.length <= 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FaMinus />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MultiCity;