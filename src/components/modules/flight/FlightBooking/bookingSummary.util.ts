import dayjs from "dayjs";
import type { Itinerary } from "@/interface/flight";

export const TYPE_LABEL: Record<string, string> = {
  ADT: "Adult",
  C07: "Child",
  C03: "Kid",
  INF: "Infant",
};

export function formatTime(iso?: string): string {
  return iso ? dayjs(iso).format("HH:mm") : "--";
}

export function formatDate(iso?: string): string {
  return iso ? dayjs(iso).format("ddd, DD MMM YYYY") : "--";
}

export function formatDuration(depISO?: string, arrISO?: string): string {
  if (!depISO || !arrISO) return "--";
  const mins = dayjs(arrISO).diff(dayjs(depISO), "minute");
  if (!Number.isFinite(mins) || mins < 0) return "--";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export function stopLabel(count: number): string {
  if (count <= 0) return "Non Stop";
  if (count === 1) return "1 Stop";
  return `${count} Stops`;
}

export interface FlightLeg {
  carrierCode: string;
  flightName: string;
  flightNumber: number;
  cabinCode: string;
  fromCode: string;
  toCode: string;
  departISO?: string;
  arriveISO?: string;
  stops: number;
  duration: string;
  baggage?: string;
}

export function getLegs(itinerary: Itinerary): FlightLeg[] {
  const legs: FlightLeg[] = [];
  itinerary.flightDetails?.forEach((fd) => {
    const schedules = fd.schedules ?? [];
    const first = schedules[0];
    const last = schedules[schedules.length - 1];
    const totalStops =
      (first?.stopCount ?? 0) + Math.max(0, schedules.length - 1);
    const flightName = schedules
      .map((s) => s.flightName)
      .filter(Boolean)
      .join(", ");
    legs.push({
      carrierCode: first?.marketingCarrierCode ?? "--",
      flightNumber: first?.marketingFlightNumber ?? 0,
      cabinCode: first?.cabinCode ?? "",
      flightName,
      baggage: first?.baggage,
      fromCode: first?.departure.airport ?? "--",
      toCode: last?.arrival?.airport ?? first?.arrival?.airport ?? "--",
      departISO: first?.departureDateTime,
      arriveISO: last?.arrivalDateTime ?? first?.arrivalDateTime,
      stops: totalStops,
      duration: formatDuration(
        first?.departureDateTime,
        last?.arrivalDateTime,
      ),
    });
  });
  return legs;
}

export interface PriceSummary {
  currency: string;
  baseFare: number;
  taxes: number;
  discount: number;
  total: number;
}

export function getPriceSummary(itinerary: Itinerary): PriceSummary {
  const fare = itinerary.saleCurrencyAmount ?? {};
  const currency = itinerary.passengerFareBreakDown?.[0]?.currency ?? "BDT";
  const baseFare = fare.baseAmount ?? 0;
  const taxes = fare.taxFare ?? 0;
  const discount = fare.discountAmount ?? 0;
  const total =
    fare.offerAmount ?? fare.totalAmount ?? (baseFare + taxes - discount);
  return { currency, baseFare, taxes, discount, total };
}