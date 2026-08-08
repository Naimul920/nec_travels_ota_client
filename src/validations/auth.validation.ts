import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

export const forgotSchema = Yup.object({
  email: Yup.string().trim().email("Enter a valid email").required("Email is required"),
});

export const resetPasswordSchema = Yup.object({
  otp: Yup.string().required("OTP is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
});

export const b2cRegisterSchema = Yup.object({
  email: Yup.string().trim().email("Enter a valid email").required("Email is required"),
  phone: Yup.string()
    .trim()
    .matches(/^\+?\d{7,15}$/, "Invalid phone number")
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .matches(/[A-Z]/, "Include at least one uppercase letter")
    .matches(/[0-9]/, "Include at least one number")
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

export const verifyEmailSchema = Yup.object({
  otp: Yup.string().required("OTP is required"),
});
