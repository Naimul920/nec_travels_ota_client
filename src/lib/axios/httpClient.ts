import axios from "axios";
import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ApiResponse } from "@/types";
import { jwtDecode } from "jwt-decode";
import { setTokenInCookies } from "@/utils/token";
import { setUserRole, setDepartments } from "@/utils/session";

const API_BASE_URL = process.env.API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined in environment variables");
}

const tryRefreshToken = async (): Promise<boolean> => {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;
    if (!refreshToken) return false;

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return false;

    const json = await res.json();
    const { tokens, role, departments } = json.data || {};
    const {
      accessToken,
      refreshToken: newRefreshToken,
      expireToken,
    } = tokens || {};

    const accessMaxAge = expireToken
      ? expireToken - Math.floor(Date.now() / 1000)
      : undefined;

    if (accessToken)
      await setTokenInCookies("access_token", accessToken, accessMaxAge);
    if (newRefreshToken)
      await setTokenInCookies("refresh_token", newRefreshToken, 7 * 24 * 60 * 60); // 7 days
    if (role) await setUserRole(role);
    if (departments?.length) await setDepartments(departments);

    return true;
  } catch {
    return false;
  }
};

const axiosInstance = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (accessToken) {
    try {
      const { exp } = jwtDecode<{ exp: number }>(accessToken);
      const isExpiring = exp && exp - Math.floor(Date.now() / 1000) < 300;
      if (isExpiring) {
        await tryRefreshToken();
      }
    } catch {
      // invalid token — ignore, request will proceed with existing cookie
    }
  }

  const refreshedStore = await cookies();
  const cookieHeader = refreshedStore
    .getAll()
    .map((cookie: RequestCookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
  });

  return instance;
};

export interface ApiRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

const httpGet = async <TData>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.get<ApiResponse<TData>>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`GET request to ${endpoint} failed:`, error);
    throw error;
  }
};

const httpPost = async <TData>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
) => {
  try {
    const instance = await axiosInstance();
    const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`POST request to ${endpoint} failed:`, error);
    throw error;
  }
};

const httpPut = async <TData>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
) => {
  try {
    const response = await (
      await axiosInstance()
    ).put<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`PUT request to ${endpoint} failed:`, error);
    throw error;
  }
};

const httpPatch = async <TData>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
) => {
  try {
    const response = await (
      await axiosInstance()
    ).patch<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`PATCH request to ${endpoint} failed:`, error);
    throw error;
  }
};

const httpDelete = async <TData>(
  endpoint: string,
  options?: ApiRequestOptions,
) => {
  try {
    const response = await (
      await axiosInstance()
    ).delete<ApiResponse<TData>>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`DELETE request to ${endpoint} failed:`, error);
    throw error;
  }
};

export const httpClient = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
};
