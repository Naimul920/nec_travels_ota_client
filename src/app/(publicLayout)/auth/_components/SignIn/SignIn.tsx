"use client";

import { useState } from "react";
import { useFormik } from "formik";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

import FormField from "../B2BSignUp/FormField";
import { signInSchema } from "../B2BSignUp/validation";
import Link from "next/link";

interface SignInFormValues {
  email: string;
  password: string;
}

const initialValues: SignInFormValues = {
  email: "",
  password: "",
};

type SubmitStatus = { type: "success" | "error"; message: string } | null;

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  const formik = useFormik<SignInFormValues>({
    initialValues,
    validationSchema: signInSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitStatus(null);

      try {
        console.log("Signing in with:", values);
        // await post("/auth/login", values);

        setSubmitStatus({
          type: "success",
          message: "Signed in successfully.",
        });
      } catch (error) {
        console.error("Sign-in failed:", error);
        setSubmitStatus({
          type: "error",
          message: "Invalid email or password. Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getError = (name: keyof SignInFormValues) =>
    formik.touched[name] && formik.errors[name]
      ? formik.errors[name]
      : undefined;

  const handleGoogleSignIn = () => {
    console.log("Continue with Google");
    // TODO: Google Sign-In
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-8">
      <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to your account to continue.
          </p>
        </div>

        <FormField
          label="Email address"
          type="email"
          placeholder="you@example.com"
          icon={<FiMail />}
          error={getError("email")}
          {...formik.getFieldProps("email")}
        />

        <div>
          <FormField
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            icon={<FiLock />}
            error={getError("password")}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-slate-400 transition-colors hover:text-slate-600"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            }
            {...formik.getFieldProps("password")}
          />

          <div className="mt-2 text-right">
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {submitStatus && (
          <div
            role="alert"
            className={`rounded-xl border p-4 text-sm ${
              submitStatus.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="h-12 w-full rounded-xl bg-emerald-600 font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {formik.isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        {/* Divider */}
        <div className="flex items-center">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="mx-4 text-xs font-medium uppercase tracking-wider text-slate-400">
            Or
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}