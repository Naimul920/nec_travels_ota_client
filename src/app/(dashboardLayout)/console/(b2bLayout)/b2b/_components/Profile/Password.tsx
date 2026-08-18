"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import clsx from "clsx";
import { App, Card } from "antd";
import { Button, Input } from "@/components/ui";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { changePasswordAction } from "@/actions/user.action";

interface PasswordValues {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

const Password: React.FC = () => {
  const { message } = App.useApp();
  const [show, setShow] = useState<Record<keyof PasswordValues, boolean>>({
    current_password: false,
    new_password: false,
    new_password_confirmation: false,
  });

  const formik = useFormik<PasswordValues>({
    initialValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
    validate: (values) => {
      const errors: Partial<PasswordValues> = {};
      if (!values.current_password) {
        errors.current_password = "Current password is required";
      }
      if (!values.new_password) {
        errors.new_password = "New password is required";
      } else if (values.new_password.length < 8) {
        errors.new_password = "Password must be at least 8 characters";
      }
      if (!values.new_password_confirmation) {
        errors.new_password_confirmation = "Please confirm your new password";
      } else if (
        values.new_password_confirmation !== values.new_password
      ) {
        errors.new_password_confirmation = "Passwords do not match";
      }
      return errors;
    },
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const result = await changePasswordAction(values);
      if (result.success) {
        message.success(result.message || "Password changed successfully");
        resetForm();
      } else {
        message.error(result.message || "Failed to change password");
      }
      setSubmitting(false);
    },
  });

  const toggle = (key: keyof PasswordValues) => () =>
    setShow((prev) => ({ ...prev, [key]: !prev[key] }));

  const renderPasswordField = (
    name: keyof PasswordValues,
    label: string,
    placeholder: string,
  ) => {
    const hasError = !!formik.touched[name] && !!formik.errors[name];
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </label>
        <Input
          type={show[name] ? "text" : "password"}
          placeholder={placeholder}
          iconLeft={<FiLock />}
          iconRight={
            show[name] ? (
              <FiEyeOff onClick={toggle(name)} className="cursor-pointer" />
            ) : (
              <FiEye onClick={toggle(name)} className="cursor-pointer" />
            )
          }
          className={clsx("bg-white rounded-lg border-primary", hasError && "border-red-500")}
          error={hasError}
          errorMessage={formik.errors[name]}
          {...formik.getFieldProps(name)}
        />
      </div>
    );
  };

  return (
    <Card className="h-full w-full border! border-primary! rounded-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            Change Password
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Keep your account secure
          </p>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FiLock />
        </span>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {renderPasswordField(
          "current_password",
          "Current Password",
          "Enter current password",
        )}
        {renderPasswordField(
          "new_password",
          "New Password",
          "At least 8 characters",
        )}
        {renderPasswordField(
          "new_password_confirmation",
          "Confirm Password",
          "Re-enter new password",
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full rounded-lg py-3 font-semibold"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </Card>
  );
};

export default Password;