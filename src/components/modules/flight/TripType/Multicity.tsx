"use client";

import React from "react";
import { DatePicker } from "antd";
import type { GetProps } from "antd";
import dayjs from "dayjs";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Button } from "@/components/ui";
import SearchCity from "../SearchCity/SearchCity";
import TravelerCalculate from "../TravelerCalculate/TravelerCalculate";
import type { TravelerValue } from "../TravelerCalculate/TravelerCalculate";

// Clean Ant Design dynamic type configuration mapping
type DatePickerProps = GetProps<typeof DatePicker>;

interface MultiCityRow {
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
  // Compute disabled dates based on the current row index vs previous flights
  const disabledDate =
    (index: number): DatePickerProps["disabledDate"] =>
    (current) => {
      const today = dayjs().startOf("day");

      // Always disable past calendar dates
      if (!current || current < today) return true;

      // Disable dates occurring prior to the previous leg's departure point
      if (index > 0 && data[index - 1].departureDate) {
        const prevDate = dayjs(data[index - 1].departureDate).startOf("day");
        if (current < prevDate) return true;
      }

      return false;
    };

  const handleSwap = (index: number) => {
    const from = data[index].fromIata || "";
    const to = data[index].toIata || "";
    onChange(index, "from", to);
    onChange(index, "to", from);
  };

  const addRow = () => {
    if (data.length >= 5) return; // Hard limit restriction up to max 5 legs

    // Fall back intelligently to the previous leg's date instead of forcing today
    const lastRowDate =
      data[data.length - 1]?.departureDate || dayjs().format("YYYY-MM-DD");

    setData([
      ...data,
      { fromIata: "", toIata: "", departureDate: lastRowDate },
    ]);
  };

  const removeRow = () => {
    if (data.length > 1) setData(data.slice(0, -1));
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Left Segment Column: Multi-city interactive legs tracking layout */}
      <div className="col-span-12 lg:col-span-10 flex flex-col gap-4">
        {data.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center"
          >
            {/* Departure City Auto-Complete Selector */}
            <SearchCity
              label="Departure City"
              value={row.fromIata}
              onChange={(iata) => onChange(index, "from", iata)}
              handelSwap={() => handleSwap(index)}
            />

            {/* Arrival City Auto-Complete Selector */}
            <SearchCity
              label="Arrival City"
              value={row.toIata}
              onChange={(iata) => onChange(index, "to", iata)}
            />

            {/* Departure Calendar Date Picker */}
            <div className="ring-1 ring-primary rounded-lg p-4 bg-white">
              <p className="text-gray-500 text-[10px] font-bold uppercase">
                Departure Date
              </p>
              <DatePicker
                className="search-date-picker"
                value={row.departureDate ? dayjs(row.departureDate) : null}
                onChange={(d) =>
                  d && onChange(index, "departure", d.format("YYYY-MM-DD"))
                }
                format="DD MMM YY"
                allowClear={false}
                disabledDate={disabledDate(index)}
              />
              <p className="text-[10px] text-gray-500">
                {row.departureDate
                  ? dayjs(row.departureDate).format("dddd")
                  : "Select Date"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Right Segment Column: Traveler breakdown controller and segment row controls */}
      <div className="col-span-12 lg:col-span-2 flex flex-col gap-4">
        <TravelerCalculate value={traveler} onChange={changeTraveler} />

        {/* Dynamic Multi-City Row Modification Anchors */}
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={addRow}
            className={`bg-primary text-white p-3 rounded-lg hover:opacity-90 transition-opacity ${
              data.length >= 5 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={data.length >= 5}
          >
            <FaPlus />
          </Button>
          <Button
            type="button"
            onClick={removeRow}
            className={`bg-primary text-white p-3 rounded-lg hover:opacity-90 transition-opacity ${
              data.length <= 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={data.length <= 1}
          >
            <FaMinus />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MultiCity;
