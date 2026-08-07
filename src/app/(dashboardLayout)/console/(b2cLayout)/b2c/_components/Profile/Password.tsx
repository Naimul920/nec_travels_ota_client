"use client"; // 1. Next.js 16 Client Component Boundary

import React, { useState } from "react";
import { useFormik } from "formik";
import clsx from "clsx";
import { App } from "antd";
import { Button, Input } from "@/components/ui";
import { FiLock, FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import { changePasswordAction } from "@/actions/user.action";

const Password: React.FC = () => {
  const { message } = App.useApp();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.currentPassword) errors.currentPassword = "Current password is required";
      if (!values.newPassword) errors.newPassword = "New password is required";
      if (!values.confirmPassword) {
        errors.confirmPassword = "Confirm password is required";
      } else if (values.confirmPassword !== values.newPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
      return errors;
    },
    onSubmit: async (values, helpers) => {
      try {
        const result = await changePasswordAction({
          current_password: values.currentPassword,
          new_password: values.newPassword,
          new_password_confirmation: values.confirmPassword,
        });
        if (result.success) {
          message.success(result.message || "Password changed successfully");
          formik.resetForm();
        } else {
          message.error(result.message || "Failed to change password");
        }
      } catch {
        message.error("Failed to change password. Please try again.");
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const inputClass = (hasError: boolean) =>
    clsx(
      "rounded-lg",
      hasError ? "border-red-500" : "border-gray-200",
    );

  const hasError = (touched: boolean | undefined, error: string | undefined) =>
    !!touched && !!error;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header band */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-[#0F1B47] to-[#1B2E5F] px-6 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-[#F5C518]">
          <FiShield size={19} />
        </span>
        <div>
          <h1 className="text-lg font-bold text-white">Change Password</h1>
          <p className="text-xs text-white/60">
            Keep your account secure with a strong password
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-4 px-6 py-6">
        {/* Current Password */}
        <Input
          type={showCurrent ? "text" : "password"}
          placeholder="Current Password"
          label="Current Password"
          iconLeft={<FiLock />}
          iconRight={
            showCurrent ? (
              <FiEyeOff
                onClick={() => setShowCurrent(false)}
                className="cursor-pointer"
              />
            ) : (
              <FiEye
                onClick={() => setShowCurrent(true)}
                className="cursor-pointer"
              />
            )
          }
          className={inputClass(
            hasError(formik.touched.currentPassword, formik.errors.currentPassword),
          )}
          error={
            !!formik.touched.currentPassword &&
            !!formik.errors.currentPassword
          }
          errorMessage={formik.errors.currentPassword}
          {...formik.getFieldProps("currentPassword")}
        />

        {/* New Password */}
        <Input
          type={showNew ? "text" : "password"}
          placeholder="New Password"
          label="New Password"
          iconLeft={<FiLock />}
          iconRight={
            showNew ? (
              <FiEyeOff
                onClick={() => setShowNew(false)}
                className="cursor-pointer"
              />
            ) : (
              <FiEye
                onClick={() => setShowNew(true)}
                className="cursor-pointer"
              />
            )
          }
          className={inputClass(
            hasError(formik.touched.newPassword, formik.errors.newPassword),
          )}
          error={!!formik.touched.newPassword && !!formik.errors.newPassword}
          errorMessage={formik.errors.newPassword}
          {...formik.getFieldProps("newPassword")}
        />

        {/* Confirm Password */}
        <Input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm Password"
          label="Confirm Password"
          iconLeft={<FiLock />}
          iconRight={
            showConfirm ? (
              <FiEyeOff
                onClick={() => setShowConfirm(false)}
                className="cursor-pointer"
              />
            ) : (
              <FiEye
                onClick={() => setShowConfirm(true)}
                className="cursor-pointer"
              />
            )
          }
          className={inputClass(
            hasError(formik.touched.confirmPassword, formik.errors.confirmPassword),
          )}
          error={
            !!formik.touched.confirmPassword &&
            !!formik.errors.confirmPassword
          }
          errorMessage={formik.errors.confirmPassword}
          {...formik.getFieldProps("confirmPassword")}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full py-3 font-semibold rounded-lg"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Submitting..." : "Change Password"}
        </Button>
      </form>
    </div>
  );
};

export default Password;
