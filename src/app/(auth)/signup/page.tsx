import SignupForm from "@/components/auth/SignupForm";
import { Footer } from "@/components/shared";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Account | NEC Travels",
  description: "Create your NEC Travels account to manage bookings and access exclusive deals.",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[url('/assets/images/auth-bg.jpg')] bg-cover bg-center">
      {/* Visual spacer to keep the layout centered or balanced */}
      <div aria-hidden="true" />
      
      <main className="w-full flex-1 flex items-center justify-center py-8">
        <SignupForm />
      </main>

      <Footer />
    </div>
  );
}