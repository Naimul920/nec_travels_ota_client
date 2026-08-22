"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import {
  FiArrowLeft,
  FiMail,
  FiKey,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiShield,
} from "react-icons/fi";
import { forgotPasswordAction, resetPasswordAction } from "@/actions/auth.action";
import { forgotSchema, resetPasswordSchema } from "@/validations/auth.validation";
import { OtpInput } from "@/components/ui";
import FormField from "../B2BSignUp/FormField";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [userId, setUserId] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutateAsync: sendOtp, isPending: isOtpPending } = useMutation({
    mutationFn: (email: string) => forgotPasswordAction(email),
  });

  const { mutateAsync: resetPwd, isPending: isResetPending } = useMutation({
    mutationFn: (payload: {
      user_id: string;
      otp: string;
      password: string;
      password_confirmation: string;
    }) => resetPasswordAction(payload),
  });

  const emailFormik = useFormik({
    initialValues: { email: "" },
    validationSchema: forgotSchema,
    onSubmit: async (values, helpers) => {
      helpers.setStatus({ error: "", success: "" });
      const result = await sendOtp(values.email);
      if (result.success) {
        setUserId(result.user_id);
        setStep("reset");
      } else {
        helpers.setStatus({ error: result.message });
      }
      helpers.setSubmitting(false);
    },
  });

  const resetFormik = useFormik({
    initialValues: { otp: "", password: "", password_confirmation: "" },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values, helpers) => {
      if (!userId) return;
      helpers.setStatus({ error: "", success: "" });
      const result = await resetPwd({
        user_id: userId,
        ...values,
      });
      if (result.success) {
        helpers.setStatus({ success: result.message });
      } else {
        helpers.setStatus({ error: result.message });
      }
      helpers.setSubmitting(false);
    },
  });

  const getResetError = (name: "otp" | "password" | "password_confirmation") =>
    resetFormik.touched[name] ? resetFormik.errors[name] : undefined;

  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-[#12233D]/10 bg-white shadow-xl md:grid-cols-5">
        {/* Left ticket stub */}
        <div className="relative col-span-2 hidden flex-col overflow-hidden bg-linear-to-l from-[#F0F9F1] via-[#B9EBCF] to-[#6FDB9E] p-10 md:flex">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(#12233D_1px,transparent_1px)] [background-size:8px_8px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
          />
          <div className="relative z-10 flex items-center gap-2">
            <FiKey className="text-brand" size={18} />
            <p className="font-plex-mono text-xs tracking-[0.25em] text-[#12233D]">
              NEC TRAVELS
            </p>
          </div>

          <div className="relative z-10 flex flex-1 flex-col justify-center space-y-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/70 bg-white/55 text-xl text-brand shadow-sm backdrop-blur-sm">
              <FiShield aria-hidden="true" />
            </div>

            <div>
              <p className="font-grotesk text-2xl font-medium leading-tight text-[#12233D]">
                Return to your journey.
              </p>
              <p className="mt-2 text-xs leading-5 text-[#42566b]">
                Recover your account securely in a few quick steps. Your travel data remains protected.
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-3.5 shadow-lg ring-1 ring-[#12233D]/5 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between border-b border-dashed border-[#12233D]/15 pb-2.5">
                <p className="font-plex-mono text-[10px] font-bold tracking-[0.18em] text-[#12233D]">ACCOUNT RECOVERY</p>
                <span className="rounded-full bg-brand/10 px-2 py-1 text-[9px] font-bold uppercase text-brand">Secure</span>
              </div>

              <ol className="space-y-2">
                {[
                  { label: "Confirm your email", complete: step === "reset" },
                  { label: "Verify the OTP code", complete: false },
                  { label: "Create a new password", complete: false },
                ].map((item, index) => {
                  const active = step === "email" ? index === 0 : index === 1;
                  return (
                    <li key={item.label} className="flex items-center gap-3">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${item.complete ? "bg-brand text-white" : active ? "border-2 border-brand bg-white text-brand" : "bg-slate-100 text-slate-400"}`}>
                        {item.complete ? <FiCheck aria-hidden="true" /> : index + 1}
                      </span>
                      <span className={`text-xs font-semibold ${active || item.complete ? "text-[#12233D]" : "text-slate-400"}`}>{item.label}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

        </div>

        {/* Perforated seam */}
        <div className="pointer-events-none absolute inset-y-0 left-2/5 hidden -translate-x-1/2 border-l-2 border-dashed border-[#12233D]/15 md:block">
          <div className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-[#F7F4EC]" />
          <div className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-[#F7F4EC]" />
        </div>

        {/* Right form panel */}
        <div className="col-span-1 p-8 sm:p-10 md:col-span-3">
          {step === "email" ? (
            <form
              onSubmit={emailFormik.handleSubmit}
              className="mx-auto w-full max-w-sm space-y-6"
              noValidate
            >
              <div>
                <div className="mb-6 flex items-center gap-2 md:hidden">
                  <p className="font-plex-mono text-xs tracking-[0.25em] text-[#12233D]">
                    NEC TRAVELS
                  </p>
                </div>

                <Link
                  href="/auth/signin"
                  className="mb-4 flex items-center gap-1 text-xs font-medium text-brand hover:underline"
                >
                  <FiArrowLeft /> Back to sign in
                </Link>

                <h2 className="font-grotesk text-3xl font-medium text-[#12233D]">
                  Reset password
                </h2>

                <p className="mt-1 text-sm text-[#5B6B7A]">
                  Enter your email and we&apos;ll send you an OTP to reset your password.
                </p>
              </div>

              {emailFormik.status?.error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {emailFormik.status.error}
                </div>
              )}

              {emailFormik.status?.success && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {emailFormik.status.success}
                </div>
              )}

              <FormField
                label="Email address"
                type="email"
                placeholder="you@example.com"
                icon={<FiMail />}
                error={emailFormik.touched.email ? emailFormik.errors.email : undefined}
                {...emailFormik.getFieldProps("email")}
              />

              <button
                type="submit"
                disabled={isOtpPending}
                className="h-12 w-full rounded-xl bg-brand text-white transition-colors duration-200 hover:bg-brand/90 disabled:opacity-50"
              >
                {isOtpPending ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={resetFormik.handleSubmit}
              className="mx-auto w-full max-w-sm space-y-6"
              noValidate
            >
              <div>
                <div className="mb-6 flex items-center gap-2 md:hidden">
                  <p className="font-plex-mono text-xs tracking-[0.25em] text-[#12233D]">
                    NEC TRAVELS
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="mb-4 flex items-center gap-1 text-xs font-medium text-brand hover:underline"
                >
                  <FiArrowLeft /> Back
                </button>

                <h2 className="font-grotesk text-3xl font-medium text-[#12233D]">
                  Set new password
                </h2>

                <p className="mt-1 text-sm text-[#5B6B7A]">
                  Enter the OTP sent to your email and your new password.
                </p>
              </div>

              {resetFormik.status?.error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {resetFormik.status.error}
                </div>
              )}

              {resetFormik.status?.success && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {resetFormik.status.success}
                  <Link href="/auth/signin" className="ml-1 font-semibold underline">
                    Sign in
                  </Link>
                </div>
              )}

              <div>
                <OtpInput
                  label="OTP Code"
                  length={6}
                  value={resetFormik.values.otp}
                  onChange={(v) => {
                    resetFormik.setFieldValue("otp", v);
                  }}
                  onBlur={() => {
                    resetFormik.setFieldTouched("otp", true);
                  }}
                  error={getResetError("otp") ? true : false}
                  errorMessage={getResetError("otp") as string | undefined}
                />
              </div>

              <FormField
                label="New password"
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                icon={<FiLock />}
                error={getResetError("password") as string | undefined}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-[#9FB4C7] hover:text-[#12233D]"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                }
                {...resetFormik.getFieldProps("password")}
              />

              <FormField
                label="Confirm password"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                icon={<FiLock />}
                error={getResetError("password_confirmation") as string | undefined}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"}
                    className="text-[#9FB4C7] hover:text-[#12233D]"
                  >
                    {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                }
                {...resetFormik.getFieldProps("password_confirmation")}
              />

              <button
                type="submit"
                disabled={isResetPending}
                className="h-12 w-full rounded-xl bg-brand text-white transition-colors duration-200 hover:bg-brand/90 disabled:opacity-50"
              >
                {isResetPending ? "Resetting..." : "Reset password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
