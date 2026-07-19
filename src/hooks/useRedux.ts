"use client"; // 1. Next.js 16 Client Component Directive

import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
// 2. Updated to absolute/module path mapping if needed, or kept relative based on your architecture
import type { AppDispatch, RootState } from "../redux/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
