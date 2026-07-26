"use client";

import { getUserInfo } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, clearUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);
     getUserInfo()
      .then((user) => {
        console.log("Auth Provider", user)
        if (user) {
          setUser(user);
        } else {
          clearUser();
        }
      })
      .catch(() => clearUser());
    
  }, [clearUser, setLoading, setUser]);

  return <>{children}</>;
}