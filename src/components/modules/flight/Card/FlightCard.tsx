"use client";
import React, { useState } from "react";
import SearchHeader from "./SearchHeader";
import SearchDetails from "./SearchDetails";
import type { Itinerary } from "../../../../interface/flight";

export interface IState {
  isDetails: boolean;
}

interface Props {
  itinerary: Itinerary;
  index: number;
  searchId: string;
  passengerCount: {
    adult: number;
    child: number;
    kid: number;
    infant: number;
  };
}

const FlightCard: React.FC<Props> = ({
  itinerary,
  index,
  searchId,
  passengerCount,
}) => {
  console.log("FlightCard", itinerary);
  const [state, setState] = useState<IState>({
    isDetails: false,
  });
  return (
    <>
      <SearchHeader
        state={state}
        setState={setState}
        itinerary={itinerary}
        index={index}
        searchId={searchId}
        passengerCount={passengerCount}
      />
      {state.isDetails && (
        <SearchDetails itinerary={itinerary} passengerCount={passengerCount} />
      )}
    </>
  );
};

export default FlightCard;
