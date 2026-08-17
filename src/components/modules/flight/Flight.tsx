"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import Oneway from "./TripType/Oneway";
import Roundtrip from "./TripType/Roundtrip";
import MultiCity from "./TripType/Multicity";
import dayjs from "dayjs";
import { ErrorAlert } from "../../common/Alert/Alert";
import { decoding, encoding } from "@/utils";
import { modifySearch } from "@/store/flight.store";
import detectDomesticType from "@/utils/searchFlightSug/detactedDomesticType";
import { useAuthStore } from "@/store/auth.store";
import { ROLE } from "@/constant";
import {
  saveLastSearch,
  getLastSearch,
  type RecentSearch,
} from "@/utils/recentSearch";

type TripType = "oneway" | "roundtrip" | "multicity";
type TripField = "from" | "to" | "departure" | "return";
interface FlightProps {
  useFlight?: "home" | "search";
}

const DEFAULT_ONEWAY = {
  fromIata: "",
  toIata: "",
  departureDate: dayjs().format("YYYY-MM-DD"),
};

const DEFAULT_MULTICITY = [
  {
    fromIata: "",
    toIata: "",
    departureDate: dayjs().format("YYYY-MM-DD"),
  },
  {
    fromIata: "",
    toIata: "",
    departureDate: dayjs().format("YYYY-MM-DD"),
  },
];

// Default route for first-time visitors (no saved last search in localStorage)
const DEFAULT_AIRPORT = {
  fromIata: "DAC",
  toIata: "CXB",
  fromName: "Dhaka",
  toName: "Cox's Bazar",
};

