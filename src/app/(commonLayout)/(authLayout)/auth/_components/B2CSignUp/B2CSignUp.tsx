"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";

import FormField from "../B2BSignUp/FormField";
import { OtpInput, PhoneInputField } from "@/components/ui";
import {
  b2cRegisterAction,
  resendOtpAction,
  verifyEmailAction,
} from "@/actions/auth.action";
import {
  b2cRegisterSchema,
  verifyEmailSchema,
} from "@/validations/auth.validation";
import { useUserCountryInfoStore } from "@/store/user_country.store";
import { useGetSystemCurrencies } from "@/store/currencies.store";
import { useRouter } from "next/navigation";

const DEFAULT_CURRENCY_ID = "22899850-ff1f-4e8e-aa1c-e8580a1e37aa"; // BDT

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

  const { geoLoading, selectedCurrencyCode, phoneCode } =
    useUserCountryInfoStore();
  console.log(
    "geoLoading, selectedCurrencyCode, phoneCode",
    geoLoading,
    selectedCurrencyCode,
    phoneCode,
  );
  const {
    currencies,
    initialized: currenciesInitialized,
    initialize: initializeCurrencies,
  } = useGetSystemCurrencies();

  useEffect(() => {
    if (!currenciesInitialized) initializeCurrencies();
  }, [currenciesInitialized, initializeCurrencies]);

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
          // currency_code: selectedCurrencyCode, implement later
          phone: values.phone,
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

  useEffect(() => {
    if (registerFormik.values.currency_Id) return;
    const match = currencies.find((c) => c.code === selectedCurrencyCode);
    const fallback = currencies.find((c) => c.code === "BDT");
    registerFormik.setFieldValue(
      "currency_Id",
      match?.id || fallback?.id || DEFAULT_CURRENCY_ID,
    );
  }, [currencies, selectedCurrencyCode, registerFormik.values.currency_Id]);

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

  const [resending, setResending] = useState(false);

  const handleResendOtp = async () => {
    if (!registeredEmail || resending) return;
    setResending(true);
    verifyFormik.setStatus(null);
    try {
      const result = await resendOtpAction({ email: registeredEmail });
      verifyFormik.setStatus({
        success: result.success,
        error: result.success ? undefined : result.message,
      });
    } catch {
      verifyFormik.setStatus({
        error: "Failed to resend OTP. Please try again.",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      {step === "register" ? (
        <form
          onSubmit={registerFormik.handleSubmit}
          className="space-y-6"
          noValidate
        >
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

            <PhoneInputField
              label="Phone number"
              name="phone"
              value={registerFormik.values.phone}
              onChange={(v) => registerFormik.setFieldValue("phone", v)}
              onBlur={() => registerFormik.setFieldTouched("phone", true)}
              error={Boolean(getRegisterError("phone"))}
              errorMessage={getRegisterError("phone")}
              required
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
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
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
            disabled={isRegistering || geoLoading}
            className="h-12 w-full rounded-xl bg-brand font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {geoLoading
              ? "Loading..."
              : isRegistering
                ? "Registering..."
                : "Register"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={verifyFormik.handleSubmit}
          className="space-y-6"
          noValidate
        >
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
              onClick={handleResendOtp}
              disabled={resending}
              className="font-semibold text-brand hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </p>
        </form>
      )}
    </>
  );
}
