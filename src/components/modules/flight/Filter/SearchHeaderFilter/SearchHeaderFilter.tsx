import React, { useMemo } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { Itinerary, Schedule } from "@/interface/flight";
import { getAirlineName } from "@/utils/airline";

interface Props {
  carrierCodes: string[];
  allItins: Itinerary[];
  selectedCode: string | null;
  onSelect: (code: string | null) => void;
}

const SearchHeaderFilter: React.FC<Props> = ({
  carrierCodes,
  allItins,
  selectedCode,
  onSelect,
}) => {
  // Pre-computes filter combinations and minimum prices for each airline
  const airlines = useMemo(() => {
    return carrierCodes.map((code) => {
      const matching = allItins.filter((itin) =>
        itin?.flightDetails?.some((fd) =>
          fd?.schedules?.some((s: Schedule) => s.marketingCarrierCode === code)
        )
      );

      const minFare = matching.length
        ? Math.min(
            ...matching.map((i) =>
              i.saleCurrencyAmount?.offerAmount ??
              i.saleCurrencyAmount?.totalAmount ??
              0,
            ),
          )
        : 0;

      const currency =
        matching[0]?.passengerFareBreakDown[0]?.currency || "BDT";

      return {
        code,
        price: minFare > 0 ? minFare.toLocaleString() : null,
        currency,
        count: matching.length,
      };
    });
  }, [allItins, carrierCodes]);

  if (airlines.length === 0) return null;

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      {/* Horizontal Scrollable Carousel */}
      <div className="custom-scrollbar flex gap-2 overflow-x-auto p-0.5">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={clsx(
            "flex h-14 min-w-28 shrink-0 flex-col justify-center rounded-xl border px-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30",
            selectedCode === null
              ? "border-brand bg-brand/10 text-brand"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
          )}
        >
          <span className="text-xs font-bold">All airlines</span>
          <span className="mt-0.5 text-[10px] font-medium opacity-70">{allItins.length} options</span>
        </button>
        {airlines.map((item) => {
          const isSelected = selectedCode === item.code;

          return (
            <button
              key={item.code} // Key placed on the outermost returned element
              type="button"
              onClick={() => onSelect(isSelected ? null : item.code)}
              className={clsx(
                "flex h-14 min-w-40 shrink-0 items-center gap-3 rounded-xl border px-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30",
                isSelected
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {/* Airline Logo Container */}
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 p-1">
                <Image
                  src={`/api/v1/uploads/files/images/public/airlines_logo/${item.code}.svg`}
                  alt={`${getAirlineName(item.code)} logo`}
                  width={24}
                  height={24}
                  className="object-contain w-full h-full"
                  onError={(e) => {
                    // Fallback visual if logo fails to load
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Airline Code & Price Details */}
              <div className="flex min-w-0 flex-1 flex-col justify-center leading-tight">
                <span className="truncate text-[11px] font-bold">
                  {getAirlineName(item.code)}
                </span>
                <span className="mt-1 truncate text-[10px] font-medium text-slate-500">
                  {item.code} · {item.price ? `${item.currency} ${item.price}` : "Fare unavailable"} · {item.count}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchHeaderFilter;
