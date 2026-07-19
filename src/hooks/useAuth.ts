"use client"; // 1. Next.js 16 Client Component Directive

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";

// 2. Strongly typed RootState import (Highly recommended in Next.js/TypeScript environments)
// Instead of 'any', point this to your actual RootState path if available, e.g.:
// import type { RootState } from "../store";

export default function useAuth() {
  // Pulls user state directly out of the Redux client slice context
  const user = useSelector((state: any) => state.auth.user);

  return {
    user,
    isLogin: !!user,
  };
}
