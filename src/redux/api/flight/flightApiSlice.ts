import { FLIGHT_API } from "../../../constant";
import baseApi from "../baseApi";

const API_PREFIX = "/api/v1";

const flightApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    flightSearch: builder.mutation({
      query: (payload) => ({
        url: `${API_PREFIX}/flight/search`,
        method: "POST",
        apiType: FLIGHT_API,
        body: { ...payload },
      }),
    }),
  }),
});

export const { useFlightSearchMutation } = flightApiSlice;
