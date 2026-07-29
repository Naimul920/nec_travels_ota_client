import { create } from "zustand";

export interface AuthUser {
  id: string;
  role: string;
  departments: string;
  full_name: string;
  first_name:string;
  last_name:string;
  email: string;
  phone:string;
  agency_name: string | null;
  image_key: string | null;
  balance?: number;
  creditBalance?: number;
}

interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;

  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true,

  setUser: (user) => set({ user, isLoggedIn: true, isLoading: false }),
  clearUser: () => set({ user: null, isLoggedIn: false, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
