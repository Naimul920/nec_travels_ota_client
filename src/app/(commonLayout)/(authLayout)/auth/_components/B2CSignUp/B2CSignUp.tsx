"use client";

import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { showAlert } from "@/components/common/Alert/ShowAlert";
import { useGeoStore, getGeoCountryCode } from "@/store/geo.store";

interface B2CRegisterFormValues {
  email: string;
  phone: string;
  country: string;
  password: string;
  password_confirmation: string;
}

const registerInitialValues: B2CRegisterFormValues = {
  email: "",
  phone: "",
  country: "",
  password: "",
  password_confirmation: "",
};

export default function B2CSignUp() {
  const [step, setStep] = useState<"register" | "verify">("register");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

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
          country: values.country,
        });
        if (result.success) {
          setRegisteredEmail(values.email);
          setStep("verify");
          showAlert({
            title: "Registration successful",
            text: result.message || "Please verify your email to continue.",
            variant: "success",
            confirmText: "Continue",
          });
        } else {
          showAlert({
            title: "Registration failed",
            text: result.message || "Something went wrong. Please try again.",
            variant: "error",
            confirmText: "OK",
          });
        }
      } catch {
        showAlert({
          title: "Registration failed",
          text: "Something went wrong. Please try again.",
          variant: "error",
          confirmText: "OK",
        });
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
          showAlert({
            title: "Email verified",
            text: result.message || "Your email has been verified successfully.",
            variant: "success",
            confirmText: "Continue",
          });
          router.push("/auth/signin");
        } else {
          showAlert({
            title: "Verification failed",
            text: result.message || "Please check the OTP and try again.",
            variant: "error",
            confirmText: "OK",
          });
        }
      } catch {
        showAlert({
          title: "Verification failed",
          text: "Verification failed. Please try again.",
          variant: "error",
          confirmText: "OK",
        });
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

  const geo = useGeoStore((s) => s.geo);
  const geoCountryCode = getGeoCountryCode(geo);

  // Auto-fill the country from geo detection (only if the user hasn't
  // chosen a value yet, so manual edits are preserved).
  useEffect(() => {
    if (!geoCountryCode || registerFormik.values.country) return;
    registerFormik.setFieldValue("country", geoCountryCode, false);
  }, [geoCountryCode, registerFormik.values.country, registerFormik]);

  const handleResendOtp = async () => {
    if (!registeredEmail || resending) return;
    setResending(true);
    try {
      const result = await resendOtpAction({ email: registeredEmail });
      if (result.success) {
        showAlert({
          title: "OTP sent",
          text: result.message || "A new verification code has been sent.",
          variant: "success",
          confirmText: "OK",
        });
      } else {
        showAlert({
          title: "Failed to resend OTP",
          text: result.message || "Please try again.",
          variant: "error",
          confirmText: "OK",
        });
      }
    } catch {
      showAlert({
        title: "Failed to resend OTP",
        text: "Failed to resend OTP. Please try again.",
        variant: "error",
        confirmText: "OK",
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
          className="space-y-3"
          noValidate
        >
          <div className="text-center">
            <h2 className="text-base font-bold text-slate-900">
              Customer registration
            </h2>
            <p className="text-[11px] text-slate-500">
              Create your customer account.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
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

          <div className="grid gap-3 md:grid-cols-2">
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

          <p className="text-[11px] text-slate-400">
            Use at least 8 characters, including one uppercase letter and one
            number.
          </p>

          <button
            type="submit"
            disabled={isRegistering}
            className="h-11 w-full rounded-xl bg-brand font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRegistering ? "Registering..." : "Register"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={verifyFormik.handleSubmit}
          className="space-y-4"
          noValidate
        >
          <div className="text-center">
            <h2 className="text-base font-bold text-slate-900">
              Verify your email
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the OTP sent to <strong>{registeredEmail}</strong>
            </p>
          </div>

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
