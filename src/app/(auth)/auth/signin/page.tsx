import SigninForm from "@/components/auth/SigninForm";
import { Footer } from "@/components/shared";

export const metadata = {
  title: "Sign In | NEC Travels",
};

export default function SigninPage() {
  return (
    <>
      <div className="h-screen flex flex-col justify-between bg-[url('/assets/images/auth-bg.jpg')] bg-cover bg-center">
        <div></div>
        <SigninForm />
        <Footer />
      </div>
    </>
  );
}
