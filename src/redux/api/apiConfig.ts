/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BASE_API, BASE_API_EXM, FLIGHT_API } from "@/constant";

export const getBaseUrl = (apiType: string) => {
  switch (apiType) {
    case BASE_API:
      return process.env.NEXT_PUBLIC_BASE_API;
    case FLIGHT_API:
      return process.env.NEXT_PUBLIC_FLIGHT_API;
    case BASE_API_EXM:
      return process.env.NEXT_PUBLIC_BASE_API_XXX;

    default:
      return process.env.NEXT_PUBLIC_BASE_API;
  }
};

export const getExtraHeaders = (
  apiType: string,
  _state: Record<string, any>,
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiType === BASE_API_EXM) {
    headers["Authorization"] = ``;
  }

  return headers;
};
