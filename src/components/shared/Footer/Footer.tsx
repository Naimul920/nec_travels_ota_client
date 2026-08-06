import { useAuthStore } from "@/store/auth.store";
import { ROLE } from "@/constant";
import AgencyFooter from "./AgencyFooter";
import MainFooter from "./MainFooter";

export default function Footer() {
  const { user } = useAuthStore();
  const role = user?.role;

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