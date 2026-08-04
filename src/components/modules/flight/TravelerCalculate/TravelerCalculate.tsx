"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { FaUser, FaUserFriends } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { MdOutlineAirlineSeatReclineNormal } from "react-icons/md";

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
    {
      label: "Adults",
      sub: "12 years & above",
      key: "adults" as const,
      icon: <FaUser className="text-primary" />,
    },
    {
      label: "Children",
      sub: "5 to under 12",
      key: "children" as const,
      icon: <FaUser className="text-secondary" />,
    },
    {
      label: "Kids",
      sub: "2 to under 5",
      key: "kids" as const,
      icon: <FaUser className="text-amber-500" />,
    },
    {
      label: "Infants",
      sub: "0 to 2 year",
      key: "infants" as const,
      icon: <FaUser className="text-gray-400" />,
    },
  ];

  const StepperBtn: React.FC<{
    label: string;
    disabled?: boolean;
    onClick: () => void;
  }> = ({ label, disabled, onClick }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
        label === "+"
          ? "border-primary text-primary bg-primary/5 hover:bg-primary hover:text-white"
          : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
      }`}
    >
      {label === "+" ? <FiPlus size={14} /> : <FiMinus size={14} />}
    </button>
  );

  return (
    <div className="relative" ref={ref}>
      {/* Dropdown Trigger */}
      <div
        className="cursor-pointer rounded-xl border-2 border-primary bg-white p-4 transition-all hover:border-primary/70 hover:shadow-md"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Travelers & Class
            </p>
            <p className="mt-0.5 flex items-center gap-2 text-2xl font-extrabold text-primary">
              {total}
              <span className="text-sm font-semibold text-gray-600">
                Traveler{total > 1 ? "s" : ""}
              </span>
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-600">
            <MdOutlineAirlineSeatReclineNormal />
            {value.cabin.toLowerCase()}
          </span>
        </div>
      </div>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-xl space-y-4 md:translate-x-0 -translate-x-6">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FaUserFriends />
            </span>
            <div>
              <p className="text-sm font-bold text-gray-800">Select Travelers</p>
              <p className="text-xs text-gray-400">
                {total} traveler{total > 1 ? "s" : ""} ·{" "}
                {value.cabin.toLowerCase()} class
              </p>
            </div>
          </div>

          {/* Traveler Rows */}
          {travelers.map((item) => {
            const count = value[item.key] as number;
            return (
              <div
                key={item.key}
                className="flex justify-between items-center gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 border border-gray-100">
                    {item.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-700">{item.label}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">
                      {item.sub}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StepperBtn
                    label="−"
                    disabled={
                      (item.key === "adults" && count === 1) || count === 0
                    }
                    onClick={() => updateCount(item.key, count - 1)}
                  />
                  <span className="w-7 text-center text-lg font-bold text-gray-800">
                    {count}
                  </span>
                  <StepperBtn
                    label="+"
                    disabled={isMaxReached}
                    onClick={() => updateCount(item.key, count + 1)}
                  />
                </div>
              </div>
            );
          })}

          {isMaxReached && (
            <p className="rounded-lg bg-red-50 py-1.5 text-center text-xs font-medium text-red-500">
              Maximum {MAX_TRAVELERS} travelers allowed
            </p>
          )}

          {/* Cabin Class */}
          <div className="border-t border-gray-100 pt-4">
            <p className="mb-2 text-sm font-bold text-gray-700">Cabin Class</p>
            <div className="grid grid-cols-2 gap-2">
              {(["ECONOMY", "BUSINESS"] as const).map((cabin) => {
                const active = value.cabin === cabin;
                return (
                  <button
                    key={cabin}
                    type="button"
                    onClick={() => onChange("cabin", cabin)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-semibold capitalize transition-all ${
                      active
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {cabin.toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            type="button"
            className="w-full bg-primary text-white rounded-xl py-2.5 font-semibold hover:opacity-90"
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
