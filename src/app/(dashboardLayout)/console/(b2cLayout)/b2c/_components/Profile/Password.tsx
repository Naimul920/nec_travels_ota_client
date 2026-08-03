"use client"; // 1. Next.js 16 Client Component Boundary

import React, { useState } from "react";
import { useFormik } from "formik";
import clsx from "clsx";
import { App } from "antd";
import { Button, Input } from "@/components/ui";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
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

  return (
    <div className="md:px-0">
      <div className=" w-full rounded">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-gray-950 md:text-2xl text-lg font-bold">
            Change Password
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Current Password */}
          <Input
            type={showCurrent ? "text" : "password"}
            placeholder="Current Password"
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
            className={clsx(
              "bg-white border-primary rounded",
              formik.touched.currentPassword &&
                formik.errors.currentPassword &&
                "border-red-500",
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
            className={clsx(
              "bg-white border-primary rounded",
              formik.touched.newPassword &&
                formik.errors.newPassword &&
                "border-red-500",
            )}
            error={!!formik.touched.newPassword && !!formik.errors.newPassword}
            errorMessage={formik.errors.newPassword}
            {...formik.getFieldProps("newPassword")}
          />

          {/* Confirm Password */}
          <Input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
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
            className={clsx(
              "bg-white border-primary rounded",
              formik.touched.confirmPassword &&
                formik.errors.confirmPassword &&
                "border-red-500",
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
            {formik.isSubmitting ? "Submit..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Password;
