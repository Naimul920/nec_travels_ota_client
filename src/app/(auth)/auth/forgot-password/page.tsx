import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Footer } from "@/components/shared";

export const metadata = {
  title: "Forgot Password | NEC Travels",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="h-screen flex flex-col justify-between bg-[url('/assets/images/auth-bg.jpg')] bg-cover bg-center">
        <div></div>
        <ForgotPasswordForm />
        <Footer />
      </div>
    </>
  );
}
