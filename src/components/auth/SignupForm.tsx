"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import clsx from "clsx";
import Swal from "sweetalert2";
import Image from "next/image";

import { Button, Input } from "@/components/ui";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiPhone,
} from "react-icons/fi";

import withImage from "../../../public/assets/images/with.png";
import { publicApi } from "@/helper/api/axios";

// Interface for API response
interface RegisterResponse {
  success: boolean;
  message?: string;
}

const SignupForm: React.FC = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },

    onSubmit: async (values) => {
      if (values.password !== values.confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Password mismatch",
          text: "Passwords do not match",
        });
        return;
      }

      try {
        setIsLoading(true);
        setApiError("");

        const payload = {
          fullname: values.name,
          phone: values.phone,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        };

        // Replaced direct axios call with guestHttp
        const response = await publicApi.post<RegisterResponse>(
          "/auth/register",
          payload
        );

        if (response?.success) {
          Swal.fire({
            title: "Registration Successful",
            text: "Please login to continue.",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/auth/signin");
            }
          });
        }
      } catch (error: any) {
        const message =
          error?.message || "Registration failed. Please try again.";

        const formattedMessage = Array.isArray(message)
          ? message.join(", ")
          : message;

        setApiError(formattedMessage);

        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: formattedMessage,
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="px-3 md:px-0">
      <div className="mx-auto w-full rounded-2xl bg-blue-50/50 p-6 shadow-lg backdrop-blur-md md:w-[400px]">
        <div className="mb-5 flex flex-col items-center justify-center">
          <p className="text-xs font-semibold">YOUR TRAVEL BE SAFER</p>

          <Image
            src={withImage}
            alt="Logo"
            width={200}
            height={200}
            className="mx-auto w-9"
            draggable={false}
          />

          <h1 className="-mt-2.5 text-3xl font-extrabold text-shadow-2xs">
            <span className="text-primary">NEC</span>{" "}
            <span className="text-secondary">TRAVELS</span>
          </h1>
        </div>

        <h1 className="mb-6 text-center text-3xl font-bold text-gray-950">
          Register
        </h1>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            iconLeft={<FiUser />}
            className={clsx(
              "w-full rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            )}
            {...formik.getFieldProps("name")}
          />

          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            iconLeft={<FiMail />}
            className={clsx(
              "w-full rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            )}
            {...formik.getFieldProps("email")}
          />

          <Input
            id="phone"
            type="text"
            placeholder="Enter your phone number"
            iconLeft={<FiPhone />}
            className={clsx(
              "w-full rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            )}
            {...formik.getFieldProps("phone")}
          />

          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            iconLeft={<FiLock />}
            iconRight={
              showPassword ? (
                <FiEyeOff
                  className="cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <FiEye
                  className="cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )
            }
            className={clsx(
              "w-full rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            )}
            {...formik.getFieldProps("password")}
          />

          <Input
            id="confirmPassword"
            type={showPassword2 ? "text" : "password"}
            placeholder="Confirm your password"
            iconLeft={<FiLock />}
            iconRight={
              showPassword2 ? (
                <FiEyeOff
                  className="cursor-pointer"
                  onClick={() => setShowPassword2(false)}
                />
              ) : (
                <FiEye
                  className="cursor-pointer"
                  onClick={() => setShowPassword2(true)}
                />
              )
            }
            className={clsx(
              "w-full rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            )}
            {...formik.getFieldProps("confirmPassword")}
          />

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full rounded-lg py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out focus:outline-none"
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>

          {apiError && (
            <p className="text-center text-sm text-red-600">{apiError}</p>
          )}
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-blue-600 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;