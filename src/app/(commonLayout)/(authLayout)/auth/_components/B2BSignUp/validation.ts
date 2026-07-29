import * as Yup from "yup";
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE_MB,
} from "./types";

const PHONE_REGEX = /^1[3-9]\d{8}$/; // BD mobile number without the +880 prefix

const fileSchema = (required: boolean) => {
  let schema = Yup.mixed<File>()
    .nullable()
    .test(
      "file-size",
      `File must be smaller than ${MAX_FILE_SIZE_MB}MB`,
      (file) => !file || file.size <= MAX_FILE_SIZE_MB * 1024 * 1024,
    )
    .test(
      "file-type",
      "Only JPG, PNG or PDF files are allowed",
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
    );

  return required ? schema.required("This document is required") : schema;
};

export const step1Schema = Yup.object({
  first_name: Yup.string().trim().min(2, "Too short").required("First name is required"),
  last_name: Yup.string().trim().min(2, "Too short").required("Last name is required"),
  email: Yup.string().trim().email("Enter a valid email").required("Email is required"),
  phone: Yup.string()
    .trim()
    .matches(PHONE_REGEX, "Enter a valid BD mobile number, e.g. 1700000000")
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

export const step2Schema = Yup.object({
  agency_name: Yup.string().trim().min(2, "Too short").required("Agency name is required"),
  business_type: Yup.string(),
  currency_id: Yup.string(),
  trade_license_number: Yup.string().trim().required("Trade license number is required"),
  trade_license_expiry: Yup.string().required("Trade license expiry date is required"),
  caab_certificate_number: Yup.string().trim(),
  caab_certificate_expiry: Yup.string().nullable(),
  city: Yup.string().trim().required("City is required"),
  postcode: Yup.string().trim().required("Postcode is required"),
  address: Yup.string().trim().required("Address is required"),
  hear_about_us: Yup.string(),
});

export const step3Schema = Yup.object({
  logo: fileSchema(false),
  trade_license: fileSchema(false),
  caab_certificate: fileSchema(false),
  full_nid: fileSchema(false),
  business_card: fileSchema(false),
  address_proof: fileSchema(false),
});

// Full schema, used as a final safety check before submit on step 4
export const fullSchema = step1Schema.concat(step2Schema).concat(step3Schema);

export const stepSchemas = [step1Schema, step2Schema, step3Schema, null] as const;
