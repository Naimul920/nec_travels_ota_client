import * as Yup from "yup";

export const step1Schema = Yup.object({
  first_name: Yup.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  last_name: Yup.string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email address is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9\s+]{8,15}$/, "Enter a valid phone number"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const step2Schema = Yup.object({
  agency_name: Yup.string().trim().required("Agency name is required"),
  business_type: Yup.string().required("Business type is required"),
  currency_Id: Yup.string().required("Currency selection is required"),
  trade_license_number: Yup.string()
    .trim()
    .required("Trade license number is required"),
  trade_license_expiry: Yup.string().required(
    "Trade license expiry date is required",
  ),
  caab_certificate_number: Yup.string().trim().optional(),
  caab_certificate_expiry: Yup.string().optional(),
  city: Yup.string().trim().required("City is required"),
  postcode: Yup.string().trim().required("Postcode is required"),
  address: Yup.string().trim().required("Address is required"),
  hear_about_us: Yup.string().required(
    "Please select where you heard about us",
  ),
});

export const step3Schema = Yup.object({
  logo: Yup.mixed().nullable().optional(),
  trade_license: Yup.mixed().nullable().optional(),
  caab_certificate: Yup.mixed().nullable().optional(),
  nid_front: Yup.mixed().nullable().optional(),
  nid_back: Yup.mixed().nullable().optional(),
  address_proof: Yup.mixed().nullable().optional(),
});
