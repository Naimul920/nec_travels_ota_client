"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";

// React Icons
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiX,
  FiBriefcase,
} from "react-icons/fi";

// Validation Schema using Yup
const validationSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email address is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10,11}$/, "Enter a valid phone number (e.g., 1700000000)")
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

interface RegisterFormProps {
  onClose?: () => void; // Optional handler if rendered inside a Modal
}

export default function RegisterForm({ onClose }: RegisterFormProps) {
  const router = useRouter();

  // Password Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // RTK Query Mutation Hook Placeholder
  // const [registerCustomer, { isLoading }] = useRegisterCustomerMutation();

  // Formik Hook Initialization
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: `+880${values.phone}`, // Attach BD country code prefix
          password: values.password,
        };

        console.log("Customer Registration Payload:", payload);

        // Example RTK Query Call:
        // await registerCustomer(payload).unwrap();
        // router.push("/login");
      } catch (error) {
        console.error("Registration failed:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="relative w-full max-w-[620px] bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mx-auto border border-gray-100">
      {/* Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <FiX size={24} />
        </button>
      )}

      {/* Heading */}
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Register
      </h2>

      {/* Account Type Toggle Switch Header */}
      <div className="flex items-center bg-white border border-gray-100 shadow-lg rounded-2xl p-2 mb-8 max-w-[500px] mx-auto">
        {/* Customer Account Button (Active) */}
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl shadow-md transition-all cursor-default"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <FiUser size={18} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold leading-tight">Customer Account</p>
            <p className="text-[11px] text-white/80 font-normal">
              Individual travelers
            </p>
          </div>
        </button>

        {/* Corporate Account Button (Routes to /signup/corporate) */}
        <Link
          href={"/b2cc/auth/corporate-register"}
          className="flex-1 flex items-center justify-center gap-3 bg-transparent text-gray-400 hover:text-gray-600 p-3 rounded-xl transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <FiBriefcase size={18} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold leading-tight text-gray-500">
              Corporate Account
            </p>
            <p className="text-[11px] text-gray-400 font-normal">
              Teams & businesses
            </p>
          </div>
        </Link>
      </div>

      <p className="text-center text-sm font-semibold text-gray-600 mb-6">
        Create a new account
      </p>

      {/* Formik Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Row 1: First Name & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <div
              className={`flex items-center gap-2.5 border rounded-xl px-3.5 py-3 transition-colors ${
                formik.touched.firstName && formik.errors.firstName
                  ? "border-red-500 bg-red-50/20"
                  : "border-gray-200 focus-within:border-indigo-600"
              }`}
            >
              <FiUser className="text-gray-400 text-lg shrink-0" />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                {...formik.getFieldProps("firstName")}
              />
            </div>
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="text-xs text-red-500 mt-1 pl-1">
                {formik.errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <div
              className={`flex items-center gap-2.5 border rounded-xl px-3.5 py-3 transition-colors ${
                formik.touched.lastName && formik.errors.lastName
                  ? "border-red-500 bg-red-50/20"
                  : "border-gray-200 focus-within:border-indigo-600"
              }`}
            >
              <FiUser className="text-gray-400 text-lg shrink-0" />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                {...formik.getFieldProps("lastName")}
              />
            </div>
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="text-xs text-red-500 mt-1 pl-1">
                {formik.errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Email & Phone Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <div
              className={`flex items-center gap-2.5 border rounded-xl px-3.5 py-3 transition-colors ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500 bg-red-50/20"
                  : "border-gray-200 focus-within:border-indigo-600"
              }`}
            >
              <FiMail className="text-gray-400 text-lg shrink-0" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                {...formik.getFieldProps("email")}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-xs text-red-500 mt-1 pl-1">
                {formik.errors.email}
              </p>
            )}
          </div>

          {/* Phone Field (Country Code Selector + Input) */}
          <div>
            <div
              className={`flex items-center bg-gray-50/80 border rounded-xl px-3 py-2.5 transition-colors ${
                formik.touched.phone && formik.errors.phone
                  ? "border-red-500 bg-red-50/20"
                  : "border-gray-200 focus-within:border-indigo-600"
              }`}
            >
              {/* Flag & Country Code Prefix */}
              <div className="flex items-center gap-1.5 pr-2.5 border-r border-gray-300 shrink-0">
                <span className="text-base" role="img" aria-label="Bangladesh">
                  🇧🇩
                </span>
                <span className="text-xs font-semibold text-gray-700">
                  +880
                </span>
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="1700000000"
                className="w-full bg-transparent pl-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                {...formik.getFieldProps("phone")}
              />
            </div>
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-xs text-red-500 mt-1 pl-1">
                {formik.errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Row 3: Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Password */}
          <div>
            <div
              className={`flex items-center gap-2.5 border rounded-xl px-3.5 py-3 transition-colors ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500 bg-red-50/20"
                  : "border-gray-200 focus-within:border-indigo-600"
              }`}
            >
              <FiLock className="text-gray-400 text-lg shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                {...formik.getFieldProps("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-xs text-red-500 mt-1 pl-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div
              className={`flex items-center gap-2.5 border rounded-xl px-3.5 py-3 transition-colors ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-red-500 bg-red-50/20"
                  : "border-gray-200 focus-within:border-indigo-600"
              }`}
            >
              <FiLock className="text-gray-400 text-lg shrink-0" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Enter confirm password"
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                {...formik.getFieldProps("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </button>
            </div>
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 pl-1">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full mt-6 bg-[#8c181f] hover:bg-[#721319] text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center"
        >
          {formik.isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>

      {/* Footer Link */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-red-600 hover:text-red-700 font-semibold transition-colors"
        >
          Login here
        </Link>
      </div>
    </div>
  );
}
