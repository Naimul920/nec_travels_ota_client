import { useAuthStore } from "@/store/auth.store";
import { ROLE } from "@/constant";
import AgencyFooter from "./AgencyFooter";
import MainFooter from "./MainFooter";

export default function Footer() {
  const { user, isLoading } = useAuthStore();
  const role = user?.role;

  // Wait for the auth state to hydrate before rendering any footer, so
  // reloads don't briefly flash the wrong variant (e.g. B2C footer for B2B).
  if (isLoading) {
    return null;
  }

  // Render nothing for Admin & Super Admin
  if (role === ROLE.ADMIN || role === ROLE.SUPER_ADMIN) {
    return null;
  }

  // Render AgencyFooter for B2B users
  if (role === ROLE.B2B) {
    return <AgencyFooter />;
  }

  // Render MainFooter for B2C users and guest/public visitors
  return <MainFooter />;
}