"use client";

import { useEffect, useState } from "react";
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
import { useCurrencyStore } from "@/store/currency.store";

const initialValues: B2BSignUpFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  password_confirmation: "",

  agency_name: "",
  business_type: "COMPANY_LTD",
  currency: "BDT",
  currency_Id: "",
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

  const { geo, phoneCode, selectedCurrencyId, selectedCurrencyCode } =
    useCurrencyStore();

  console.log("countryCode", geo?.countryCode);

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
      formData.append("phone", `${phoneCode}${values.phone}`);
      formData.append("password", values.password);
      formData.append("password_confirmation", values.password_confirmation);

      formData.append("agency_name", values.agency_name);
      formData.append("business_type", values.business_type);
      formData.append("currency_Id", values.currency_Id);
      formData.append(
        "caab_certificate_number",
        values.caab_certificate_number,
      );
      formData.append(
        "caab_certificate_expiry",
        values.caab_certificate_expiry,
      );
      formData.append("city", values.city);
      formData.append("postcode", values.postcode);
      formData.append("address", values.address);
      formData.append("country", geo?.countryCode || "");

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
        } else {
          setSubmitStatus({
            type: "error",
            message: result.message,
          });
        }
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
          router.push("/auth/signin");
        } else {
          helpers.setStatus({ error: result.message });
        }
      } catch {
        helpers.setStatus({ error: "Verification failed. Please try again." });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (formik.values.currency_Id || !selectedCurrencyId) return;
    formik.setFieldValue("currency", selectedCurrencyCode);
    formik.setFieldValue("currency_Id", selectedCurrencyId);
  }, [
    selectedCurrencyId,
    selectedCurrencyCode,
    formik.values.currency_Id,
    formik,
  ]);

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

  const [resending, setResending] = useState(false);

  const handleResendOtp = async () => {
    if (!registeredEmail || resending) return;
    setResending(true);
    verifyFormik.setStatus(null);
    try {
      const result = await resendOtpAction({ email: registeredEmail });
      verifyFormik.setStatus({
        success: result.success,
        error: result.success ? undefined : result.message,
      });
    } catch {
      verifyFormik.setStatus({ error: "Failed to resend OTP. Please try again." });
    } finally {
      setResending(false);
    }
  };

  if (step === "verify") {
    return (
      <div className="mx-auto w-full max-w-4xl p-4">
        <form
          onSubmit={verifyFormik.handleSubmit}
          className="mt-8 space-y-6"
          noValidate
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              Verify your email
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the OTP sent to <strong>{registeredEmail}</strong>
            </p>
          </div>

          {verifyFormik.status?.error && (
            <div
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
            >
              {verifyFormik.status.error}
            </div>
          )}

          {verifyFormik.status?.success && (
            <div
              role="alert"
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
            >
              {verifyFormik.status.success}
            </div>
          )}

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
