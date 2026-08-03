"use client";

import React from "react";

interface Props {
  cardCount?: number;
}

const FlightSearchSkeleton: React.FC<Props> = ({ cardCount = 3 }) => {
  const filterRows = [0, 1, 2];

  const skeletonCard = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-xs animate-pulse">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-12 md:col-span-10 space-y-5 md:border-r border-dashed border-gray-300 md:py-6">
          <div className="grid grid-cols-12 gap-2 items-center border-b pb-5 border-dashed border-gray-300 last:border-b-0 last:pb-0">
            <div className="md:col-span-2 col-span-3 flex flex-col items-start gap-2 md:ps-5">
              <div className="h-6 w-20 rounded bg-gray-200" />
              <div className="h-3 w-24 rounded bg-gray-200" />
            </div>

            <div className="md:col-span-7 col-span-6 flex flex-col items-center gap-2">
              <div className="h-3 w-16 rounded bg-gray-200" />
              <div className="border-t border-dashed border-gray-200 my-1 w-full" />
              <div className="h-3 w-28 rounded bg-gray-200" />
            </div>

            <div className="md:col-span-2 col-span-3 flex flex-col items-end gap-2 md:pe-5">
              <div className="h-6 w-20 rounded bg-gray-200" />
              <div className="h-3 w-24 rounded bg-gray-200" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center pb-1">
            <div className="md:col-span-2 col-span-3 flex flex-col items-start gap-2 md:ps-5">
              <div className="h-6 w-20 rounded bg-gray-200" />
              <div className="h-3 w-24 rounded bg-gray-200" />
            </div>

            <div className="md:col-span-7 col-span-6 flex flex-col items-center gap-2">
              <div className="h-3 w-16 rounded bg-gray-200" />
              <div className="border-t border-dashed border-gray-200 my-1 w-full" />
              <div className="h-3 w-28 rounded bg-gray-200" />
            </div>

            <div className="md:col-span-2 col-span-3 flex flex-col items-end gap-2 md:pe-5">
              <div className="h-6 w-20 rounded bg-gray-200" />
              <div className="h-3 w-24 rounded bg-gray-200" />
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center md:col-span-2 text-center gap-3">
          <div className="h-6 w-24 rounded bg-gray-200" />
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="h-8 w-20 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );

  return (
    <div aria-busy="true" aria-label="Loading flight results">
      {/* TOP HEADER ROW */}
      <div className="flex items-center justify-between mb-2 animate-pulse">
        <div className="h-4 w-44 rounded bg-gray-200" />
        <div className="h-3 w-32 rounded bg-gray-200" />
      </div>

      <div className="grid grid-cols-12 md:gap-5">
        {/* SIDEBAR FILTER */}
        <div className="lg:col-span-2 hidden lg:block">
          <div className="bg-white shadow rounded-b-sm">
            <div className="bg-primary p-2 py-4">
              <div className="h-4 w-20 rounded bg-white/30 animate-pulse" />
            </div>

            {/* Stops */}
            <div className="p-2 border-b border-gray-300 animate-pulse">
              <div className="flex justify-between pb-2">
                <div className="h-3 w-8 rounded bg-gray-200" />
                <div className="h-3 w-10 rounded bg-gray-200" />
              </div>
              {filterRows.map((r) => (
                <div key={`s-${r}`} className="flex justify-between items-center py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-3.5 w-3.5 rounded-sm bg-gray-200" />
                    <div className="h-3 w-16 rounded bg-gray-200" />
                  </div>
                  <div className="h-3 w-16 rounded bg-gray-200" />
                </div>
              ))}
            </div>

            {/* Airlines */}
            <div className="p-2 border-b border-gray-300 animate-pulse">
              <div className="flex justify-between pb-2">
                <div className="h-3 w-12 rounded bg-gray-200" />
                <div className="h-3 w-10 rounded bg-gray-200" />
              </div>
              {filterRows.map((r) => (
                <div key={`a-${r}`} className="flex justify-between items-center py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-3.5 w-3.5 rounded-sm bg-gray-200" />
                    <div className="h-3 w-10 rounded bg-gray-200" />
                  </div>
                  <div className="h-3 w-16 rounded bg-gray-200" />
                </div>
              ))}
            </div>

            {/* Departure Time */}
            <div className="p-2 border-b border-gray-300 animate-pulse">
              <div className="h-3 w-24 rounded bg-gray-200 mb-3" />
              <div className="h-3 w-28 rounded bg-gray-200 mb-3" />
              <div className="h-1.5 w-full rounded-full bg-gray-200" />
              <div className="h-1.5 w-1/2 rounded-full bg-gray-300 ml-auto mt-0.5" />
            </div>

            {/* Arrival Time */}
            <div className="p-2 border-b border-gray-300 animate-pulse">
              <div className="h-3 w-24 rounded bg-gray-200 mb-3" />
              <div className="h-3 w-28 rounded bg-gray-200 mb-3" />
              <div className="h-1.5 w-full rounded-full bg-gray-200" />
              <div className="h-1.5 w-1/2 rounded-full bg-gray-300 ml-auto mt-0.5" />
            </div>

            {/* Actions */}
            <div className="p-2 flex items-center justify-between animate-pulse">
              <div className="h-8 w-16 rounded bg-gray-200" />
              <div className="h-8 w-16 rounded bg-gray-300" />
            </div>
          </div>
        </div>

        {/* RESULTS COLUMN */}
        <div className="lg:col-span-10 col-span-12">
          {/* Airline chips */}
          <div className="sticky top-0 z-10">
            <div className="w-full bg-white border border-gray-200 rounded-b-md p-2 shadow-xs animate-pulse">
              <div className="flex gap-2 overflow-hidden py-1 px-0.5">
                {[0, 1, 2, 3].map((c) => (
                  <div key={c} className="flex items-center gap-2 px-3 py-2 min-w-[110px] h-11 rounded-lg border border-gray-200 bg-gray-50 shrink-0">
                    <div className="h-6 w-6 rounded bg-gray-200" />
                    <div className="flex flex-col gap-1.5">
                      <div className="h-3 w-8 rounded bg-gray-200" />
                      <div className="h-2.5 w-14 rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Flight cards */}
          <div className="py-2 space-y-2">
            {Array.from({ length: cardCount }).map((_, idx) => (
              <React.Fragment key={idx}>{skeletonCard()}</React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchSkeleton;
