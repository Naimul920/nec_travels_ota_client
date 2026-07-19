/* eslint-disable @typescript-eslint/no-explicit-any */
// import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { getBaseUrl, getExtraHeaders } from "@/redux/api/apiConfig";
// import { logout } from "@/redux/features/authSlice";

// export const dynamicBaseQuery = async (
//   args: any,
//   api: any,
//   extraOptions: any,
// ) => {
//   const apiType = args.apiType;

//   const rawBaseQuery = fetchBaseQuery({
//     baseUrl: getBaseUrl(apiType),
//     credentials: "include",
//     prepareHeaders: (headers) => {
//       const state = api.getState();
//       const extraHeaders = getExtraHeaders(apiType, state);

//       Object.entries(extraHeaders).forEach(([key, value]) => {
//         headers.set(key, value);
//       });

//       return headers;
//     },
//   });

//   let result: any = await rawBaseQuery(args, api, extraOptions);
//   if (result?.error?.status === 401) {
//     console.warn("Access token expired, trying refresh token");
//     const refreshResult: any = await rawBaseQuery(
//       { url: "/auth/refresh", method: "POST" },
//       api,
//       extraOptions,
//     );
//     if (refreshResult?.data) {
//       console.log("Refresh success, retry original request...");
//       result = await rawBaseQuery(args, api, extraOptions);
//     } else {
//       console.log("Refresh failed, logout...");
//       api.dispatch(logout());
//     }
//     console.warn("Unauthorized Log out");
//   }
//   if (result?.error?.status === 403) {
//     console.log("logout...");
//     api.dispatch(logout());
//   }
//   return result;
// };

/************************UNCOMMENT UPPER CODE  ********* DELETE BELOW CODE*************************** */
// Pre-baked base64 string payloads that decode to their respective roles
// Helper to turn your expected payload into a decodable JWT string
const createMockToken = (payload: object) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const middlePayload = btoa(JSON.stringify(payload))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_"); // Ensure Base64URL compliance
  const signature = "dummy_signature_hash";

  return `${header}.${middlePayload}.${signature}`;
};

export const MOCK_PROFILES = {
  SUPERADMIN: {
    id: "85dbe469-a68c-4361-afda-dd0daf0a4862",
    email: "naim.necmoney@gmail.com",
    accessToken: createMockToken({
      userId: "85dbe469-a68c-4361-afda-dd0daf0a4862",
      email: "naim.necmoney@gmail.com",
      role: "SUPERADMIN", // ◄ Upper case matches your payload strategy
      deviceId: "cd1c9e8a-745e-4499-abb7-43c8832cdffd",
      iat: 1783925904,
      exp: 1783926804,
    }),
  },
  ADMIN: {
    id: "85dbe469-a68c-4361-afda-dd0daf0a4862",
    email: "naim.necmoney@gmail.com",
    accessToken: createMockToken({
      userId: "85dbe469-a68c-4361-afda-dd0daf0a4862",
      email: "naim.necmoney@gmail.com",
      role: "ADMIN",
      deviceId: "cd1c9e8a-745e-4499-abb7-43c8832cdffd",
      iat: 1783925904,
      exp: 1783926804,
    }),
  },
  AGENT: {
    id: "85dbe469-a68c-4361-afda-dd0daf0a4862",
    email: "naim.necmoney@gmail.com",
    accessToken: createMockToken({
      userId: "85dbe469-a68c-4361-afda-dd0daf0a4862",
      email: "naim.necmoney@gmail.com",
      role: "AGENT",
      deviceId: "cd1c9e8a-745e-4499-abb7-43c8832cdffd",
      iat: 1783925904,
      exp: 1783926804,
    }),
  },
  B2C: {
    id: "85dbe469-a68c-4361-afda-dd0daf0a4862",
    email: "naim.necmoney@gmail.com",
    accessToken: createMockToken({
      userId: "85dbe469-a68c-4361-afda-dd0daf0a4862",
      email: "naim.necmoney@gmail.com",
      role: "B2C",
      deviceId: "cd1c9e8a-745e-4499-abb7-43c8832cdffd",
      iat: 1783925904,
      exp: 1783926804,
    }),
  },
};

// MANUALLY FLIP THIS PROPERTY TO TEST DIFFERENT PAGES
export const ACTIVE_MOCK_PROFILE = MOCK_PROFILES.AGENT;
export const SHOULD_MOCK_FAIL = false;
//------------------------

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

export const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // 1. Intercept the login URL
  const targetUrl = typeof args === "string" ? args : args.url;

  if (targetUrl.includes("/api/v1/auth/login")) {
    // Simulate a brief network delay for realism (optional)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simulate an API failure if turned on
    if (SHOULD_MOCK_FAIL) {
      return {
        error: {
          status: 401,
          data: { message: "Invalid credentials (Mock Error)" },
        },
      };
    }

    // Simulate a successful API response returning the active profile wrapped in your standard data structure
    return {
      data: {
        status: "success",
        data: ACTIVE_MOCK_PROFILE, // ◄ Injected cleanly into your app
      },
    };
  }

  // 2. Fallback to normal behavior for all other requests
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: "/", // Dummy base URL since there is no backend
  });

  return rawBaseQuery(args, api, extraOptions);
};