const Flight: React.FC<FlightProps> = ({ useFlight }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, isLoggedIn } = useAuthStore();
  // console.log(user)
  const roleLower = user?.role?.toLowerCase();
 

  // Next.js Search Parameters extraction pipeline
  const params = useMemo(() => {
    const q = searchParams.get("q");
    if (!q) return new URLSearchParams();

    const decoded = decoding(q);
    return new URLSearchParams(decoded as string);
  }, [searchParams]);

  const hasInitialized = useRef(false);

  const initializeStateFromURL = () => {
    const urlTripType = params.get("tripType") as TripType | null;

    if (!urlTripType) {
      return {
        tripType: "oneway" as TripType,
        flightData: {
          oneway: {
            fromIata: "",
            toIata: "",
            departureDate: dayjs().format("YYYY-MM-DD"),
          },
          roundtrip: {
            fromIata: "",
            toIata: "",
            departureDate: dayjs().format("YYYY-MM-DD"),
            returnDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
          },
          multicity: [
            {
              fromIata: "",
              toIata: "",
              departureDate: dayjs().format("YYYY-MM-DD"),
            },
            {
              fromIata: "",
              toIata: "",
              departureDate: dayjs().format("YYYY-MM-DD"),
            },
          ],
        },
        traveler: {
          adults: 1,
          children: 0,
          kids: 0,
          infants: 0,
          cabin: "ECONOMY" as const,
        },
      };
    }

    const defaultFlightData = {
      oneway: {
        fromIata: "",
        toIata: "",
        departureDate: dayjs().format("YYYY-MM-DD"),
      },
      roundtrip: {
        fromIata: "",
        toIata: "",
        departureDate: dayjs().format("YYYY-MM-DD"),
        returnDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
      },
      multicity: [
        {
          fromIata: "",
          toIata: "",
          departureDate: dayjs().format("YYYY-MM-DD"),
        },
        {
          fromIata: "",
          toIata: "",
          departureDate: dayjs().format("YYYY-MM-DD"),
        },
      ],
    };

    let flightData = defaultFlightData;

    if (urlTripType === "oneway") {
      flightData = {
        ...defaultFlightData,
        oneway: {
          fromIata: params.get("from") || "",
          toIata: params.get("to") || "",
          departureDate: params.get("date") || dayjs().format("YYYY-MM-DD"),
        },
      };
    } else if (urlTripType === "roundtrip") {
      flightData = {
        ...defaultFlightData,
        roundtrip: {
          fromIata: params.get("from") || "",
          toIata: params.get("to") || "",
          departureDate: params.get("date") || dayjs().format("YYYY-MM-DD"),
          returnDate:
            params.get("returnDate") ||
            dayjs().add(1, "day").format("YYYY-MM-DD"),
        },
      };
    } else if (urlTripType === "multicity") {
      const segmentsParam = params.get("segments");
      if (segmentsParam) {
        const segmentsArray = segmentsParam.split(",").map((seg) => {
          const parts = seg.split("-");
          const fromIata = parts[0];
          const toIata = parts[1];
          const departureDate = parts.slice(2).join("-");
          return { fromIata, toIata, departureDate };
        });
        flightData = { ...defaultFlightData, multicity: segmentsArray };
      }
    }

    return {
      tripType: urlTripType,
      flightData,
      traveler: {
        adults: Number(params.get("adult") || 1),
        children: Number(params.get("child") || 0),
        kids: Number(params.get("kid") || 0),
        infants: Number(params.get("infant") || 0),
        cabin: (params.get("cabin") as "ECONOMY" | "BUSINESS") || "ECONOMY",
      },
    };
  };

  const [tripType, setTripType] = useState<TripType>(
    () => initializeStateFromURL().tripType,
  );

  const [flightData, setFlightData] = useState(
    () => initializeStateFromURL().flightData,
  );

  const [traveler, setTraveler] = useState(
    () => initializeStateFromURL().traveler,
  );

  const [locationNames, setLocationNames] = useState<Record<string, string>>(
    {},
  );

  const setLocationName = (key: string, name?: string) => {
    if (name) {
      setLocationNames((prev) => ({ ...prev, [key]: name }));
    }
  };

  // Prefill the form: use the user's last search from localStorage when one
  // exists, otherwise fall back to default airports (DAC -> CGP).
  useEffect(() => {
    if (searchParams.get("q")) return;
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const last = getLastSearch();

    const fromIata = last?.from || DEFAULT_AIRPORT.fromIata;
    const toIata = last?.to || DEFAULT_AIRPORT.toIata;
    const fromName = last?.fromName || DEFAULT_AIRPORT.fromName;
    const toName = last?.toName || DEFAULT_AIRPORT.toName;
    const trip = last?.tripType || "oneway";

    const emptyRoundtrip = {
      fromIata,
      toIata,
      departureDate: DEFAULT_ONEWAY.departureDate,
      returnDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
    };

    setTripType(trip);

    setFlightData(() => {
      if (trip === "roundtrip") {
        return {
          oneway: { ...DEFAULT_ONEWAY, fromIata, toIata },
          roundtrip: {
            fromIata,
            toIata,
            departureDate: last?.date || DEFAULT_ONEWAY.departureDate,
            returnDate:
              last?.returnDate ||
              dayjs(DEFAULT_ONEWAY.departureDate)
                .add(1, "day")
                .format("YYYY-MM-DD"),
          },
          multicity: DEFAULT_MULTICITY.map((s) => ({ ...s })),
        };
      }

      if (trip === "multicity") {
        const segments =
          last?.segments && last.segments.length > 0
            ? last.segments.map((seg) => ({
                fromIata: seg.from || "",
                toIata: seg.to || "",
                departureDate: seg.date || DEFAULT_ONEWAY.departureDate,
              }))
            : DEFAULT_MULTICITY.map((s, idx) => ({
                ...s,
                ...(idx === 0 && { fromIata, toIata }),
              }));
        return {
          oneway: { ...DEFAULT_ONEWAY, fromIata, toIata },
          roundtrip: emptyRoundtrip,
          multicity: segments,
        };
      }

      return {
        oneway: {
          ...DEFAULT_ONEWAY,
          fromIata,
          toIata,
          departureDate: last?.date || DEFAULT_ONEWAY.departureDate,
        },
        roundtrip: emptyRoundtrip,
        multicity: DEFAULT_MULTICITY.map((s) => ({ ...s })),
      };
    });

    setTraveler((prev) => ({
      ...prev,
      adults: last?.adults ?? prev.adults,
      children: last?.children ?? prev.children,
      kids: last?.kids ?? prev.kids,
      infants: last?.infants ?? prev.infants,
      cabin:
        last?.cabin === "ECONOMY" || last?.cabin === "BUSINESS"
          ? last.cabin
          : prev.cabin,
    }));

    setLocationName("oneway:from", fromName);
    setLocationName("oneway:to", toName);
    setLocationName("roundtrip:from", fromName);
    setLocationName("roundtrip:to", toName);

    if (trip === "multicity") {
      if (last?.segments && last.segments.length > 0) {
        last.segments.forEach((seg, idx) => {
          setLocationName(`multi:${idx}:from`, seg.fromName);
          setLocationName(`multi:${idx}:to`, seg.toName);
        });
      } else {
        setLocationName("multi:0:from", fromName);
        setLocationName("multi:0:to", toName);
      }
    }
  }, [searchParams]);

  const handleOnewayChange = (
    field: TripField,
    value: string,
    city?: string,
  ) => {
    setFlightData((prev) => ({
      ...prev,
      oneway: {
        ...prev.oneway,
        ...(field === "from" && { fromIata: value }),
        ...(field === "to" && { toIata: value }),
        ...(field === "departure" && { departureDate: value }),
      },
    }));
    if (field === "from") setLocationName(`oneway:from`, city);
    if (field === "to") setLocationName(`oneway:to`, city);
  };

  const handleRoundtripChange = (
    field: TripField,
    value: string,
    city?: string,
  ) => {
    setFlightData((prev) => {
      const updated = {
        ...prev.roundtrip,
        ...(field === "from" && { fromIata: value }),
        ...(field === "to" && { toIata: value }),
        ...(field === "departure" && { departureDate: value }),
        ...(field === "return" && { returnDate: value }),
      };

      if (
        updated.departureDate &&
        updated.returnDate &&
        dayjs(updated.returnDate).isBefore(dayjs(updated.departureDate))
      ) {
        updated.returnDate = dayjs(updated.departureDate)
          .add(2, "day")
          .format("YYYY-MM-DD");
      }

      return { ...prev, roundtrip: updated };
    });
    if (field === "from") setLocationName(`roundtrip:from`, city);
    if (field === "to") setLocationName(`roundtrip:to`, city);
  };

  const handleMultiCityChange = (
    index: number,
    field: "from" | "to" | "departure",
    value: string,
    city?: string,
  ) => {
    setFlightData((prev) => {
      const updated = [...prev.multicity];
      if (field === "from") updated[index].fromIata = value;
      if (field === "to") updated[index].toIata = value;
      if (field === "departure") updated[index].departureDate = value;
      return { ...prev, multicity: updated };
    });
    if (field === "from") setLocationName(`multi:${index}:from`, city);
    if (field === "to") setLocationName(`multi:${index}:to`, city);
  };

  const setMultiCityData: React.Dispatch<
    React.SetStateAction<typeof flightData.multicity>
  > = (data) => {
    setFlightData((prev) => ({
      ...prev,
      multicity: typeof data === "function" ? data(prev.multicity) : data,
    }));
  };

  const handleTripTypeChange = (type: TripType) => {
    if (type === tripType) return;

    setFlightData((prev) => {
      const source =
        tripType === "roundtrip"
          ? prev.roundtrip
          : tripType === "multicity"
            ? prev.multicity[0] || DEFAULT_MULTICITY[0]
            : prev.oneway;

      const fromIata = source.fromIata || DEFAULT_ONEWAY.fromIata;
      const toIata = source.toIata || DEFAULT_ONEWAY.toIata;
      const departureDate =
        source.departureDate || dayjs().format("YYYY-MM-DD");

      const next = { ...prev };

      if (type === "oneway") {
        next.oneway = { fromIata, toIata, departureDate };
      } else if (type === "roundtrip") {
        let returnDate =
          tripType === "roundtrip"
            ? prev.roundtrip.returnDate
            : tripType === "multicity"
              ? prev.multicity[prev.multicity.length - 1]?.departureDate || ""
              : "";
        if (
          !returnDate ||
          dayjs(returnDate).isBefore(dayjs(departureDate))
        ) {
          returnDate = dayjs(departureDate)
            .add(1, "day")
            .format("YYYY-MM-DD");
        }
        next.roundtrip = { fromIata, toIata, departureDate, returnDate };
      } else {
        const isRoundSource = tripType === "roundtrip";
        const secondDate = isRoundSource
          ? prev.roundtrip.returnDate ||
            dayjs(departureDate).add(1, "day").format("YYYY-MM-DD")
          : dayjs(departureDate).add(1, "day").format("YYYY-MM-DD");
        next.multicity = [
          { fromIata, toIata, departureDate },
          {
            fromIata: toIata,
            toIata: isRoundSource ? prev.roundtrip.fromIata : "",
            departureDate: secondDate,
          },
        ];
      }

      return next;
    });

    setTripType(type);
  };

  const handleTravelerChange = (
    field: keyof typeof traveler,
    value: unknown,
  ) => {
    setTraveler((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const buildSearchQuery = () => {
    const params = new URLSearchParams();

    const requireCity = (iata: string, label: string) => {
      if (!iata) {
        ErrorAlert("Missing City", `Please select ${label} city`);
        return false;
      }
      return true;
    };

    if (tripType === "oneway") {
      const { fromIata, toIata } = flightData.oneway;
      if (!requireCity(fromIata, "departure") || !requireCity(toIata, "destination")) return false;
      if (fromIata.substring(0, 2) === toIata.substring(0, 2)) {
        ErrorAlert(
          "Invalid Route",
          "From and To airports must be in different countries",
        );
        return false;
      }
    }

    if (tripType === "roundtrip") {
      const { fromIata, toIata } = flightData.roundtrip;
      if (!requireCity(fromIata, "departure") || !requireCity(toIata, "destination")) return false;
      if (fromIata.substring(0, 2) === toIata.substring(0, 2)) {
        ErrorAlert(
          "Invalid Route",
          "From and To airports must be in different countries",
        );
        return false;
      }
    }

    if (tripType === "multicity") {
      for (let i = 0; i < flightData.multicity.length; i++) {
        const { fromIata, toIata } = flightData.multicity[i];
        if (!requireCity(fromIata, "departure") || !requireCity(toIata, "destination")) return false;
        if (fromIata.substring(0, 2) === toIata.substring(0, 2)) {
          ErrorAlert(
            `Invalid Route (Leg ${i + 1})`,
            "From and To airports must be in different countries",
          );
          return false;
        }
      }
    }

    params.set("tripType", tripType);

    if (tripType === "oneway") {
      const { fromIata, toIata, departureDate } = flightData.oneway;
      params.set("from", fromIata);
      params.set("to", toIata);
      params.set("date", departureDate);

      const { bddom, npdom } = detectDomesticType(fromIata, toIata);
      if (bddom) params.set("bddom", "true");
      if (npdom) params.set("npdom", "true");
    }

    if (tripType === "roundtrip") {
      const { fromIata, toIata, departureDate, returnDate } =
        flightData.roundtrip;
      params.set("from", fromIata);
      params.set("to", toIata);
      params.set("date", departureDate);
      params.set("returnDate", returnDate);

      const { bddom, npdom } = detectDomesticType(fromIata, toIata);
      if (bddom) params.set("bddom", "true");
      if (npdom) params.set("npdom", "true");
    }

    if (tripType === "multicity") {
      const segments = flightData.multicity
        .map((seg) => `${seg.fromIata}-${seg.toIata}-${seg.departureDate}`)
        .join(",");

      params.set("segments", segments);

      const first = flightData.multicity[0];
      const { bddom, npdom } = detectDomesticType(first.fromIata, first.toIata);
      if (bddom) params.set("bddom", "true");
      if (npdom) params.set("npdom", "true");
    }

    params.set("adult", traveler.adults.toString());
    params.set("child", traveler.children.toString());
    params.set("kid", traveler.kids.toString());
    params.set("infant", traveler.infants.toString());
    params.set("cabin", traveler.cabin);

    return params.toString();
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (useFlight === "search") {
  //     modifySearch();
  //   }
  //   const query = buildSearchQuery();
  //   // Replaced navigate() with Next.js router.push() API
  //    const SearchRoute = user?.role ? `/console/${roleLower}/flight-search?q=${encoding(query)` : `/flight-search?q=${encoding(query)`;
  //   if (query)
  //     router.push(SearchRoute);
  // };

//   const handleSubmit = (e: React.FormEvent) => {
//   e.preventDefault();

//   if (useFlight === "search") {
//     modifySearch();
//   }

//   const query = buildSearchQuery();

//   if (!query) return;
//   // Replaced navigate() with Next.js router.push() API
//   const encodedQuery = encoding(query);
//   const searchRoute = user?.role === ROLE.B2C 
//     ? `/flight-search?q=${encodedQuery}` 
//     : `/flight-search?q=${encodedQuery}`;

//   router.push(searchRoute);
// };
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (useFlight === "search") {
    modifySearch();
  }

  const query = buildSearchQuery();

  if (!query) return;

  const encodedQuery = encoding(query);

  // 3. Persist last search into the browser localStorage (recent searches)
  const now = Date.now();
  const record: RecentSearch = {
    id: `${now}-${Math.random().toString(36).slice(2, 7)}`,
    tripType,
    query,
    q: encodedQuery,
    searchedAt: now,
    adults: traveler.adults,
    children: traveler.children,
    kids: traveler.kids,
    infants: traveler.infants,
    cabin: traveler.cabin,
  };

  if (tripType === "multicity") {
    record.segments = flightData.multicity.map((seg, idx) => ({
      from: seg.fromIata,
      to: seg.toIata,
      date: seg.departureDate,
      fromName: locationNames[`multi:${idx}:from`],
      toName: locationNames[`multi:${idx}:to`],
    }));
    record.from = flightData.multicity[0]?.fromIata;
    record.to = flightData.multicity[0]?.toIata;
    record.fromName = locationNames["multi:0:from"];
    record.toName = locationNames["multi:0:to"];
  } else {
    const data =
      tripType === "roundtrip" ? flightData.roundtrip : flightData.oneway;
    record.from = data.fromIata;
    record.to = data.toIata;
    record.date = data.departureDate;
    record.fromName = locationNames[`${tripType}:from`];
    record.toName = locationNames[`${tripType}:to`];
    if (tripType === "roundtrip") {
      record.returnDate = flightData.roundtrip.returnDate;
    }
  }

  saveLastSearch(record);

  // B2B logged-in users go to the console path; B2C and unauthenticated users go to public search
  const searchRoute =
    isLoggedIn && user?.role === ROLE.B2B
      ? `/console/${roleLower}/flight-search?q=${encodedQuery}`
      : `/flight-search?q=${encodedQuery}`;

  router.push(searchRoute);
};

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full relative ">
        {/* Trip Type selection inputs */}
        <div className="flex items-center justify-center gap-6 mb-3 zoom-0-9 md-zoom-1">
          {["oneway", "roundtrip", "multicity"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={tripType === type}
                onChange={() => handleTripTypeChange(type as TripType)}
                className="w-3 h-3 appearance-none border-2 border-primary rounded-full 
                checked:bg-brand checked:ring-2 checked:ring-primary checked:ring-offset-2"
              />
              <span className="text-xs md:text-sm font-medium text-gray-700">
                {type === "oneway"
                  ? "One Way"
                  : type === "roundtrip"
                    ? "Round Trip"
                    : "Multi City"}
              </span>
            </label>
          ))}
        </div>

        {/* Form Content Rendering */}
        <div
          className={`${
            useFlight === "search" ? "bg-white" : "bg-transparent"
          } md:py-5`}
        >
          {tripType === "oneway" && (
            <Oneway
              data={{
                ...flightData.oneway,
                fromName: locationNames["oneway:from"],
                toName: locationNames["oneway:to"],
              }}
              onChange={handleOnewayChange}
              traveler={traveler}
              changeTraveler={handleTravelerChange}
            />
          )}

          {tripType === "roundtrip" && (
            <Roundtrip
              data={{
                ...flightData.roundtrip,
                fromName: locationNames["roundtrip:from"],
                toName: locationNames["roundtrip:to"],
              }}
              onChange={handleRoundtripChange}
              traveler={traveler}
              changeTraveler={handleTravelerChange}
            />
          )}

          {tripType === "multicity" && (
            <MultiCity
              data={flightData.multicity.map((row, idx) => ({
                ...row,
                fromName: locationNames[`multi:${idx}:from`],
                toName: locationNames[`multi:${idx}:to`],
              }))}
              onChange={handleMultiCityChange}
              setData={setMultiCityData}
              traveler={traveler}
              changeTraveler={handleTravelerChange}
            />
          )}
        </div>

        {/* Form Submission Control */}
        <Button
          type="submit"
          className="mt-6 bg-primary text-white px-10 py-3 rounded-lg font-bold 
          absolute -bottom-14 left-1/2 -translate-x-1/2"
        >
          Search
        </Button>
      </form>
    </div>
  );
};

export default Flight;
