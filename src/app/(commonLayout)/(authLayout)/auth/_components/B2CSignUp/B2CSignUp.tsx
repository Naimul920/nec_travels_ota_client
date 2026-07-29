"use client";

import { useState } from "react";
import { useFormik } from "formik";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPhone,
  FiUser,
} from "react-icons/fi";

import { step1Schema } from "../B2BSignUp/validation";
import FormField from "../B2BSignUp/FormField";

interface B2CSignUpFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

const initialValues: B2CSignUpFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  password_confirmation: "",
};

type SubmitStatus = { type: "success" | "error"; message: string } | null;

export default function B2CSignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  const formik = useFormik<B2CSignUpFormValues>({
    initialValues,
    validationSchema: step1Schema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitStatus(null);

      try {
        console.log("Form submitted successfully:", values);
        // await post("/auth/register", values);

        setSubmitStatus({
          type: "success",
          message:
            "Your account has been created. Check your email to verify it.",
        });
      } catch (error) {
        console.error("Submission failed:", error);
        setSubmitStatus({
          type: "error",
          message: "Something went wrong while registering. Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getError = (name: keyof B2CSignUpFormValues) =>
    formik.touched[name] && formik.errors[name]
      ? formik.errors[name]
      : undefined;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Customer registration
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Create your customer account.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* <FormField
          label="First name"
          // name="first_name"
          type="text"
          placeholder="First name"
          icon={<FiUser />}
          error={getError("first_name")}
          {...formik.getFieldProps("first_name")}
        /> */}

        {/* <FormField
          label="Last name"
          // name="last_name"
          type="text"
          placeholder="Last name"
          icon={<FiUser />}
          error={getError("last_name")}
          {...formik.getFieldProps("last_name")}
        /> */}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          label="Email address"
          // name="email"
          type="email"
          placeholder="you@example.com"
          icon={<FiMail />}
          error={getError("email")}
          {...formik.getFieldProps("email")}
        />

        <FormField
          label="Phone number"
          // name="phone"
          type="tel"
          placeholder="1700000000"
          icon={<FiPhone />}
          prefix="+880"
          error={getError("phone")}
          {...formik.getFieldProps("phone")}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          label="Password"
          // name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          icon={<FiLock />}
          error={getError("password")}
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
          {...formik.getFieldProps("password")}
        />

        <FormField
          label="Confirm password"
          // name="password_confirmation"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm password"
          icon={<FiLock />}
          error={getError("password_confirmation")}
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
          {...formik.getFieldProps("password_confirmation")}
        />
      </div>

      <p className="text-xs text-slate-400">
        Use at least 8 characters, including one uppercase letter and one
        number.
      </p>

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

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="h-12 w-full rounded-xl bg-brand font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {formik.isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
