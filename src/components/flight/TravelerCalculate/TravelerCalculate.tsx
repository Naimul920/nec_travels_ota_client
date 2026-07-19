"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";

export type CabinType = "ECONOMY" | "BUSINESS";

export interface TravelerValue {
  adults: number;
  children: number;
  kids: number;
  infants: number;
  cabin: CabinType;
}

interface Props {
  value: TravelerValue;
  onChange: <K extends keyof TravelerValue>(
    field: K,
    value: TravelerValue[K],
  ) => void;
}

const MAX_TRAVELERS = 7;

const TravelerCalculate: React.FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const total = value.adults + value.children + value.kids + value.infants;
  const isMaxReached = total >= MAX_TRAVELERS;

  // Handle detection shifts outside the targeted DOM Node area
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const updateCount = (key: keyof TravelerValue, newValue: number) => {
    if (key === "adults" && newValue < 1) return;
    if (newValue < 0) return;
    if (newValue > (value[key] as number) && isMaxReached) return;

    onChange(key, newValue);
  };

  const travelers = [
    { label: "Adults", sub: "12 years & above", key: "adults" },
    { label: "Children", sub: "5 to under 12", key: "children" },
    { label: "Kids", sub: "2 to under 5", key: "kids" },
    { label: "Infants", sub: "Under 2", key: "infants" },
  ] as const;

  return (
    <div className="relative" ref={ref}>
      {/* Dropdown Interaction Trigger */}
      <div
        className="cursor-pointer rounded-xl border border-primary p-4 bg-white"
        onClick={() => setOpen(!open)}
      >
        <p className="text-xs font-semibold uppercase text-gray-400">
          Travelers & Class
        </p>
        <p className="text-2xl font-extrabold text-primary">
          {total} Traveler{total > 1 ? "s" : ""}
        </p>
        <p className="text-xs text-gray-500">{value.cabin}</p>
      </div>

      {/* Floating Action Menu Overlay */}
      {open && (
        <div className="absolute z-50 mt-1 shadow-sm w-full rounded-lg bg-white p-5 space-y-4 transform md:translate-x-0 -translate-x-6">
          {travelers.map((item) => {
            const count = value[item.key] as number;
            return (
              <div key={item.key} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-700">{item.label}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">
                    {item.sub}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    disabled={
                      (item.key === "adults" && count === 1) || count === 0
                    }
                    className="w-8 h-8 rounded-full border disabled:opacity-40"
                    onClick={() => updateCount(item.key, count - 1)}
                  >
                    −
                  </Button>

                  <span className="w-6 text-center text-gray-700 font-semibold">
                    {count}
                  </span>

                  <Button
                    type="button"
                    disabled={isMaxReached}
                    className="w-8 h-8 rounded-full border disabled:opacity-40"
                    onClick={() => updateCount(item.key, count + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            );
          })}

          {isMaxReached && (
            <p className="text-xs text-red-500 text-center">
              Maximum {MAX_TRAVELERS} travelers allowed
            </p>
          )}

          {/* Cabin Selection System */}
          <div className="border-t border-gray-200 pt-3 space-y-2 text-gray-700">
            <p className="text-sm font-semibold">Cabin Class</p>
            <div className="flex items-center gap-5">
              <label className="flex items-center gap-1 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="cabinClass"
                  checked={value.cabin === "ECONOMY"}
                  onChange={() => onChange("cabin", "ECONOMY")}
                />
                Economy
              </label>

              <label className="flex items-center gap-1 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="cabinClass"
                  checked={value.cabin === "BUSINESS"}
                  onChange={() => onChange("cabin", "BUSINESS")}
                />
                Business
              </label>
            </div>
          </div>

          {/* Core Submission Interface */}
          <Button
            type="button"
            className="w-full mt-3 bg-primary text-white rounded-lg py-2 font-semibold"
            onClick={() => setOpen(false)}
          >
            Done
          </Button>
        </div>
      )}
    </div>
  );
};

export default TravelerCalculate;
