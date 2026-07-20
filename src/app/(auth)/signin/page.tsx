import SigninForm from "@/components/auth/SigninForm";
import { Footer } from "@/components/shared";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | NEC Travels",
  description: "Sign in to your NEC Travels account to view bookings and manage your travel preferences.",
};

export default function SigninPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[url('/assets/images/auth-bg.jpg')] bg-cover bg-center">
      {/* Decorative spacer for flex layout balance */}
      <div aria-hidden="true" />

      <main className="flex flex-1 items-center justify-center py-10 px-4">
        <SigninForm />
      </main>

      <Footer />
    </div>
  );
}