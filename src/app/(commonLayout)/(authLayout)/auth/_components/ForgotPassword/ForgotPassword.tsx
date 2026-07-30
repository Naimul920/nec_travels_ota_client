"use client";

import Link from "next/link";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { FiArrowLeft, FiMail, FiSend, FiKey } from "react-icons/fi";
import { forgotPasswordAction } from "@/actions/auth.action";
import { forgotSchema } from "@/validations/auth.validation";

const BARCODE_BARS = [2, 4, 1, 3, 5, 2, 1, 4, 3, 2, 5, 1, 3, 2, 4, 1, 5, 2, 3, 1, 4, 2];

export default function ForgotPasswordForm() {
  const { mutateAsync: sendOtp, isPending } = useMutation({
    mutationFn: (email: string) => forgotPasswordAction(email),
  });

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: forgotSchema,
    onSubmit: async (values, helpers) => {
      helpers.setStatus({ error: "", success: "" });
      const result = await sendOtp(values.email);
      if (result.success) {
        helpers.setStatus({ success: result.message });
      } else {
        helpers.setStatus({ error: result.message });
      }
      helpers.setSubmitting(false);
    },
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-4 py-10">
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
              Forgot your password?
              <br />
              We&apos;ll help you reset it.
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
          <form
            onSubmit={formik.handleSubmit}
            className="mx-auto w-full max-w-sm space-y-6"
            noValidate
          >
            <div>
              <div className="mb-6 flex items-center gap-2 md:hidden">
                {/* <FiKey className="text-white" size={18} /> */}
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

            {formik.status?.error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formik.status.error}
              </div>
            )}

            {formik.status?.success && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {formik.status.success}
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
                  {...formik.getFieldProps("email")}
                  className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition-colors ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-[#9FB4C7]/30 bg-white focus:border-brand"
                  }`}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="h-12 w-full rounded-xl bg-brand text-white transition-colors duration-200 hover:bg-brand/90 disabled:opacity-50"
            >
              {isPending ? "Sending..." : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
