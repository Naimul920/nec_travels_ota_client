"use client";

import React from "react";
import { DatePicker } from "antd";
import type { GetProps } from "antd";
import dayjs from "dayjs";
import { FaPlus } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import SearchCity, {
  DEFAULT_AIRPORT_DAC,
  DEFAULT_AIRPORT_CXB,
} from "../SearchCity/SearchCity";
import AirpotSwap from "../SearchCity/AirpotSwap";
import TravelerCalculate from "../TravelerCalculate/TravelerCalculate";
import type { TravelerValue } from "../TravelerCalculate/TravelerCalculate";

type DatePickerProps = GetProps<typeof DatePicker>;

export interface MultiCityRow {
  fromIata: string;
  toIata: string;
  departureDate: string;
  fromName?: string;
  toName?: string;
}

interface MultiCityProps {
  data: MultiCityRow[];
  onChange: (
    index: number,
    field: "from" | "to" | "departure",
    value: string,
    city?: string,
  ) => void;
  setData: React.Dispatch<React.SetStateAction<MultiCityRow[]>>;
  onRemoveRow: (index: number) => void;
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
  onRemoveRow,
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

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 flex flex-col gap-3 lg:col-span-9">
        {data.map((row, index) => (
          <div
            key={`leg-${index}`}
            className="relative grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-2 pt-12 sm:grid-cols-2 sm:pt-2 md:grid-cols-3"
          >
            <div className="absolute right-2 top-2 flex items-center gap-2 sm:right-3 sm:top-1/2 sm:-translate-y-1/2 md:static md:col-span-3 md:mb-[-0.25rem] md:ml-auto md:translate-y-0">
              <span className="text-xs font-semibold text-slate-400">
                Flight {index + 1}
              </span>
              {data.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveRow(index)}
                  aria-label={`Remove flight ${index + 1}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                >
                  <FiTrash2 aria-hidden="true" />
                </button>
              )}
            </div>
            <div className="relative grid grid-cols-1 gap-3 sm:col-span-2 sm:grid-cols-2 md:col-span-2">
{/* Departure City */}
              <SearchCity
                value={row.fromIata || ""}
                onChange={(iata, city) => onChange(index, "from", iata, city)}
                excludeIata={row.toIata}
                placeholder="Leaving from"
                cityName={row.fromName}
                defaultAirport={DEFAULT_AIRPORT_DAC}
              />

              {/* Swap button between fields */}
              <AirpotSwap onSwap={() => handleSwap(index)} />

              {/* Arrival City */}
              <SearchCity
                value={row.toIata || ""}
                onChange={(iata, city) => onChange(index, "to", iata, city)}
                excludeIata={row.fromIata}
                placeholder="Going to"
                cityName={row.toName}
                defaultAirport={DEFAULT_AIRPORT_CXB}
              />
            </div>

            {/* Departure Date */}
            <div className="relative flex min-h-20 flex-col justify-center rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10">
              <p className="mb-1 select-none text-[10px] font-bold uppercase tracking-[0.12em] text-brand">
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
              <p className="mt-1 line-clamp-1 select-none text-[10px] font-medium uppercase text-slate-400">
                {row.departureDate
                  ? dayjs(row.departureDate).format("dddd")
                  : "Select Date"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="col-span-12 flex flex-col justify-between gap-3 lg:col-span-3">
        <TravelerCalculate value={traveler} onChange={changeTraveler} />

        <div>
          <button
            type="button"
            onClick={addRow}
            disabled={data.length >= 5}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaPlus aria-hidden="true" />
            {data.length >= 5 ? "Maximum 5 flights" : "Add another flight"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiCity;
