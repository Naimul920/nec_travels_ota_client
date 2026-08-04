"use client";

import { useUserInfo } from "@/hooks/useUserInfo";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, clearUser, setLoading } = useAuthStore();
  const { data: user, isLoading } = useUserInfo();
  useEffect(() => {
    setLoading(isLoading);

    if (user) {
      setUser({
        id: user.id,
        role: user.role,
        departments: user.admin?.department ?? "",
        agency_code: user.b2b_user?.agency_code ?? "",
        full_name: user.profile?.full_name ?? "",
        first_name: user.profile?.first_name ?? "",
        last_name: user.profile?.last_name??"",
        email: user.email ?? "",
        phone:user?.phone??"",
        currency:user?.currency?.code ?? "",
        agency_name: user.profile?.agency_name ?? null,
        image: user.profile?.image ?? null,
        logo:user.b2b_user?.logo??null,
        balance: user.wallet?.balance ?? user.balance ?? 0,
        creditBalance: user.wallet?.creditBalance ?? user.creditBalance ?? 0,
      });
    } else if (!isLoading) {
      clearUser();
    }
  }, [user, isLoading, setUser, clearUser, setLoading]);

  return <>{children}</>;
}
