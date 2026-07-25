"use client";

import { useMutation } from "@tanstack/react-query";
import { publicApi } from "@/lib/axios/publicApi";

interface LoginPayload {
  email: string;
  password: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await publicApi.post("/auth/login", payload);
      return response.data;
    },
  });
};
