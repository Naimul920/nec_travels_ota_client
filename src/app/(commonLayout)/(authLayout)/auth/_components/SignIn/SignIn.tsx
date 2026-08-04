"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiEye, FiEyeOff, FiLock, FiMail, FiSend } from "react-icons/fi";

import FormField from "../B2BSignUp/FormField";
import { loginAction, verifyEmailAction } from "@/actions/auth.action";
import { useAuthStore } from "@/store/auth.store";
import {
  loginValidationSchema,
  verifyEmailSchema,
} from "@/validations/auth.validation";
import { LoginResponse } from "@/types/login.type";
import { FlightRoute } from "@/components/shared/FlightRoute/FlightRoute";

interface SignInFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const REMEMBER_KEY = "remember_me";

function loadSavedEmail(): { email: string; rememberMe: boolean } {
  if (typeof window === "undefined") return { email: "", rememberMe: false };
  try {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { email: parsed.email || "", rememberMe: true };
    }
  } catch {}
  return { email: "", rememberMe: false };
}

function saveEmail(email: string) {
  try {
    localStorage.setItem(REMEMBER_KEY, JSON.stringify({ email }));
  } catch {}
}

function clearSavedEmail() {
  try {
    localStorage.removeItem(REMEMBER_KEY);
  } catch {}
}

const initialValues: SignInFormValues = {
  email: "",
  password: "",
  rememberMe: false,
};

interface LoginProps {
  redirectPath?: string;
  noRedirect?: boolean;
  compact?: boolean;
  onSuccess?: () => void;
}

// Deterministic "barcode" bar widths — purely decorative
const BARCODE_BARS = [
  2, 4, 1, 3, 5, 2, 1, 4, 3, 2, 5, 1, 3, 2, 4, 1, 5, 2, 3, 1, 4, 2,
];

