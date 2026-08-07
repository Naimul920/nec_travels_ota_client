"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";

import FormField from "../B2BSignUp/FormField";
import { OtpInput } from "@/components/ui";
import { b2cRegisterAction, verifyEmailAction } from "@/actions/auth.action";
import {
  b2cRegisterSchema,
  verifyEmailSchema,
} from "@/validations/auth.validation";
import { useCurrencyStore } from "@/store/currency.store";
import { useRouter } from "next/navigation";

interface B2CRegisterFormValues {
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  currency_Id: string;
}

const registerInitialValues: B2CRegisterFormValues = {
  email: "",
  phone: "",
  password: "",
  password_confirmation: "",
  currency_Id: "",
};

export default function B2CSignUp() {
  const [step, setStep] = useState<"register" | "verify">("register");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const {
    currenciesLoading,
    phoneCode,
    selectedCurrencyId,
  } = useCurrencyStore();

  const { mutateAsync: doRegister, isPending: isRegistering } = useMutation({
    mutationFn: (payload: B2CRegisterFormValues) => b2cRegisterAction(payload),
  });

  const { mutateAsync: doVerify, isPending: isVerifying } = useMutation({
    mutationFn: (payload: { email: string; otp: string }) =>
      verifyEmailAction(payload),
  });

  const registerFormik = useFormik<B2CRegisterFormValues>({
    initialValues: registerInitialValues,
    validationSchema: b2cRegisterSchema,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(null);
      try {
        const result = await doRegister({
          ...values,
          phone: `${phoneCode}${values.phone}`,
        });
        if (result.success) {
          setRegisteredEmail(values.email);
          setStep("verify");
        } else {
          helpers.setStatus({ error: result.message });
        }
      } catch {
        helpers.setStatus({ error: "Something went wrong. Please try again." });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const verifyFormik = useFormik({
    initialValues: { otp: "" },
    validationSchema: verifyEmailSchema,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(null);
      try {
        const result = await doVerify({
          email: registeredEmail,
          otp: values.otp,
        });
        if (result.success) {
          helpers.setStatus({ success: result.message });
          router.push("/auth/signin");
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

  const getRegisterError = (name: keyof B2CRegisterFormValues) =>
    registerFormik.touched[name] && registerFormik.errors[name]
      ? registerFormik.errors[name]
      : undefined;

  useEffect(() => {
    if (registerFormik.values.currency_Id || !selectedCurrencyId) return;
    registerFormik.setFieldValue("currency_Id", selectedCurrencyId);
  }, [selectedCurrencyId, registerFormik.values.currency_Id]);

  return (
    <>
      {step === "register" ? (
        <form onSubmit={registerFormik.handleSubmit} className="space-y-6" noValidate>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              Customer registration
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Create your customer account.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={<FiMail />}
              error={getRegisterError("email")}
              {...registerFormik.getFieldProps("email")}
            />

            <FormField
              label="Phone number"
              type="tel"
              placeholder="1700000000"
              flag={phoneCode}
              prefix={phoneCode}
              error={getRegisterError("phone")}
              {...registerFormik.getFieldProps("phone")}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              icon={<FiLock />}
              error={getRegisterError("password")}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-400 transition-colors hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              }
              {...registerFormik.getFieldProps("password")}
            />

            <FormField
              label="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              icon={<FiLock />}
              error={getRegisterError("password_confirmation")}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-slate-400 transition-colors hover:text-slate-600"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              }
              {...registerFormik.getFieldProps("password_confirmation")}
            />
          </div>

          <p className="text-xs text-slate-400">
            Use at least 8 characters, including one uppercase letter and one
            number.
          </p>

          {registerFormik.status?.error && (
            <div
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
            >
              {registerFormik.status.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isRegistering || currenciesLoading}
            className="h-12 w-full rounded-xl bg-brand font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {currenciesLoading
              ? "Loading..."
              : isRegistering
                ? "Registering..."
                : "Register"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyFormik.handleSubmit} className="space-y-6" noValidate>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              Verify your email
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the OTP sent to <strong>{registeredEmail}</strong>
            </p>
          </div>

          {verifyFormik.status?.error && (
            <div
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
            >
              {verifyFormik.status.error}
            </div>
          )}

          {verifyFormik.status?.success && (
            <div
              role="alert"
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
            >
              {verifyFormik.status.success}
            </div>
          )}

          <div>
            <OtpInput
              label="OTP Code"
              length={6}
              value={verifyFormik.values.otp}
              onChange={(v) => verifyFormik.setFieldValue("otp", v)}
              onBlur={() => verifyFormik.setFieldTouched("otp", true)}
              error={verifyFormik.touched.otp && !!verifyFormik.errors.otp}
              errorMessage={verifyFormik.errors.otp as string | undefined}
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="h-12 w-full rounded-xl bg-brand font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isVerifying ? "Verifying..." : "Verify email"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Didn&apos;t receive it?{" "}
            <button
              type="button"
              onClick={() => setStep("register")}
              className="font-semibold text-brand hover:underline"
            >
              Try again
            </button>
          </p>
        </form>
      )}
    </>
  );
}