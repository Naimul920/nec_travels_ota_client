"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Stepper from "./Stepper";
import { fullSchema, stepSchemas } from "./validation";
import { B2BSignUpFormValues, TOTAL_STEPS } from "./types";

const initialValues: B2BSignUpFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  password_confirmation: "",

  agency_name: "",
  // business_type: "",
  currency: "BDT",
  trade_license_number: "",
  trade_license_expiry: "",
  caab_certificate_number: "",
  caab_certificate_expiry: "",
  city: "",
  postcode: "",
  address: "",
  // hear_about_us: "",

  logo: null,
  trade_license: null,
  caab_certificate: null,
  full_nid: null,
  business_card: null,
  address_proof: null,
};

type SubmitStatus = { type: "success" | "error"; message: string } | null;

export default function B2BSignUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userAgent, setUserAgent] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  useEffect(() => {
    setUserAgent(window.navigator.userAgent);
  }, []);

  const formik = useFormik<B2BSignUpFormValues>({
    initialValues,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitStatus(null);

      try {
        await fullSchema.validate(values, { abortEarly: false });
      } catch {
        setSubmitStatus({
          type: "error",
          message: "Some information is missing or invalid. Please review the previous steps.",
        });
        setSubmitting(false);
        return;
      }

      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      formData.append("user_agent", userAgent);

      try {
        // Example API call:
        // await axios.post("/api/b2b-signup", formData);
        console.log("Form submitted successfully");

        // setSubmitStatus({
        //   type: "success",
        //   message: "Your application has been submitted. We'll email you once it's reviewed.",
        // });
      } catch (error) {
        console.error("Submission failed:", error);
        setSubmitStatus({
          type: "error",
          message: "Something went wrong while submitting. Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const goToNextStep = async () => {
    const schema = stepSchemas[currentStep - 1];

    if (!schema) {
      setCurrentStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
      return;
    }

    try {
      await schema.validate(formik.values, { abortEarly: false });

      formik.setErrors({});
      setCurrentStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
    } catch (error: any) {
      const validationErrors: Record<string, string> = {};
      const touchedFields: Record<string, boolean> = {};

      error.inner?.forEach((err: { path?: string; message: string }) => {
        if (err.path) {
          validationErrors[err.path] = err.message;
          touchedFields[err.path] = true;
        }
      });

      formik.setErrors(validationErrors);
      formik.setTouched(touchedFields);
    }
  };

  const goToPreviousStep = () => {
    setSubmitStatus(null);
    setCurrentStep((step) => Math.max(1, step - 1));
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <Stepper currentStep={currentStep} />

      <form onSubmit={formik.handleSubmit} className="mt-8" noValidate>
        {currentStep === 1 && <Step1 formik={formik} />}
        {currentStep === 2 && <Step2 formik={formik} />}
        {currentStep === 3 && <Step3 formik={formik} />}
        {currentStep === 4 && <Step4 values={formik.values} />}

        {submitStatus && (
          <div
            role="alert"
            className={`mt-6 rounded-xl border p-4 text-sm ${
              submitStatus.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-brand/70"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiArrowLeft />
            Back
          </button>

          {currentStep < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand"
            >
              Continue
              <FiArrowRight />
            </button>
          ) : (
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {formik.isSubmitting ? "Submitting..." : "Submit registration"}
              <FiCheck />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
