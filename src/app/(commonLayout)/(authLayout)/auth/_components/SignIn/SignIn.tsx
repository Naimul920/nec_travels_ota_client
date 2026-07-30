"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiEye, FiEyeOff, FiLock, FiMail, FiSend } from "react-icons/fi";

import FormField from "../B2BSignUp/FormField";
import { loginAction } from "@/actions/auth.action";
import { useAuthStore } from "@/store/auth.store";
import { loginValidationSchema } from "@/validations/auth.validation";
import { LoginResponse } from "@/types/login.type";

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
}

// Deterministic "barcode" bar widths — purely decorative
const BARCODE_BARS = [
  2, 4, 1, 3, 5, 2, 1, 4, 3, 2, 5, 1, 3, 2, 4, 1, 5, 2, 3, 1, 4, 2,
];

export default function SignIn({ redirectPath }: LoginProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser, clearUser } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: (payload: SignInFormValues) =>
      loginAction(
        { email: payload.email, password: payload.password },
        redirectPath,
      ),
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
          setError(result.message || "Invalid email or password");
          return;
        }
        await queryClient.invalidateQueries({
          queryKey: ["userInfo"],
        });

        if (result.redirectTo) {
          router.push(result.redirectTo);
        }
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
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center  px-4 py-10">
      <div className="relative grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-[#12233D]/10 bg-white shadow-2xl md:grid-cols-5">
        {/* Left ticket stub */}
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

              <div className="relative flex-1">
                <div className="border-t border-dashed border-[#9FB4C7]/50" />
                <FiSend
                  className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 text-white"
                  size={14}
                />
              </div>

              <div className="text-right">
                <p className="font-grotesk text-lg font-medium text-[#F7F4EC]">
                  LHR
                </p>
                <p className="font-plex-mono text-[10px] tracking-widest text-[#9FB4C7]">
                  LONDON
                </p>
              </div>
            </div>

            <p className="font-grotesk text-2xl font-medium leading-snug text-[#F7F4EC]">
              Track every booking,
              <br />
              from check-in to landing.
            </p>
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

        {/* Perforated seam — desktop only */}
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
              type="submit"
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
          </form>
        </div>
      </div>
    </div>
  );
}
