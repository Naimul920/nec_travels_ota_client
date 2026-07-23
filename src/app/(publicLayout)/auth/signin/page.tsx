import type { Metadata } from "next";
import SignIn from "../_components/SignIn/SignIn";

export const metadata: Metadata = {
  title: "Sign In | NEC Travels",
  description: "Sign in to your NEC Travels account to view bookings and manage your travel preferences.",
};

export default function SigninPage() {
  return (
    <SignIn/>
  );
}