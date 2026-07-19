import SignupForm from "@/components/auth/SignupForm";
import { Footer } from "@/components/shared";

export const metadata = {
  title: "Register Account | NEC Travels",
};

export default function SignupPage() {
  return (
    <>
      <div className="h-screen flex flex-col justify-between bg-[url('/assets/images/auth-bg.jpg')] bg-cover bg-center">
        <div></div>
        <SignupForm />
        <Footer />
      </div>
    </>
  );
}
