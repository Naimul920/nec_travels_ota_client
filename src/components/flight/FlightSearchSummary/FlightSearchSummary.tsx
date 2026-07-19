"use client"; // 1. Next.js 16 Client Component Directive

import React, { useMemo } from "react";
// 2. Swapped useLocation from 'react-router-dom' to Next.js native hooks
import { useSearchParams } from "next/navigation";
import { Button } from "../../ui";
import dayjs from "dayjs";
import Flight from "../Flight";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { modifySearch } from "../../../redux/features/flightSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { decoding } from "../../../utils";

type Segment = {
  from: string;
  to: string;
  date: string;
  returnDate?: string;
};

const FlightSearchSummary: React.FC = () => {
  // 3. Next.js hook to access the URL query parameters directly
  const searchParams = useSearchParams();

  // 4. Extract and decode the custom 'q' param safely from Next.js query layout
  const encodedQuery = searchParams.get("q");
  const decode = useMemo(() => {
    return encodedQuery ? decoding(encodedQuery) : null;
  }, [encodedQuery]);

  const dispatch = useAppDispatch();
  const flight = useAppSelector((state) => state.flight);

  // 5. Parse the decrypted query parameters string into a query object utility
  const params = useMemo(() => {
    return new URLSearchParams((decode as string) || "");
  }, [decode]);

  const tripType = params.get("tripType");

  const segments: Segment[] = useMemo(() => {
    if (tripType === "multicity") {
      const str = params.get("segments");
      if (!str) return [];
      return str.split(",").map((seg) => {
        const [from, to, date] = seg.split("-");
        return { from, to, date };
      });
    }

    return [
      {
        from: params.get("from") || "",
        to: params.get("to") || "",
        date: params.get("date") || "",
        returnDate: params.get("returnDate") || "",
      },
    ];
  }, [params, tripType]);

  const passengers = {
    adult: params.get("adult") || "0",
    child: params.get("child") || "0",
    infant: params.get("infant") || "0",
    kid: params.get("kid") || "0",
  };

  if (!tripType) return null;

  return (
    <>
      {/* ===== SUMMARY CARD ===== */}
      <div className="bg-white shadow my-3 md:mt-0">
        {segments.map((seg, index) => (
          <div
            key={index}
            className="grid grid-cols-12 items-center gap-2 px-3 py-2 border-b border-gray-200 last:border-none"
          >
            {/* LEFT CONTENT */}
            <div className="col-span-11 flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
              {/* Trip type */}
              <span className="text-sm font-semibold uppercase text-primary">
                {tripType}
              </span>

              {/* Route */}
              <span className="text-balance md:font-bold font-medium">
                {seg.from} → {seg.to}
              </span>

              {/* Date */}
              <div className="md:ml-auto flex items-center">
                {seg.date && (
                  <span className="text-balance md:font-bold font-medium text-gray-700">
                    {dayjs(seg.date).format("DD MMM YYYY")}
                  </span>
                )}
                {/* Date */}
                {seg.returnDate && (
                  <>
                    {" - "}
                    <span className="text-balance md:font-bold font-medium text-gray-700">
                      {dayjs(seg.returnDate).format("DD MMM YYYY")}
                    </span>
                  </>
                )}
              </div>

              {/* Passenger */}
              <span className="text-[10px] text-gray-500">
                Adt {passengers.adult}, Chd {passengers.child}, Kid{" "}
                {passengers.kid}, Inf {passengers.infant}
              </span>
            </div>

            {/* RIGHT BUTTON */}
            {index === 0 && (
              <div className="col-span-1 flex justify-end">
                <Button
                  onClick={() => dispatch(modifySearch())}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-medium transition-all ${
                    flight?.isModifySearch
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-primary text-white"
                  }`}
                >
                  {flight?.isModifySearch ? "Hide" : "Modify"}
                  {flight?.isModifySearch ? (
                    <BiChevronUp size={14} />
                  ) : (
                    <BiChevronDown size={14} />
                  )}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ===== TOGGLE SEARCH FORM ===== */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          flight?.isModifySearch
            ? "max-h-[3000px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        {flight?.isModifySearch && (
          <div className="p-4 md:p-6 bg-white rounded-md shadow-sm mb-10">
            <Flight useFlight="search" />
          </div>
        )}
      </div>
    </>
  );
};

export default FlightSearchSummary;
