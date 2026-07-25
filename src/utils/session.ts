"use server";

import { setCookie, getCookie, deleteCookie } from "./cookie";

export const setUserRole = async (role: string) => {
  await setCookie("user_role", role, 7 * 24 * 60 * 60);
};

export const getUserRole = async (): Promise<string | null> => {
  const value = await getCookie("user_role");
  return value ?? null;
};

export const deleteUserRole = async () => {
  await deleteCookie("user_role");
};

export const setDepartments = async (departments: string[]) => {
  await setCookie("user_departments", departments.join(","), 7 * 24 * 60 * 60);
};

export const getDepartments = async (): Promise<string[]> => {
  const raw = await getCookie("user_departments");
  if (!raw) return [];
  return raw.split(",").filter(Boolean);
};

export const deleteDepartments = async () => {
  await deleteCookie("user_departments");
};
