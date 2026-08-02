import React from "react";
import type { Itinerary, Schedule } from "@/interface/flight";
import dayjs from "dayjs";

interface Props {
  itinerary: Itinerary;
  passengerCount: {
    adult: number;
    child: number;
    kid: number;
    infant: number;
  };
}

function formatTime(_iso: string, timeStr: string): string {
  const t = timeStr.replace(/[+-]\d{2}:\d{2}$/, "");
  return t.slice(0, 5);
}

function formatDate(iso: string): string {
  return dayjs(iso).format("DD MMM YYYY");
}

function elapsedString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function formatNumber(value?: number): string {
  return typeof value === "number" && Number.isFinite(value)
    ? value.toLocaleString()
    : "0";
}

const passengerLabel: Record<string, string> = {
  Adult: "Adult",
  Child: "Child",
  Kids: "Kid",
  Infant: "Infant",
};

const SearchDetails: React.FC<Props> = ({ itinerary, passengerCount }) => {
  const segments = itinerary.flightDetails;
  const fares = itinerary.passengerFareBreakDown;
  const currency = fares[0]?.currency || "BDT";

  const passengerTypeOrder = ["Adult", "Child", "Kids", "Infant"];
  const passengerCountMap: Record<string, number> = {
    Adult: passengerCount.adult,
    Child: passengerCount.child,
    Kids: passengerCount.kid,
    Infant: passengerCount.infant,
  };
  console.log(passengerCountMap);

  return (
    <div className="bg-white mt-1 rounded-lg border border-gray-200 p-4 relative overflow-hidden shadow-xs">
      {/* Flight Schedule Details */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Flight Details
        </h4>
        {segments.map((seg, idx) => {
          const schedule: Schedule = seg.schedules[0];
          if (!schedule) return null;
          return (
            <div
              key={idx}
              className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-xs text-gray-600 border-b border-dashed border-gray-200 pb-3 mb-3 last:border-b-0 last:mb-0 last:pb-0"
            >
              <span className="font-medium text-primary">
                {schedule.flightName}
              </span>
              <span>
                {schedule.departure.airport}{" "}
                {formatTime(
                  schedule.departureDateTime,
                  schedule.departure.time,
                )}{" "}
                {formatDate(schedule.departureDateTime)}
                {" → "}
                {schedule.arrival.airport}{" "}
                {formatTime(schedule.arrivalDateTime, schedule.arrival.time)}{" "}
                {formatDate(schedule.arrivalDateTime)}
              </span>
              <span>{elapsedString(seg.elapsedTime)}</span>
              <span className="text-gray-400">
                {schedule.stopCount === 0
                  ? "Non Stop"
                  : `${schedule.stopCount} Stop(s)`}
              </span>
              {schedule.departure.terminal && (
                <span>Terminal: {schedule.departure.terminal}</span>
              )}
              <span>Cabin: {schedule.cabinCode}</span>
              <span>Seats: {schedule.seatsAvailable}</span>
            </div>
          );
        })}
      </div>

      {/* Fare Breakdown per Passenger Type */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Fare Breakdown
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-2 pr-3">Passenger</th>
                <th className="py-2 pr-3">Qty</th>
                <th className="py-2 pr-3">Fare Basis</th>
                <th className="py-2 pr-3">Base Fare</th>
                <th className="py-2 pr-3">Tax</th>
                <th className="py-2 pr-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {passengerTypeOrder.map((type) => {
                const fare = fares.find((f) => f.passengerType === type);
                if (!fare) return null;
                return (
                  <tr key={type} className="border-b border-gray-100">
                    <td className="py-2 pr-3 font-medium">
                      {passengerLabel[type] || type}
                    </td>
                    <td className="py-2 pr-3">{fare.passengerNumber}</td>
                    <td className="py-2 pr-3 text-gray-500">
                      {fare.fareBasisCode}
                    </td>
                    <td className="py-2 pr-3">
                      {currency} {formatNumber(fare.totalFare)}
                    </td>
                    <td className="py-2 pr-3">
                      {currency} {formatNumber(fare.totalTaxAmount)}
                    </td>
                    <td className="py-2 pr-3 font-semibold">
                      {currency}{" "}
                      {formatNumber(
                        (fare.totalFare || 0) + (fare.totalTaxAmount || 0),
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="font-semibold text-gray-800">
                <td className="py-2 pr-3" colSpan={3}>
                  Total
                </td>
                <td className="py-2 pr-3">
                  {currency}{" "}
                  {formatNumber(itinerary.saleCurrencyAmount?.totalFare)}
                </td>
                <td className="py-2 pr-3">
                  {currency}{" "}
                  {formatNumber(itinerary.saleCurrencyAmount?.taxFare)}
                </td>
                <td className="py-2 pr-3">
                  {currency}{" "}
                  {formatNumber(
                    (itinerary.saleCurrencyAmount?.totalFare || 0) +
                      (itinerary.saleCurrencyAmount?.taxFare || 0),
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Refund Info */}
      <div className="mt-3 text-xs text-gray-500">
        {itinerary.isRefundable ? (
          <span className="text-green-600">Refundable</span>
        ) : (
          <span className="text-red-500">Non-Refundable</span>
        )}
        {" | "}Validating: {fares[0]?.validatingCarrierCode || "N/A"}
        {fares[0] && (
          <>
            {" "}
            | Last Ticket: {fares[0].lastTicketDate} {fares[0].lastTicketTime}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchDetails;
