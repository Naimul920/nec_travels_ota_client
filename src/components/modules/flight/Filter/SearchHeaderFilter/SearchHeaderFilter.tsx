import React, { useMemo } from "react";
import { Button } from "@/components/ui";
import clsx from "clsx";
// 1. Updated path parameters mapping style depending on your root directory aliases setup
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
  // Pre-computes filter combinations and prices for the airline carousels
  const airlines = useMemo(() => {
    return carrierCodes.map((code) => {
      const matching = allItins.filter((itin) =>
        itin.flightDetails.some((fd) =>
          fd.schedules.some((s: Schedule) => s.marketingCarrierCode === code),
        ),
      );
      const minFare = matching.length
        ? Math.min(...matching.map((i) => i.saleCurrencyAmount.totalFare))
        : 0;
      const currency =
        matching[0]?.passengerFareBreakDown[0]?.currency || "BDT";
      return {
        code,
        price: minFare.toLocaleString(),
        currency,
        count: matching.length,
      };
    });
  }, [allItins, carrierCodes]);

  if (airlines.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-b-sm p-2">
      {/* Horizontal scroll wrapper with layout handling overrides */}
      <div className="flex gap-2 overflow-x-auto custom-scrollbar">
        {airlines.map((item) => {
          const isSelected = selectedCode === item.code;

          return (
            <Button
              key={item.code}
              onClick={() => onSelect(isSelected ? null : item.code)}
              className={clsx(
                "flex items-center gap-2 px-3 py-2 min-w-[90px] h-10 rounded-md border transition-all",
                // 2. Extracted legacy Tailwind v3/v4 inline '!' template syntax errors to clean class arrays
                isSelected
                  ? "border-primary text-primary! bg-white! hover:bg-white"
                  : "border-gray-200 text-gray-900! bg-white! hover:border-gray-300 hover:bg-gray-50",
              )}
            >
              <div className="text-left">
                <p className="text-xs font-semibold">{item.code}</p>
                <p className="text-[10px] text-gray-500">
                  {/* {item.currency} */}
                  Tk. {item.price}
                </p>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchHeaderFilter;
