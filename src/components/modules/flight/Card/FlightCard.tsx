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
  passengerCount: {
    adult: number;
    child: number;
    kid: number;
    infant: number;
  };
}

const FlightCard: React.FC<Props> = ({ itinerary, passengerCount }) => {
  const [state, setState] = useState<IState>({
    isDetails: false,
  });
  return (
    <>
      <SearchHeader
        state={state}
        setState={setState}
        itinerary={itinerary}
        passengerCount={passengerCount}
      />
      {state.isDetails && (
        <SearchDetails itinerary={itinerary} passengerCount={passengerCount} />
      )}
    </>
  );
};

export default FlightCard;
