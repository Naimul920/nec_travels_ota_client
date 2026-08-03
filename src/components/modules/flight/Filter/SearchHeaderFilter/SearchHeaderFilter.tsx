import React, { useMemo } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { Itinerary, Schedule } from "@/interface/flight";

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
    <div className="w-full bg-white border border-gray-200 rounded-b-md p-2 shadow-xs">
      {/* Horizontal Scrollable Carousel */}
      <div className="flex gap-2 overflow-x-auto custom-scrollbar py-1 px-0.5">
        {airlines.map((item) => {
          const isSelected = selectedCode === item.code;

          return (
            <button
              key={item.code} // Key placed on the outermost returned element
              type="button"
              onClick={() => onSelect(isSelected ? null : item.code)}
              className={clsx(
                "flex items-center gap-2.5 px-3 py-2 min-w-[110px] h-11 rounded-lg border text-left transition-all duration-150 ease-in-out shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/20",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary text-primary shadow-xs"
                  : "border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              {/* Airline Logo Container */}
              <div className="relative w-6 h-6 shrink-0 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
                <Image
                  src={`/api/v1/uploads/files/images/public/airlines_logo/${item.code}.svg`}
                  alt={`${item.code} logo`}
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
              <div className="flex flex-col justify-center leading-tight">
                <span className="text-xs font-semibold tracking-wide uppercase">
                  {item.code}
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {item.price ? `Tk. ${item.price}` : "N/A"}
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