"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import clsx from "clsx";
import { Button, Input } from "@/components/ui";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiPhone,
} from "react-icons/fi";
import { useRegisterMutation } from "@/redux/api/auth/authApiSlice";
import Swal from "sweetalert2";
import Image from "next/image";
import withImage from "../../../public/assets/images/with.png"; 

const SignupForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [register, { isLoading, isError, error }] = useRegisterMutation();
  const router = useRouter();

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
        alert("Password not match");
        return;
      }
      const payload = {
        fullname: values.name,
        phone: values.phone,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      };

      const result = await register(payload);
      if (result?.data?.success) {
        Swal.fire({
          title: "Register successful",
          text: "Now, you're login",
          icon: "success",
        }).then((res) => {
          if (res.isConfirmed) {
            router.push("/auth/signin");
          }
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
          Register
        </h1>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Input
            type="text"
            id="name"
            placeholder="Enter your name"
            iconLeft={<FiUser />}
            className={clsx(
              "w-full bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-primary",
              formik.touched.name && formik.errors.name ? "border-red-500" : "",
            )}
            error={formik.touched.name && !!formik.errors.name}
            errorMessage={formik.errors.name}
            {...formik.getFieldProps("name")}
          />

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

          <Input
            type="text"
            id="phone"
            placeholder="Enter your phone number"
            iconLeft={<FiPhone />}
            className={clsx(
              "w-full bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-primary",
              formik.touched.phone && formik.errors.phone
                ? "border-red-500"
                : "",
            )}
            error={formik.touched.phone && !!formik.errors.phone}
            errorMessage={formik.errors.phone}
            {...formik.getFieldProps("phone")}
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
              "w-full bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-primary",
              formik.touched.password && formik.errors.password
                ? "border-red-500"
                : "",
            )}
            error={formik.touched.password && !!formik.errors.password}
            errorMessage={formik.errors.password}
            {...formik.getFieldProps("password")}
          />

          <Input
            type={showPassword2 ? "text" : "password"}
            id="confirmPassword"
            placeholder="Enter your confirm password"
            iconLeft={<FiLock />}
            iconRight={
              showPassword2 ? (
                <FiEyeOff
                  onClick={() => setShowPassword2(false)}
                  className="cursor-pointer"
                />
              ) : (
                <FiEye
                  onClick={() => setShowPassword2(true)}
                  className="cursor-pointer"
                />
              )
            }
            className={clsx(
              "w-full bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-primary",
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? "border-red-500"
                : "",
            )}
            error={
              formik.touched.confirmPassword && !!formik.errors.confirmPassword
            }
            errorMessage={formik.errors.confirmPassword}
            {...formik.getFieldProps("confirmPassword")}
          />

          <Button
            disabled={isLoading}
            type="submit"
            variant="primary"
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none"
          >
            {isLoading ? "Register..." : "Register"}
          </Button>

          {isError && error && (
            <p className="text-red-600 text-sm text-center mt-2">
              {(error as any).message ||
                "Registration failed, please try again."}
            </p>
          )}
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
