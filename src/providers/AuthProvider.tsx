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
    getUserInfo().then((user) => {
      if (user) {
        setUser({
          id: user.id,
          role: user.role,
          departments: user.admin?.department ?? "",
          full_name: user.profile?.full_name ?? "",
          email: user.email ?? "",
          agency_name: user.profile?.agency_name ?? null,
          image_key: user.profile?.image_key ?? user.profile?.image ?? null,
          balance: user.wallet?.balance ?? user.balance ?? 0,
          creditBalance: user.wallet?.creditBalance ?? user.creditBalance ?? 0,
        });
      } else {
        clearUser();
      }
    });
  }, [clearUser, setLoading, setUser]);

  return <>{children}</>;
}
