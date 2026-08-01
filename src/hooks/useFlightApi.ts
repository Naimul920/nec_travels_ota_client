"use client";

import { useMutation } from "@tanstack/react-query";
import { searchFlightAction } from "@/actions/flight.action";
import type { SearchPayload } from "@/interface/flight";

export const useFlightSearchMutation = () => {
  return useMutation({
    mutationFn: (payload: SearchPayload) => searchFlightAction(payload),
  });
};
