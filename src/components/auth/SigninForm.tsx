"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import clsx from "clsx";
import Link from "next/link";
import { useLoginMutation } from "@/redux/api/auth/authApiSlice";
import { Button, Input } from "@/components/ui";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2";
import Image from "next/image";
import withImage from "../../../public/assets/images/with.png";

const SigninForm: React.FC = () => {
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      const result = await login({
        email: values.email,
        password: values.password,
      });
      if (result?.data?.success) {
        Swal.fire({
          title: "Login successful",
          text: "Welcome NEC Travel",
          icon: "success",
        });
      }
    },
  });

  return (
    <div className="md:px-0 px-3">
      <div className="bg-blue-50/50 bg-opacity-40 backdrop-blur-md md:mx-auto md:w-[400px] w-full p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center items-center mb-5">
          <p className="text-xs font-semibold">YOUR TRAVEL BE SAFER</p>
          <Image
            src={withImage}
            alt="Logo"
            width={200}
            height={200}
            className="mx-auto w-9"
            draggable={false}
          />
          <h1 className="font-extrabold text-3xl -mt-2.5 text-shadow-2xs">
            <span className="text-primary">NEC</span>{" "}
            <span className="text-secondary">TRAVELS</span>
          </h1>
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-950 mb-6">
          Login
        </h1>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              iconLeft={<FiMail />}
              className={clsx(
                "w-full bg-white border border-white rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-primary",
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "",
              )}
              error={formik.touched.email && !!formik.errors.email}
              errorMessage={formik.errors.email}
              {...formik.getFieldProps("email")}
            />
          </div>

          <div>
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className={clsx(
                "w-full bg-white border border-white rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-primary",
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "",
              )}
              iconLeft={<FiLock />}
              iconRight={
                showPassword ? (
                  <FiEyeOff
                    onClick={() => setShowPassword(false)}
                    className="cursor-pointer"
                  />
                ) : (
                  <FiEye
                    onClick={() => setShowPassword(true)}
                    className="cursor-pointer"
                  />
                )
              }
              error={formik.touched.password && !!formik.errors.password}
              errorMessage={formik.errors.password}
              {...formik.getFieldProps("password")}
            />
          </div>

          <div className="flex justify-between items-center text-sm px-2">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" className="rounded-md" />
              <label htmlFor="remember" className="text-gray-900 select-none">
                Remember me
              </label>
            </div>

            <Link
              href="/auth/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {isError && error && (
            <p className="text-red-600 text-sm text-center mt-2">
              {(error as any).message || "Login failed, please try again."}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            className={clsx(
              "w-full py-3 bg-primary text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none",
              isLoading ? "opacity-50 cursor-not-allowed" : "",
            )}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">
          Dont have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SigninForm;
