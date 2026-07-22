"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useFormik } from "formik";
import clsx from "clsx";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2";
import Image from "next/image";
import withImage from "../../../public/assets/images/with.png";

const SigninForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const router = useRouter();

  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        setError("");

        const response = await login(values.email, values.password);

        Swal.fire({
          title: "Login successful",
          text: "Welcome to NEC Travel",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        const role = response.user.role.toLowerCase();

        // router.push(`/console/${role}`);
        router.push(`/console/b2b`);
      } catch (error: any) {
        const message =
          error?.response?.data?.message || "Invalid email or password";

        setError(message);

        Swal.fire({
          title: "Login failed",
          text: message,
          icon: "error",
        });
      } finally {
        setIsLoading(false);
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

          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter your password"
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
            className={clsx(
              "w-full bg-white border border-white rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-primary",

              formik.touched.password && formik.errors.password
                ? "border-red-500"
                : "",
            )}
            error={formik.touched.password && !!formik.errors.password}
            errorMessage={formik.errors.password}
            {...formik.getFieldProps("password")}
          />

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

          {error && (
            <p className="text-red-600 text-sm text-center mt-2">{error}</p>
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
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SigninForm;
