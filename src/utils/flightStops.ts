import type { Itinerary } from "@/interface/flight";

export function getItineraryMaxStops(itin: Itinerary): number {
  const legs = itin?.flightDetails ?? [];
  let max = 0;
  legs.forEach((fd) => {
    const connections = Math.max(0, (fd?.schedules ?? []).length - 1);
    if (connections > max) max = connections;
  });
  return max;
}