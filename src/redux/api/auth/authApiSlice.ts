"use client";

import { publicApi } from "@/helper/api/axios";
import { useState, useCallback } from "react";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  data: {
    user: any;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export const useLoginMutation = () => {
  const [data, setData] = useState<LoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const response = await publicApi.post<any>("/auth/login", payload);
      const result = response as unknown as LoginResponse;
      if (result?.data?.tokens) {
        localStorage.setItem("accessToken", result.data.tokens.accessToken);
        localStorage.setItem("refreshToken", result.data.tokens.refreshToken);
      }
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return [mutate, { data, isLoading, isError, error }] as const;
};