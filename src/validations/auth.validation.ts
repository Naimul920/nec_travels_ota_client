import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

export const forgotSchema = Yup.object({
  email: Yup.string().trim().email("Enter a valid email").required("Email is required"),
});
