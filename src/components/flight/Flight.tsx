"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import Oneway from "./TripType/Oneway";
import Roundtrip from "./TripType/Roundtrip";
import MultiCity from "./TripType/Multicity";
import dayjs from "dayjs";
import { ErrorAlert } from "../common/Alert/Alert";
import { useDispatch } from "react-redux";
import { modifySearch } from "@/redux/features/flightSlice";
import { decoding, encoding } from "@/utils";
import detectDomesticType from "@/utils/domestic/detactedDomesticType";

type TripType = "oneway" | "roundtrip" | "multicity";
type TripField = "from" | "to" | "departure" | "return";
interface FlightProps {
  useFlight?: "home" | "search";
  route?: "agent" | "b2c";
}

const Flight: React.FC<FlightProps> = ({ useFlight, route = "agent" }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

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
            fromIata: "DAC",
            toIata: "CXB",
            departureDate: dayjs().format("YYYY-MM-DD"),
          },
          roundtrip: {
            fromIata: "DAC",
            toIata: "CXB",
            departureDate: dayjs().format("YYYY-MM-DD"),
            returnDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
          },
          multicity: [
            {
              fromIata: "DAC",
              toIata: "CCU",
              departureDate: dayjs().format("YYYY-MM-DD"),
            },
            {
              fromIata: "CCU",
              toIata: "DXB",
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
        fromIata: "DAC",
        toIata: "CXB",
        departureDate: dayjs().format("YYYY-MM-DD"),
      },
      roundtrip: {
        fromIata: "DAC",
        toIata: "CXB",
        departureDate: dayjs().format("YYYY-MM-DD"),
        returnDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
      },
      multicity: [
        {
          fromIata: "DAC",
          toIata: "CCU",
          departureDate: dayjs().format("YYYY-MM-DD"),
        },
        {
          fromIata: "CCU",
          toIata: "DXB",
          departureDate: dayjs().format("YYYY-MM-DD"),
        },
      ],
    };

    let flightData = defaultFlightData;

    if (urlTripType === "oneway") {
      flightData = {
        ...defaultFlightData,
        oneway: {
          fromIata: params.get("from") || "DAC",
          toIata: params.get("to") || "CXB",
          departureDate: params.get("date") || dayjs().format("YYYY-MM-DD"),
        },
      };
    } else if (urlTripType === "roundtrip") {
      flightData = {
        ...defaultFlightData,
        roundtrip: {
          fromIata: params.get("from") || "DAC",
          toIata: params.get("to") || "CXB",
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
          const [fromIata, toIata, departureDate] = seg.split("-");
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

  const handleOnewayChange = (field: TripField, value: string) => {
    setFlightData((prev) => ({
      ...prev,
      oneway: {
        ...prev.oneway,
        ...(field === "from" && { fromIata: value }),
        ...(field === "to" && { toIata: value }),
        ...(field === "departure" && { departureDate: value }),
      },
    }));
  };

  const handleRoundtripChange = (field: TripField, value: string) => {
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
  };

  const handleMultiCityChange = (
    index: number,
    field: "from" | "to" | "departure",
    value: string,
  ) => {
    setFlightData((prev) => {
      const updated = [...prev.multicity];
      if (field === "from") updated[index].fromIata = value;
      if (field === "to") updated[index].toIata = value;
      if (field === "departure") updated[index].departureDate = value;
      return { ...prev, multicity: updated };
    });
  };

  const setMultiCityData: React.Dispatch<
    React.SetStateAction<typeof flightData.multicity>
  > = (data) => {
    setFlightData((prev) => ({
      ...prev,
      multicity: typeof data === "function" ? data(prev.multicity) : data,
    }));
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

    if (tripType === "oneway") {
      const { fromIata, toIata } = flightData.oneway;
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

  useEffect(() => {
    hasInitialized.current = true;
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (useFlight === "search") {
      dispatch(modifySearch());
    }
    const query = buildSearchQuery();
    // Replaced navigate() with Next.js router.push() API
    if (query) router.push(`/flight-search?q=${encoding(query)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      {/* Trip Type selection inputs */}
      <div className="flex items-center justify-center gap-6 mb-6 zoom-0-9 md-zoom-1">
        {["oneway", "roundtrip", "multicity"].map((type) => (
          <label key={type} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={tripType === type}
              onChange={() => setTripType(type as TripType)}
              className="w-3 h-3 appearance-none border-2 border-primary rounded-full 
                checked:bg-secondary checked:ring-2 checked:ring-primary checked:ring-offset-2"
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
      <div className="bg-white md:py-5">
        {tripType === "oneway" && (
          <Oneway
            data={flightData.oneway}
            onChange={handleOnewayChange}
            traveler={traveler}
            changeTraveler={handleTravelerChange}
          />
        )}

        {tripType === "roundtrip" && (
          <Roundtrip
            data={flightData.roundtrip}
            onChange={handleRoundtripChange}
            traveler={traveler}
            changeTraveler={handleTravelerChange}
          />
        )}

        {tripType === "multicity" && (
          <MultiCity
            data={flightData.multicity}
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
        className={`bg-primary text-white px-10 py-3 rounded-lg font-bold absolute left-1/2 -translate-x-1/2 transition-all ${
          route === "b2c"
            ? "bottom-0 translate-y-20 shadow-lg hover:scale-105"
            : "-bottom-14"
        }`}
      >
        Search
      </Button>
    </form>
  );
};

export default Flight;
