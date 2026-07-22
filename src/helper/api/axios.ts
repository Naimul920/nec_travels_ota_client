import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// 1. Authenticated Client (Sends/Receives HttpOnly Cookies)
const authClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Guest/Public Client (NO Cookies Sent)
const guestClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptors
const handleSuccess = (response: AxiosResponse) => response.data;
const handleError = (error: any) => {
  if (error.response?.status === 401) {
    console.warn("Session expired or unauthorized.");
  }
  return Promise.reject(error.response?.data || error.message || error);
};

authClient.interceptors.response.use(handleSuccess, handleError);
guestClient.interceptors.response.use(handleSuccess, handleError);

// Strongly Typed HTTP Wrapper Interface
export interface HttpClient {
  get<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  post<T = any>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  patch<T = any>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

// Factory function to attach methods to an Axios instance
const createHttpClient = (client: AxiosInstance): HttpClient => ({
  get: <T>(
    url: string,
    params: Record<string, any> = {},
    config: AxiosRequestConfig = {},
  ): Promise<T> => client.get(url, { params, ...config }),

  post: <T>(
    url: string,
    data: unknown = {},
    config: AxiosRequestConfig = {},
  ): Promise<T> => client.post(url, data, config),

  put: <T>(
    url: string,
    data: unknown = {},
    config: AxiosRequestConfig = {},
  ): Promise<T> => client.put(url, data, config),

  patch: <T>(
    url: string,
    data: unknown = {},
    config: AxiosRequestConfig = {},
  ): Promise<T> => client.patch(url, data, config),

  delete: <T>(url: string, config: AxiosRequestConfig = {}): Promise<T> =>
    client.delete(url, config),
});

export const protectedApi = createHttpClient(authClient);
export const publicApi = createHttpClient(guestClient);

export default protectedApi;
