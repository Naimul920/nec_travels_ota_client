"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import { loginSchema } from "@/components/b2c/auth/loginValidation";
import { FiMail, FiLock, FiEye, FiEyeOff, FiX, FiCheck } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import Logo from "@/assets/logo.png";
import Image from "next/image";

interface LoginFormProps {
  onClose?: () => void;
  onGoogleSignIn?: () => void;
  onCredentialsSubmit?: (values: any) => Promise<void>;
}

export default function LoginForm({
  onClose,
  onGoogleSignIn,
  onCredentialsSubmit,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        if (onCredentialsSubmit) {
          await onCredentialsSubmit(values);
        } else {
          console.log("Submitting login form:", values);
        }
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="relative w-full max-w-[420px] bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
      {/* Top Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-red-500 hover:text-red-600 transition"
          aria-label="Close modal"
        >
          <FiX size={22} />
        </button>
      )}

      {/* Brand Header */}
      <div className="flex justify-center mb-6 pt-2">
        <Link href="">
          <Image src={Logo} alt="Logo" />
        </Link>
      </div>

      {/* Google Sign-In Button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-xs text-sm font-semibold text-gray-700 cursor-pointer"
        >
          <FcGoogle className="text-xl shrink-0" />
          <span>Sign in with Google</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-full border-t border-gray-200" />
        <span className="absolute bg-white px-3 text-xs text-gray-400 font-medium">
          or
        </span>
      </div>

      {/* Credentials Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <div className="flex items-center gap-3 bg-white border border-gray-200/90 rounded-2xl px-4 py-3.5 focus-within:border-gray-400 transition">
            <FiMail className="text-gray-400 text-lg shrink-0" />
            <input
              type="email"
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

        {/* Password Field */}
        <div>
          <div className="flex items-center gap-3 bg-white border border-gray-200/90 rounded-2xl px-4 py-3.5 focus-within:border-gray-400 transition">
            <FiLock className="text-gray-400 text-lg shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              {...formik.getFieldProps("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 shrink-0"
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

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-gray-600 font-medium cursor-pointer select-none">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={formik.values.rememberMe}
                onChange={(e) =>
                  formik.setFieldValue("rememberMe", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300 peer-checked:bg-[#8c181f] peer-checked:border-[#8c181f] transition" />
              <FiCheck className="absolute text-white text-[10px] opacity-0 peer-checked:opacity-100 transition" />
            </div>
            Remember Me
          </label>

          <Link
            href="/forgot-password"
            className="text-gray-500 hover:text-gray-700 transition"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary/80 hover:bg-primary text-white py-3 px-4 rounded-2xl text-sm font-semibold transition shadow-md cursor-pointer disabled:opacity-60"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </form>

      {/* Registration Footer */}
      <p className="text-xs text-center text-gray-500 mt-6 font-medium">
        Don&apos;t have an account?{" "}
        <Link
          href="/b2cc/auth/register"
          className="text-red-600 font-semibold hover:underline"
        >
          Register here
        </Link>
      </p>
    </div>
  );
}
