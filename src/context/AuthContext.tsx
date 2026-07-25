"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import axios from "axios";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  B2B = "B2B",
  B2C = "B2C",
}

export interface User {
  id: string;
  email: string;
  role: Role;
  status: string;

  balance?: number;
  creditBalance?: number;

  profile: {
    first_name: string;
    last_name: string;
    full_name: string;
    image_key: string | null;
    department: string | null;
    agency_name: string | null;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const http = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const response = await http.post("/auth/login", { email, password });
    const data = response.data.data;
    setUser(data.user);
    return data;
  };

  const refreshProfile = async () => {
    try {
      setLoading(true);
      const response = await http.get("/api/v1/users/profile");
      setUser(response.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await http.post("/auth/logout");
    } catch {
      // ignore
    }
    setUser(null);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
