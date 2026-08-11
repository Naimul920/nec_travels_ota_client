"use client";

import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Stepper from "./Stepper";
import { fullSchema, stepSchemas } from "./validation";
import { B2BSignUpFormValues, TOTAL_STEPS } from "./types";
import {
  b2bRegisterAction,
  resendOtpAction,
  verifyEmailAction,
} from "@/actions/auth.action";
import { verifyEmailSchema } from "@/validations/auth.validation";
import { OtpInput } from "@/components/ui";
import { useGeoStore, getGeoCountryCode } from "@/store/geo.store";
import { showAlert } from "@/components/common/Alert/ShowAlert";

const initialValues: B2BSignUpFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  password_confirmation: "",

  agency_name: "",
  business_type: "COMPANY_LTD",
  country: "",
  caab_certificate_number: "",
  caab_certificate_expiry: "",
  city: "",
  postcode: "",
  address: "",
  // hear_about_us: "",

  logo: null,
  trade_license: null,
  caab_certificate: null,
  nid: null,
  business_card: null,
};

type SubmitStatus = { type: "success" | "error"; message: string } | null;

export default function B2BSignUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [step, setStep] = useState<"register" | "verify">("register");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  const router = useRouter();
  const geo = useGeoStore((s) => s.geo);
  const countryCode = getGeoCountryCode(geo);

  // Renamed refs so validators always read the latest step (Formik can
  // invoke onSubmit with a stale closure) and rapid clicks can't double-advance.
  const currentStepRef = useRef(currentStep);
  currentStepRef.current = currentStep;
  const stepNavLockRef = useRef(false);

  const formik = useFormik<B2BSignUpFormValues>({
    initialValues,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      if (currentStepRef.current !== TOTAL_STEPS) {
        setSubmitting(false);
        return;
      }

      setSubmitStatus(null);

      try {
        await fullSchema.validate(values, { abortEarly: false });
      } catch {
        setSubmitStatus({
          type: "error",
          message:
            "Some information is missing or invalid. Please review the previous steps.",
        });
        setSubmitting(false);
        return;
      }

      const formData = new FormData();

      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("password", values.password);
      formData.append("password_confirmation", values.password_confirmation);

      formData.append("agency_name", values.agency_name);
      formData.append("business_type", values.business_type);
      formData.append("country", values.country);
      if (values.caab_certificate_number)
        formData.append("caab_certificate_number", values.caab_certificate_number);
      if (values.caab_certificate_expiry)
        formData.append("caab_certificate_expiry", values.caab_certificate_expiry);
      formData.append("city", values.city);
      formData.append("postcode", values.postcode);
      formData.append("address", values.address);

      if (values.logo) formData.append("logo", values.logo);
      if (values.trade_license)
        formData.append("trade_license", values.trade_license);
      if (values.caab_certificate)
        formData.append("caab_certificate", values.caab_certificate);
      if (values.nid) formData.append("nid", values.nid);
      if (values.business_card)
        formData.append("business_card", values.business_card);

      try {
        const result = await b2bRegisterAction(formData);

        if (result.success) {
          setRegisteredEmail(values.email);
          setStep("verify");
          showAlert({
            title: "Registration submitted",
            text: result.message || "Please verify your email to continue.",
            variant: "success",
            confirmText: "Continue",
          });
        } else {
          showAlert({
            title: "Registration failed",
            text: result.message || "Something went wrong. Please try again.",
            variant: "error",
            confirmText: "OK",
          });
        }
      } catch (error) {
        console.error("Submission failed:", error);
        showAlert({
          title: "Registration failed",
          text: "Something went wrong while submitting. Please try again.",
          variant: "error",
          confirmText: "OK",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const verifyFormik = useFormik({
    initialValues: { otp: "" },
    validationSchema: verifyEmailSchema,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(null);
      try {
        const result = await verifyEmailAction({
          email: registeredEmail,
          otp: values.otp,
        });
        if (result.success) {
          helpers.setStatus({ success: result.message });
          showAlert({
            title: "Email verified",
            text: result.message || "Your email has been verified successfully.",
            variant: "success",
            confirmText: "Continue",
          });
          router.push("/auth/signin");
        } else {
          showAlert({
            title: "Verification failed",
            text: result.message || "Please check the OTP and try again.",
            variant: "error",
            confirmText: "OK",
          });
        }
      } catch {
        showAlert({
          title: "Verification failed",
          text: "Verification failed. Please try again.",
          variant: "error",
          confirmText: "OK",
        });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (formik.values.country === countryCode) return;
    formik.setFieldValue("country", countryCode);
  }, [countryCode, formik.values.country, formik]);

  const goToNextStep = async () => {
    if (stepNavLockRef.current) return;
    stepNavLockRef.current = true;

    try {
      const schema = stepSchemas[currentStepRef.current - 1];

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
    } finally {
      stepNavLockRef.current = false;
    }
  };

  const goToPreviousStep = () => {
    setSubmitStatus(null);
    setCurrentStep((step) => Math.max(1, step - 1));
  };

  const [resending, setResending] = useState(false);

  const handleResendOtp = async () => {
    if (!registeredEmail || resending) return;
    setResending(true);
    try {
      const result = await resendOtpAction({ email: registeredEmail });
      if (result.success) {
        showAlert({
          title: "OTP sent",
          text: result.message || "A new verification code has been sent.",
          variant: "success",
          confirmText: "OK",
        });
      } else {
        showAlert({
          title: "Failed to resend OTP",
          text: result.message || "Please try again.",
          variant: "error",
          confirmText: "OK",
        });
      }
    } catch {
      showAlert({
        title: "Failed to resend OTP",
        text: "Failed to resend OTP. Please try again.",
        variant: "error",
        confirmText: "OK",
      });
    } finally {
      setResending(false);
    }
  };

  if (step === "verify") {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <form
          onSubmit={verifyFormik.handleSubmit}
          className="mt-6 space-y-4"
          noValidate
        >
          <div className="text-center">
            <h2 className="text-lg font-bold text-slate-900">
              Verify your email
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Enter the OTP sent to <strong>{registeredEmail}</strong>
            </p>
          </div>

          <div>
            <OtpInput
              label="OTP Code"
              length={6}
              value={verifyFormik.values.otp}
              onChange={(v) => verifyFormik.setFieldValue("otp", v)}
              onBlur={() => verifyFormik.setFieldTouched("otp", true)}
              error={verifyFormik.touched.otp && !!verifyFormik.errors.otp}
              errorMessage={verifyFormik.errors.otp as string | undefined}
            />
          </div>

          <button
            type="submit"
            disabled={verifyFormik.isSubmitting}
            className="h-12 w-full rounded-xl bg-brand font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {verifyFormik.isSubmitting ? "Verifying..." : "Verify email"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Didn&apos;t receive it?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending}
              className="font-semibold text-brand hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Stepper currentStep={currentStep} />

      <form
        onSubmit={formik.handleSubmit}
        noValidate
        onKeyDown={(e) => {
          if (currentStep < TOTAL_STEPS && e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        {currentStep === 1 && <Step1 formik={formik} />}
        {currentStep === 2 && <Step2 formik={formik} />}
        {currentStep === 3 && <Step3 formik={formik} />}
        {currentStep === 4 && <Step4 values={formik.values} />}

        {submitStatus && (
          <div
            role="alert"
            className={`mt-3 rounded-xl border p-3 text-sm ${
              submitStatus.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-brand/70"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiArrowLeft />
            Back
          </button>

          {currentStep < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToNextStep();
              }}
              className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand"
            >
              Continue
              <FiArrowRight />
            </button>
          ) : (
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
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
