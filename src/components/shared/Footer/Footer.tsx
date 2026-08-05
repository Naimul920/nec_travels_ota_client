import { useAuthStore } from "@/store/auth.store";
import { ROLE } from "@/constant";
import AgencyFooter from "./AgencyFooter";
import MainFooter from "./MainFooter";

export default function Footer() {
  const { user } = useAuthStore();
  return (
    <>
      {/* <FlightRoute /> */}
      {user?.role == ROLE.B2B ? <AgencyFooter /> : <MainFooter />}
    </>
  );
}
