"use client";

import { useState } from "react";
import { FormikProps } from "formik";
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
import { B2BSignUpFormValues } from "./types";
import FormField from "./FormField";
import { PhoneInputField } from "@/components/ui";

export default function Step1({ formik }: { formik: FormikProps<B2BSignUpFormValues> }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Account information</h2>
        <p className="mt-1 text-sm text-slate-500">Enter your account information to continue.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField
          label="Given name"
          type="text"
          placeholder="Given name"
          icon={<FiUser />}
          error={formik.errors.first_name}
          {...formik.getFieldProps("first_name")}
        />

        <FormField
          label="Surname"
          type="text"
          placeholder="Surname"
          icon={<FiUser />}
          error={formik.errors.last_name}
          {...formik.getFieldProps("last_name")}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField
          label="Email address"
          type="email"
          placeholder="you@example.com"
          icon={<FiMail />}
          error={formik.errors.email}
          {...formik.getFieldProps("email")}
        />

        <PhoneInputField
          label="Phone number"
          name="phone"
          value={formik.values.phone}
          onChange={(v) => formik.setFieldValue("phone", v)}
          onBlur={() => formik.setFieldTouched("phone", true)}
          error={Boolean(formik.errors.phone)}
          errorMessage={formik.errors.phone as string | undefined}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          icon={<FiLock />}
          error={formik.errors.password}
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
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm password"
          icon={<FiLock />}
          error={formik.errors.password_confirmation}
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
          {...formik.getFieldProps("password_confirmation")}
        />
      </div>

      <p className="text-xs text-slate-400">
        Use at least 8 characters, including one uppercase letter and one number.
      </p>
    </div>
  );
}