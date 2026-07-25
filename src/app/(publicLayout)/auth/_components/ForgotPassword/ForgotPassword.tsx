"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { FiArrowLeft, FiMail, FiSend } from "react-icons/fi";


import { forgotPasswordSchema } from "../B2BSignUp/validation";
import FormField from "../B2BSignUp/FormField";
import Link from "next/link";

interface ForgotPasswordFormValues {
  email: string;
}

const initialValues: ForgotPasswordFormValues = {
  email: "",
};

type SubmitStatus = { type: "error"; message: string } | null;

export default function ForgotPassword() {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitStatus(null);

      try {
        console.log("Requesting password reset for:", values.email);
        // await post("/auth/forgot-password", values);

        setSubmittedEmail(values.email);
      } catch (error) {
        console.error("Reset request failed:", error);
        setSubmitStatus({
          type: "error",
          message: "We couldn't send the reset link. Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getError = (name: keyof ForgotPasswordFormValues) =>
    formik.touched[name] && formik.errors[name]
      ? formik.errors[name]
      : undefined;

  if (submittedEmail) {
    return (
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
            <FiSend size={20} />
          </div>

          <h2 className="mt-4 text-2xl font-bold text-slate-900">
            Check your email
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            If an account exists for{" "}
            <span className="font-medium text-slate-700">{submittedEmail}</span>
            , we&apos;ve sent a link to reset your password. The link expires in
            30 minutes.
          </p>

          <button
            type="button"
            onClick={() => {
              setSubmittedEmail(null);
              formik.resetForm();
            }}
            className="mt-6 text-sm font-medium text-brand hover:underline"
          >
            Didn&apos;t get it? Try a different email
          </button>

          <Link
            href="/auth/signin"
            className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700"
          >
            <FiArrowLeft />
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-8">
      <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Forgot your password?
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter the email linked to your account and we&apos;ll send you a
            reset link.
          </p>
        </div>

        <FormField
          label="Email address"
          //   name="email"
          type="email"
          placeholder="you@example.com"
          icon={<FiMail />}
          error={getError("email")}
          {...formik.getFieldProps("email")}
        />

        {submitStatus && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
          >
            {submitStatus.message}
          </div>
        )}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="h-12 w-full rounded-xl bg-brand font-medium text-white transition-colors hover:bg-brand/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {formik.isSubmitting ? "Sending link..." : "Send reset link"}
        </button>

        <Link
          href="/auth/signin"
          className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700"
        >
          <FiArrowLeft />
          Back to sign in
        </Link>
      </form>
    </div>
  );
}
