"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import {
  FiArrowLeft,
  FiMail,
  FiSend,
  FiKey,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { forgotPasswordAction, resetPasswordAction } from "@/actions/auth.action";
import { forgotSchema, resetPasswordSchema } from "@/validations/auth.validation";
import { OtpInput } from "@/components/ui";

const BARCODE_BARS = [2, 4, 1, 3, 5, 2, 1, 4, 3, 2, 5, 1, 3, 2, 4, 1, 5, 2, 3, 1, 4, 2];

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
        if (result.user_id) {
          setStep("reset");
        } else {
          helpers.setStatus({ success: result.message });
        }
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
    <div className="flex min-h-[calc(100svh-4rem)] w-full items-center justify-center px-4 py-10">
      <div className="relative grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-[#12233D]/10 bg-white shadow-2xl md:grid-cols-5">
        {/* Left ticket stub */}
        <div className="relative col-span-2 hidden flex-col justify-between overflow-hidden bg-brand p-10 md:flex">
          <div className="relative z-10 flex items-center gap-2">
            <FiKey className="text-white" size={18} />
            <p className="font-plex-mono text-xs tracking-[0.25em] text-white">
              NEC TRAVELS
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-left">
                <p className="font-grotesk text-lg font-medium text-[#F7F4EC]">
                  DAC
                </p>
                <p className="font-plex-mono text-[10px] tracking-widest text-[#9FB4C7]">
                  DHAKA
                </p>
              </div>
              <div className="relative flex-1">
                <div className="border-t border-dashed border-[#9FB4C7]/50" />
                <FiSend
                  className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 text-white"
                  size={14}
                />
              </div>
              <div className="text-right">
                <p className="font-grotesk text-lg font-medium text-[#F7F4EC]">
                  RST
                </p>
                <p className="font-plex-mono text-[10px] tracking-widest text-[#9FB4C7]">
                  RESET
                </p>
              </div>
            </div>

            <p className="font-grotesk text-2xl font-medium leading-snug text-[#F7F4EC]">
              {step === "email"
                ? "Forgot your password?\nWe&apos;ll help you reset it."
                : "Enter the OTP sent to\nyour email."}
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex h-8 items-end gap-[2px]">
              {BARCODE_BARS.map((w, i) => (
                <div
                  key={i}
                  className="bg-white/70"
                  style={{ width: `${w}px`, height: "100%" }}
                />
              ))}
            </div>
            <p className="mt-2 font-plex-mono text-[10px] tracking-[0.2em] text-white">
              PASSWORD RESET · PASS NO. 002
            </p>
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

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#12233D]">
                  Email address
                </label>
                <div className="relative">
                  <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9FB4C7]" size={18} />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...emailFormik.getFieldProps("email")}
                    className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition-colors ${
                      emailFormik.touched.email && emailFormik.errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-[#9FB4C7]/30 bg-white focus:border-brand"
                    }`}
                  />
                </div>
                {emailFormik.touched.email && emailFormik.errors.email && (
                  <p className="mt-1 text-xs text-red-500">{emailFormik.errors.email}</p>
                )}
              </div>

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

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#12233D]">
                  New password
                </label>
                <div className="relative">
                  <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9FB4C7]" size={18} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    {...resetFormik.getFieldProps("password")}
                    className={`w-full rounded-xl border py-3 pl-10 pr-10 text-sm outline-none transition-colors ${
                      getResetError("password")
                        ? "border-red-300 bg-red-50"
                        : "border-[#9FB4C7]/30 bg-white focus:border-brand"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9FB4C7] hover:text-[#12233D]"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {getResetError("password") && (
                  <p className="mt-1 text-xs text-red-500">{getResetError("password")}</p>
                )}
              </div>

              <div>
                <label htmlFor="password_confirmation" className="mb-1.5 block text-sm font-medium text-[#12233D]">
                  Confirm password
                </label>
                <div className="relative">
                  <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9FB4C7]" size={18} />
                  <input
                    id="password_confirmation"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    {...resetFormik.getFieldProps("password_confirmation")}
                    className={`w-full rounded-xl border py-3 pl-10 pr-10 text-sm outline-none transition-colors ${
                      getResetError("password_confirmation")
                        ? "border-red-300 bg-red-50"
                        : "border-[#9FB4C7]/30 bg-white focus:border-brand"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9FB4C7] hover:text-[#12233D]"
                  >
                    {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {getResetError("password_confirmation") && (
                  <p className="mt-1 text-xs text-red-500">{getResetError("password_confirmation")}</p>
                )}
              </div>

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
