"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import axios from "axios";
// import { Role } from "@/helper/navigation";

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

const axiosInstance = axios.create({
  baseURL: API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  const saveTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);

    localStorage.setItem("refreshToken", refreshToken);
  };

  /**
   * LOGIN
   */
  const login = async (email: string, password: string) => {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    const data = response.data.data;

    saveTokens(data.tokens.accessToken, data.tokens.refreshToken);

    setUser(data.user);

    return data;
  };

  /**
   * REFRESH TOKEN
   */
  const refreshToken = async () => {
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (!storedRefreshToken) {
      return null;
    }

    try {
      const response = await axiosInstance.post("/auth/refresh", {
        refresh_token: storedRefreshToken,
      });

      const accessToken = response.data.data.accessToken;

      localStorage.setItem("accessToken", accessToken);

      return accessToken;
    } catch (error) {
      logout();

      return null;
    }
  };

  /**
   * GET USER PROFILE
   */
  const refreshProfile = async () => {
    try {
      setLoading(true);

      let accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setUser(null);

        return;
      }

      let response = await axiosInstance.get("/api/v1/users/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUser(response.data.data);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        const newToken = await refreshToken();

        if (newToken) {
          const response = await axiosInstance.get("/api/v1/users/profile", {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          });

          setUser(response.data.data);
        } else {
          logout();
        }
      } else {
        console.error(error);

        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * LOGOUT
   */
  const logout = () => {
    localStorage.removeItem("accessToken");

    localStorage.removeItem("refreshToken");

    setUser(null);
  };

  useEffect(() => {
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
