import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "@/redux/api/baseQuery";

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: dynamicBaseQuery,
  tagTypes: ["User"],
  endpoints: () => ({}),
});

export default baseApi;
