"use client";

import React, { useState } from "react";
import type { Itinerary, Schedule } from "@/interface/flight";
import dayjs from "dayjs";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa6";
import { FaBuilding } from "react-icons/fa";
import { MdOutlineFlight, MdOutlineAccessTime } from "react-icons/md";

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
  return dayjs(iso).format("ddd DD MMM YYYY");
}

function durationBetween(depISO: string, arrISO: string): string {
  const mins = dayjs(arrISO).diff(dayjs(depISO), "minute");
  if (!Number.isFinite(mins) || mins < 0) return "--";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
}

function stopLabel(schedules: Schedule[]): string {
  const connections = Math.max(0, schedules.length - 1);
  if (connections === 0) return "Non Stop";
  if (connections === 1) return "1 Stop";
  return `${connections} Stops`;
}

function formatNumber(value?: number): string {
  return typeof value === "number" && Number.isFinite(value)
    ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : "0";
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function frequencyLabel(freq: string): string {
  const shown: string[] = [];
  for (let i = 0; i < freq.length && i < 7; i++) {
    const ch = freq[i];
    if (ch && ch !== "*" && ch !== "-" && ch !== " " && ch !== "X") {
      shown.push(DAY_NAMES[i]);
    }
  }
  if (shown.length === 0) return "N/A";
  if (shown.length === 7) return "Daily";
  return shown.join(" · ");
}

const passengerLabel: Record<string, string> = {
  Adult: "Adult",
  Child: "Child",
  Kids: "Kid",
  Infant: "Infant",
};

const SummaryRow: React.FC<{
  label: string;
  value: number;
  currency: string;
  tone?: "default" | "discount";
}> = ({ label, value, currency, tone = "default" }) => (
  <tr className="border-t border-gray-100 text-gray-700">
    <td className="py-2 px-4 font-medium">{label}</td>
    <td className="py-2 px-4 text-center" />
    <td
      className={`py-2 px-4 text-right font-semibold ${
        tone === "discount" ? "text-green-600" : ""
      }`}
    >
      {currency} {formatNumber(value)}
    </td>
  </tr>
);

type TabKey = "flights" | "fare";

const SearchDetails: React.FC<Props> = ({ itinerary, passengerCount }) => {
  const [activeTab, setActiveTab] = useState<TabKey>("flights");

  const segments = itinerary.flightDetails;
  const fares = itinerary.passengerFareBreakDown;
  const currency = fares[0]?.currency || "BDT";

  const totalJourneyMinutes = (segments ?? []).reduce((sum, seg) => {
    const schedules = seg?.schedules ?? [];
    if (schedules.length === 0) return sum;
    const mins = dayjs(schedules[schedules.length - 1].arrivalDateTime).diff(
      dayjs(schedules[0].departureDateTime),
      "minute",
    );
    return sum + (Number.isFinite(mins) && mins > 0 ? Math.round(mins) : 0);
  }, 0);

  const passengerTypeOrder = ["Adult", "Child", "Kids", "Infant"];
  const passengerCountMap: Record<string, number> = {
    Adult: passengerCount.adult,
    Child: passengerCount.child,
    Kids: passengerCount.kid,
    Infant: passengerCount.infant,
  };

  const passengerRows = passengerTypeOrder
    .map((type) => ({
      type,
      label: passengerLabel[type] || type,
      qty: passengerCountMap[type] || 0,
    }))
    .filter((row) => row.qty > 0);

  const totalPassengers = passengerRows.reduce((sum, r) => sum + r.qty, 0);

  const sale = itinerary.saleCurrencyAmount;
  const summaryBase = sale?.baseAmount ?? 0;
  const summaryTax = sale?.taxFare ?? 0;
  const summaryGross = sale?.grossFare ?? summaryBase + summaryTax;
  const summaryAit = sale?.ait ?? 0;
  const summaryDiscount = sale?.discountAmount ?? 0;
  const summaryNet =
    sale?.offerAmount ?? summaryGross + summaryAit - summaryDiscount;
  const summaryTotal = sale?.totalAmount ?? summaryNet;

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: "flights", label: "Flight Details" },
    { key: "fare", label: "Fare Breakdown", count: totalPassengers },
  ];

  return (
    <div className="bg-white mt-1 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* TAB BAR */}
      <div className="flex border-b border-gray-200 bg-gray-50/60">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-5 py-3 text-sm font-semibold transition-colors focus:outline-none ${
                active
                  ? "text-primary bg-white"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
              {typeof tab.count === "number" && (
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {active && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* FLIGHT DETAILS TAB */}
      {activeTab === "flights" && (
        <div className="p-4 space-y-4">
          {segments.map((seg, idx) => {
            const schedules = seg?.schedules ?? [];
            if (schedules.length === 0) return null;

            const first = schedules[0];
            const last = schedules[schedules.length - 1];

            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Leg summary header */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <MdOutlineFlight className="text-primary" size={16} />
                    <span>
                      {first.departure.airport}
                      <span className="mx-1.5 text-gray-400">→</span>
                      {last.arrival.airport}
                    </span>
                    <span className="text-xs font-normal text-gray-500">
                      ({durationBetween(
                        first.departureDateTime,
                        last.arrivalDateTime,
                      )})
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold ${
                        schedules.length === 1
                          ? "bg-green-50 text-green-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {stopLabel(schedules)}
                    </span>
                  </div>
                </div>

                {/* Flights table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wide text-gray-400 border-b border-gray-100">
                        <th className="py-2 px-4 font-semibold">Flight</th>
                        <th className="py-2 px-4 font-semibold">Departure</th>
                        <th className="py-2 px-4 font-semibold">Duration</th>
                        <th className="py-2 px-4 font-semibold">Arrival</th>
                        <th className="py-2 px-4 font-semibold">Cabin</th>
                        <th className="py-2 px-4 font-semibold text-right">
                          Seats
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules.map((s, sIdx) => (
                        <React.Fragment key={`${s.flightName}-${sIdx}`}>
                          <tr className="border-b border-gray-100 last:border-b-0">
                            <td className="py-2.5 px-4">
                              <span className="inline-flex items-center gap-1.5 font-semibold text-primary">
                                <FaPlaneDeparture size={12} />
                                {s.flightName}
                              </span>
                              <span className="block text-[10px] text-gray-400 mt-0.5">
                                Operates: {frequencyLabel(s.frequency)}
                              </span>
                            </td>
                            <td className="py-2.5 px-4">
                              <span className="font-semibold text-gray-800">
                                {s.departure.airport}{" "}
                                {formatTime(
                                  s.departureDateTime,
                                  s.departure.time,
                                )}
                              </span>
                              <span className="block text-gray-400">
                                {formatDate(s.departureDateTime)}
                                {s.departure.terminal && (
                                  <>
                                    {" · "}
                                    <span className="inline-flex items-center gap-0.5 align-middle">
                                      <FaBuilding size={9} />
                                      T{s.departure.terminal}
                                    </span>
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="py-2.5 px-4">
                              <span className="inline-flex items-center gap-1 text-gray-600">
                                <MdOutlineAccessTime
                                  size={12}
                                  className="text-gray-400"
                                />
                                {durationBetween(
                                  s.departureDateTime,
                                  s.arrivalDateTime,
                                )}
                              </span>
                            </td>
                            <td className="py-2.5 px-4">
                              <span className="font-semibold text-gray-800">
                                {s.arrival.airport}{" "}
                                {formatTime(s.arrivalDateTime, s.arrival.time)}
                              </span>
                              <span className="block text-gray-400">
                                {formatDate(s.arrivalDateTime)}
                                {s.arrival.terminal && (
                                  <>
                                    {" · "}
                                    <span className="inline-flex items-center gap-0.5 align-middle">
                                      <FaBuilding size={9} />
                                      T{s.arrival.terminal}
                                    </span>
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-gray-600">
                              {s.cabinCode}
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <span className="inline-flex items-center gap-1 text-gray-600">
                                {s.seatsAvailable}
                                <span className="text-[10px] text-gray-400">
                                  left
                                </span>
                              </span>
                            </td>
                          </tr>
                          {sIdx < schedules.length - 1 && (
                            <tr>
                              <td colSpan={6} className="px-4 py-1.5">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600 bg-amber-50 rounded px-2 py-0.5">
                                  <FaPlaneArrival size={11} />
                                  Layover at {s.arrival.airport} ·{" "}
                                  {durationBetween(
                                    s.arrivalDateTime,
                                    schedules[sIdx + 1].departureDateTime,
                                  )}
                                </span>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* Total journey time */}
          {totalJourneyMinutes > 0 && (
            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-800">
              <span className="inline-flex items-center gap-1.5">
                <MdOutlineAccessTime size={16} className="text-primary" />
                Total Journey Time
              </span>
              <span className="text-primary text-base font-extrabold">
                {formatMinutes(totalJourneyMinutes)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* FARE BREAKDOWN TAB */}
      {activeTab === "fare" && (
        <div className="p-4">
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wide border-b border-gray-200">
                  <th className="py-2.5 px-4 font-semibold">Type</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Qty</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Fare</th>
                </tr>
              </thead>
              <tbody>
                {/* Section: Passenger Fare */}
                <tr className="bg-white">
                  <td
                    colSpan={3}
                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-gray-600"
                  >
                    Passenger Fare
                  </td>
                </tr>
                {passengerRows.length === 0 && (
                  <tr className="border-t border-gray-100">
                    <td className="py-2.5 px-4 text-gray-400" colSpan={3}>
                      No passenger selected
                    </td>
                  </tr>
                )}
                {passengerRows.map((row, idx) => (
                  <tr
                    key={row.type}
                    className={`border-t border-gray-100 ${
                      idx % 2 === 1 ? "bg-gray-50/50" : ""
                    }`}
                  >
                    <td className="py-2 px-4">
                      <span className="inline-flex items-center gap-2.5 font-semibold text-gray-800">
                        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase shrink-0">
                          {row.label[0]}
                        </span>
                        {row.label}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-8 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold">
                        x{row.qty}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-right text-gray-400">—</td>
                  </tr>
                ))}

                {/* Section: Total Fare Summary */}
                <tr className="border-t-2 border-gray-200 bg-gray-50">
                  <td
                    colSpan={3}
                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-gray-600"
                  >
                    Total Fare Summary
                  </td>
                </tr>
                <SummaryRow
                  label="Base Fare"
                  value={summaryBase}
                  currency={currency}
                />
                <SummaryRow
                  label="Tax"
                  value={summaryTax}
                  currency={currency}
                />
                <SummaryRow
                  label="AIT"
                  value={summaryAit}
                  currency={currency}
                />
                <SummaryRow
                  label="Gross Fare"
                  value={summaryGross}
                  currency={currency}
                />
                <SummaryRow
                  label="Discount"
                  value={summaryDiscount}
                  currency={currency}
                  tone="discount"
                />
                <tr className="border-t-2 border-gray-200 bg-primary/5 font-bold text-gray-900">
                  <td className="py-2.5 px-4">Total Amount</td>
                  <td className="py-2.5 px-4 text-center">
                    {totalPassengers}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    {summaryTotal !== summaryNet && (
                      <span className="mr-2 text-xs font-medium text-gray-400 line-through">
                        {currency} {formatNumber(summaryTotal)}
                      </span>
                    )}
                    <span className="text-sm font-extrabold text-primary">
                      {currency} {formatNumber(summaryNet)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FARE RULES / REFUND INFO */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 border-t border-gray-200 bg-gray-50/60 text-[11px] text-gray-500">
        <span
          className={`inline-flex items-center gap-1 font-semibold ${
            itinerary.isRefundable ? "text-green-600" : "text-red-500"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              itinerary.isRefundable ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {itinerary.isRefundable ? "Refundable" : "Non-Refundable"}
        </span>
        <span>
          Validating:{" "}
          <span className="font-semibold text-gray-700">
            {fares[0]?.validatingCarrierCode || "N/A"}
          </span>
        </span>
        {fares[0] && (
          <span>
            Last Ticket:{" "}
            <span className="font-semibold text-gray-700">
              {fares[0].lastTicketDate} {fares[0].lastTicketTime}
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchDetails;
