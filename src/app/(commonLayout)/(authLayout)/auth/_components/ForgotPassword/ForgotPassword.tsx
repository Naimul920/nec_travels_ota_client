"use client";

import React from "react";
import Link from "next/link";
import { useFormik } from "formik";
import clsx from "clsx";
import { Button, Input } from "@/components/ui";
import { FiMail } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { useLogin } from "@/hooks/useAuthApi";
import Image from "next/image";

const ForgotPasswordForm: React.FC = () => {
  const loginMutation = useLogin();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
    },
  });

  return (
    <div className="md:px-0 px-3">
      <div className="bg-blue-50/50 bg-opacity-40 backdrop-blur-md md:mx-auto md:w-100 w-full p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center items-center mb-5">
          <p className="text-xs font-semibold">YOUR TRAVEL BE SAFER</p>
          <Image
            src="/assets/images/with.png"
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
        <div className="my-3">
          <h1 className="text-3xl font-bold text-center text-gray-950">
            <Link href="/auth/signin">
              <IoArrowBack className="inline" />{" "}
            </Link>{" "}
            Forgot Password
          </h1>
          <p className="text-xs my-3">
            Please enter your email address to reset your password.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              iconLeft={<FiMail />}
              className={clsx(
                "w-full bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-primary",
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "",
              )}
              error={formik.touched.email && !!formik.errors.email}
              errorMessage={formik.errors.email}
              {...formik.getFieldProps("email")}
            />
          </div>

          {loginMutation.isError && (
            <p className="text-red-600 text-sm text-center mt-2">
              {(loginMutation.error as any)?.response?.data?.message ||
                (loginMutation.error as any)?.message ||
                "An error occurred, please try again."}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            className={clsx(
              "w-full py-3 bg-primary text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none",
              loginMutation.isPending ? "opacity-50 cursor-not-allowed" : "",
            )}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Sending..." : "Send OTP"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
