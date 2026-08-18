import airlines from "@/data/airlines.json";

const airlineMap: Record<string, string> = {};

for (const airline of airlines) {
  airlineMap[airline.iata_code] = airline.full_name;
}

export function getAirlineName(code: string | undefined | null): string {
  if (!code) return "";
  return airlineMap[code] ?? code;
}
