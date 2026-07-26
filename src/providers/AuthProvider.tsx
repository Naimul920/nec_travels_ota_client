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
      .then((user: Record<string, any>) => {
        if (user) {
          setUser({
            id: user.id,
            role: user.role,
            departments: user.admin?.department ?? "",
          });
        } else {
          clearUser();
        }
      })
      .catch(() => clearUser());
  }, [clearUser, setLoading, setUser]);

  return <>{children}</>;
}