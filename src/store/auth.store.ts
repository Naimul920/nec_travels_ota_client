import { create } from "zustand";

export interface AuthUser {
  userId: string;
  deviceId: string;
  role?: string;
  email: string;
  phone: string;
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