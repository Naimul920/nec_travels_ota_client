import { BASE_API } from "../../../constant";
import { loginSuccess, logout } from "../../features/authSlice";
import baseApi from "../baseApi";

const API_PREFIX = "/api/v1";

export const authApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (payload) => ({
        url: `${API_PREFIX}/auth/register`,
        method: "POST",
        apiType: BASE_API,
        body: { ...payload },
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: `${API_PREFIX}/auth/login`,
        method: "POST",
        apiType: BASE_API,
        body: { ...credentials },
      }),
      async onQueryStarted(_requestName, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Data==>>>>>", data);
          dispatch(loginSuccess(data?.data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${API_PREFIX}/auth/logout`,
        method: "POST",
        apiType: BASE_API,
        body: {},
      }),
      async onQueryStarted(_requestName, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data?.statusCode);
          if (data?.statusCode) {
            dispatch(logout());
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
    userInfo: builder.query({
      query: () => ({
        url: `${API_PREFIX}/auth/profile`,
        method: "GET",
        apiType: BASE_API,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useUserInfoQuery,
} = authApiSlice;