export default function SignIn({
  redirectPath,
  noRedirect = false,
  compact = false,
  onSuccess,
}: LoginProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser, clearUser } = useAuthStore();

  const searchParams = useSearchParams();
  const urlRedirect = searchParams.get("redirect");
  const effectiveRedirectPath = redirectPath || urlRedirect || undefined;

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: (payload: SignInFormValues) =>
      loginAction(
        { email: payload.email, password: payload.password },
        effectiveRedirectPath,
      ),
  });

  const verifyFormik = useFormik({
    initialValues: { otp: "" },
    validationSchema: verifyEmailSchema,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(null);
      try {
        if (!verifyEmail) return;
        const result = await verifyEmailAction({
          email: verifyEmail,
          otp: values.otp,
        });
        if (result.success) {
          setVerifyEmail(null);
          setNotice(result.message || "Your email has been verified. You can now sign in.");
        } else {
          helpers.setStatus({ error: result.message });
        }
      } catch {
        helpers.setStatus({ error: "Verification failed. Please try again." });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const formik = useFormik<SignInFormValues>({
    initialValues,
    validationSchema: loginValidationSchema,

    onSubmit: async (values, helpers) => {
      setError("");
      try {
        const result: LoginResponse = await login(values);
        if (result.success && values.rememberMe) {
          saveEmail(values.email);
        } else if (result.success) {
          clearSavedEmail();
        }

        if (!result.success) {
          if (result.code === "EMAIL_NOT_VERIFIED") {
            setVerifyEmail(values.email);
            return;
          }
          setError(result.message || "Invalid email or password");
          return;
        }
        await queryClient.invalidateQueries({
          queryKey: ["userInfo"],
        });

        if (result.redirectTo && !noRedirect) {
          router.push(result.redirectTo);
        }
        onSuccess?.();
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Invalid email or password",
        );
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const saved = loadSavedEmail();
    if (saved.rememberMe) {
      formik.setFieldValue("email", saved.email);
      formik.setFieldValue("rememberMe", true);
    }
  }, []);

  const getError = (name: keyof SignInFormValues) =>
    formik.touched[name] ? formik.errors[name] : undefined;

  return (
    <div
      className={
        compact
          ? "w-full"
          : "flex min-h-[calc(100svh-4rem)] w-full items-center justify-center px-4 py-10"
      }
    >
      <div
        className={
          compact
            ? "w-full"
            : "relative grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-[#12233D]/10 bg-white shadow-xl md:grid-cols-5"
        }
      >
        {/* Left ticket stub */}
        {!compact && (
          <div className="relative col-span-2 hidden flex-col justify-between overflow-hidden bg-brand p-10 md:flex">
            <div className="relative z-10 flex items-center gap-2">
              <FiSend className="rotate-45 text-white" size={18} />
              <p className="font-plex-mono text-xs tracking-[0.25em] text-white">
                NEC TRAVELS
              </p>
            </div>

            {/* Route line */}
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
<FlightRoute/>
                {/* <div className="relative flex-1">
                  <div className="border-t border-dashed border-[#9FB4C7]/50" />
                  <FiSend
                    className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 text-white"
                    size={14}
                  />
                </div> */}

                <div className="text-right">
                  <p className="font-grotesk text-lg font-medium text-[#F7F4EC]">
                    LHR
                  </p>
                  <p className="font-plex-mono text-[10px] tracking-widest text-[#9FB4C7]">
                    LONDON
                  </p>
                </div>
              </div>

              {/* <p className="font-grotesk text-2xl font-medium leading-snug text-[#F7F4EC]">
                Track every booking,
                <br />
                from check-in to landing.
              </p> */}

              <p className="font-grotesk text-xl font-medium leading-6 text-[#F7F4EC]">Every flight. <br/> Every destination. <br/> One trusted platform.</p>
            </div>

            {/* Barcode */}
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
                SECURE SIGN-IN · PASS NO. 048
              </p>
            </div>
          </div>
        )}

        {/* Perforated seam — desktop only */}
        {!compact && (
          <div className="pointer-events-none absolute inset-y-0 left-2/5 hidden -translate-x-1/2 border-l-2 border-dashed border-[#12233D]/15 md:block">
            <div className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-[#F7F4EC]" />
            <div className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-[#F7F4EC]" />
          </div>
        )}

        {/* Right form panel */}
        <div className={compact ? "w-full p-6 sm:p-8" : "col-span-1 p-8 sm:p-10 md:col-span-3"}>
          {verifyEmail ? (
            <div
              role="form"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                verifyFormik.submitForm();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  verifyFormik.submitForm();
                }
              }}
              className="mx-auto w-full max-w-sm space-y-6"
            >
              <div>
                <div className="mb-6 flex items-center gap-2 md:hidden">
                  <FiSend className="rotate-45 text-white" size={18} />
                  <p className="font-plex-mono text-xs tracking-[0.25em] text-[#12233D]">
                    NEC TRAVELS
                  </p>
                </div>

                <h2 className="font-grotesk text-3xl font-medium text-[#12233D]">
                  Verify your email
                </h2>

                <p className="mt-1 text-sm text-[#5B6B7A]">
                  Enter the OTP sent to <strong>{verifyEmail}</strong>
                </p>
              </div>

              {verifyFormik.status?.error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {verifyFormik.status.error}
                </div>
              )}

              {verifyFormik.status?.success && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                  {verifyFormik.status.success}
                </div>
              )}

              <div>
                <label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-slate-700">
                  OTP Code
                </label>
                <div className="relative">
                  <FiLock
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    {...verifyFormik.getFieldProps("otp")}
                    className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition-colors ${
                      verifyFormik.touched.otp && verifyFormik.errors.otp
                        ? "border-rose-300 bg-rose-50"
                        : "border-slate-200 bg-white focus:border-brand"
                    }`}
                  />
                </div>
                {verifyFormik.touched.otp && verifyFormik.errors.otp && (
                  <p className="mt-1 text-xs text-rose-500">{verifyFormik.errors.otp}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => verifyFormik.submitForm()}
                disabled={verifyFormik.isSubmitting}
                className="h-12 w-full rounded-xl bg-brand text-white transition-colors duration-200 hover:bg-brand/70 disabled:opacity-50"
              >
                {verifyFormik.isSubmitting ? "Verifying..." : "Verify email"}
              </button>

              <p className="text-center text-sm text-[#5B6B7A]">
                <button
                  type="button"
                  onClick={() => {
                    setVerifyEmail(null);
                    setError("");
                  }}
                  className="font-semibold text-brand hover:underline"
                >
                  Back to sign in
                </button>
              </p>
            </div>
          ) : (
            <div
              role="form"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                formik.submitForm();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  formik.submitForm();
                }
              }}
              className="mx-auto w-full max-w-sm space-y-6"
            >
              <div>
                <div className="mb-6 flex items-center gap-2 md:hidden">
                  <FiSend className="rotate-45 text-white" size={18} />
                  <p className="font-plex-mono text-xs tracking-[0.25em] text-[#12233D]">
                    NEC TRAVELS
                  </p>
                </div>

                <h2 className="font-grotesk text-3xl font-medium text-[#12233D]">
                  Welcome back
                </h2>

                <p className="mt-1 text-sm text-[#5B6B7A]">
                  Sign in to manage your bookings and boarding passes.
                </p>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {notice && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                  {notice}
                </div>
              )}

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
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-[#9FB4C7] hover:text-[#12233D]"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                }
                {...formik.getFieldProps("password")}
              />

              <div className="mt-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-brand">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formik.values.rememberMe}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-4 w-4 rounded border-[#9FB4C7]/60! accent-red-600 focus:ring-red-600/40!"
                  />
                  Remember me
                </label>

                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-medium text-brand hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="button"
              onClick={() => formik.submitForm()}
              disabled={formik.isSubmitting || isPending}
              className="h-12 w-full rounded-xl bg-brand text-white transition-colors duration-200 hover:bg-brand/70 disabled:opacity-50"
            >
              {formik.isSubmitting || isPending ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-center text-sm text-[#5B6B7A]">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-semibold text-brand hover:underline"
              >
                Sign up
              </Link>
            </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
