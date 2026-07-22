"use client";

import React, { useState, useEffect } from "react";
import UploadFile from "@/components/ui/UploadFile/UploadFile";
import { step1Schema, step2Schema, step3Schema } from "./corporateValidation";

import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiBriefcase,
  FiFileText,
  FiMapPin,
  FiHash,
  FiShield,
  FiCheck,
  FiArrowLeft,
  FiArrowRight,
  FiX,
  FiCalendar,
  FiDollarSign,
  FiHelpCircle,
  FiUploadCloud,
} from "react-icons/fi";
import { useFormik } from "formik";
import Image from "next/image";

const STEPS = [
  { id: 1, label: "Account", icon: FiUser },
  { id: 2, label: "Company", icon: FiBriefcase },
  { id: 3, label: "Documents", icon: FiFileText },
  { id: 4, label: "Review", icon: FiShield },
];

export default function CorporateRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userAgent, setUserAgent] = useState("");

  // Automatically extract user-agent on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserAgent(navigator.userAgent);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      // Step 1
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      // Step 2
      agency_name: "",
      business_type: "",
      currency_Id: "BDT",
      trade_license_number: "",
      trade_license_expiry: "",
      caab_certificate_number: "",
      caab_certificate_expiry: "",
      city: "",
      postcode: "",
      address: "",
      hear_about_us: "",
      // Step 3 (All Optional)
      logo: null as File | null,
      trade_license: null as File | null,
      caab_certificate: null as File | null,
      nid_front: null as File | null,
      nid_back: null as File | null,
      address_proof: null as File | null,
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      // Create FormData payload for API submission
      const formData = new FormData();

      // Append text fields & system metadata
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && !(value instanceof File)) {
          formData.append(key, value as string);
        }
      });

      // Explicitly attach user-agent
      formData.append("user-agent", userAgent);

      // Append files if provided
      const fileFields: Array<keyof typeof values> = [
        "logo",
        "trade_license",
        "caab_certificate",
        "nid_front",
        "nid_back",
        "address_proof",
      ];

      fileFields.forEach((field) => {
        const file = values[field];
        if (file instanceof File) {
          formData.append(field, file);
        }
      });

      console.log("Submitting Corporate Registration Payload:");
      for (let [k, v] of formData.entries()) {
        console.log(`${k}:`, v);
      }
    },
  });

  const handleNextStep = async () => {
    let schema;
    if (currentStep === 1) schema = step1Schema;
    if (currentStep === 2) schema = step2Schema;
    if (currentStep === 3) schema = step3Schema;

    if (schema) {
      try {
        await schema.validate(formik.values, { abortEarly: false });
        formik.setErrors({});
        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      } catch (err: any) {
        if (err.name === "ValidationError" && err.inner) {
          const newErrors: Record<string, string> = {};
          const newTouched: Record<string, boolean> = {};

          err.inner.forEach((error: any) => {
            if (error.path) {
              newErrors[error.path] = error.message;
              newTouched[error.path] = true;
            }
          });

          formik.setErrors(newErrors);
          formik.setTouched({ ...formik.touched, ...newTouched });
        }
      }
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderDocumentPreview = (file: File | null, onRemove: () => void) => {
    if (!file) return null;
    const isImage = file.type?.startsWith("image/");
    const objectUrl = isImage ? URL.createObjectURL(file) : null;

    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-gray-200 shrink-0 flex items-center justify-center overflow-hidden">
            {objectUrl ? (
              <Image
                src={objectUrl}
                width={200}
                height={200}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <FiFileText className="text-gray-500" />
            )}
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-gray-800 truncate">
              {file.name}
            </p>
            <p className="text-[10px] text-gray-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
        >
          <FiX size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200">
          <FiBriefcase className="text-red-700 text-2xl" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Corporate Registration
        </h1>
        <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
          Join as a verified travel agency and unlock exclusive corporate rates
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[680px] bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        {/* Stepper Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="relative flex items-center justify-between max-w-md mx-auto">
            <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-200 -z-0" />
            <div
              className="absolute top-5 left-0 h-[2px] bg-red-800 transition-all duration-300 -z-0"
              style={{
                width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
              }}
            />

            {STEPS.map((s) => {
              const StepIcon = s.icon;
              const isCompleted = currentStep > s.id;
              const isActive = currentStep === s.id;

              return (
                <div
                  key={s.id}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                      isCompleted
                        ? "bg-red-800 text-white shadow-md"
                        : isActive
                          ? "bg-red-800 text-white ring-4 ring-red-100 shadow-md"
                          : "bg-gray-100 text-gray-400 border border-gray-200"
                    }`}
                  >
                    {isCompleted ? (
                      <FiCheck size={18} />
                    ) : (
                      <StepIcon size={18} />
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-2 ${
                      isActive || isCompleted ? "text-red-800" : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="p-6 sm:p-8">
          {/* STEP 1: ACCOUNT */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Account Information
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enter your personal credentials to get started
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2.5 bg-gray-50/60 border border-gray-200/80 rounded-xl px-3.5 py-3">
                    <FiUser className="text-gray-400 text-lg shrink-0" />
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
                      {...formik.getFieldProps("first_name")}
                    />
                  </div>
                  {formik.touched.first_name && formik.errors.first_name && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.first_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2.5 bg-gray-50/60 border border-gray-200/80 rounded-xl px-3.5 py-3">
                    <FiUser className="text-gray-400 text-lg shrink-0" />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
                      {...formik.getFieldProps("last_name")}
                    />
                  </div>
                  {formik.touched.last_name && formik.errors.last_name && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.last_name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2.5 bg-gray-50/60 border border-gray-200/80 rounded-xl px-3.5 py-3">
                  <FiMail className="text-gray-400 text-lg shrink-0" />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
                    {...formik.getFieldProps("email")}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center bg-gray-50/60 border border-gray-200/80 rounded-xl px-3.5 py-3">
                  <span className="text-xs font-semibold text-gray-700 pr-3 border-r border-gray-300">
                    🇧🇩 +880
                  </span>
                  <input
                    type="tel"
                    placeholder="1832 698555"
                    className="w-full bg-transparent pl-3 text-sm text-gray-800 focus:outline-none"
                    {...formik.getFieldProps("phone")}
                  />
                </div>
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-xs text-red-500 mt-1">
                    {formik.errors.phone}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2.5 bg-gray-50/60 border border-gray-200/80 rounded-xl px-3.5 py-3">
                    <FiLock className="text-gray-400 text-lg shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
                      {...formik.getFieldProps("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2.5 bg-gray-50/60 border border-gray-200/80 rounded-xl px-3.5 py-3">
                    <FiLock className="text-gray-400 text-lg shrink-0" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
                      {...formik.getFieldProps("password_confirmation")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                  {formik.touched.password_confirmation &&
                    formik.errors.password_confirmation && (
                      <p className="text-xs text-red-500 mt-1">
                        {formik.errors.password_confirmation}
                      </p>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: COMPANY */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Company Information
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Provide your agency regulatory details
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    Agency Name <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2.5 bg-gray-50/60 border border-gray-200/80 rounded-xl px-3.5 py-3">
                    <FiBriefcase className="text-gray-400 text-lg shrink-0" />
                    <input
                      type="text"
                      placeholder="Sky Wings Travel"
                      className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
                      {...formik.getFieldProps("agency_name")}
                    />
                  </div>
                  {formik.touched.agency_name && formik.errors.agency_name && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.agency_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2.5 bg-gray-50/60 border border-gray-200/80 rounded-xl px-3.5 py-3">
                    <FiBriefcase className="text-gray-400 text-lg shrink-0" />
                    <select
                      className="w-full bg-transparent text-sm text-gray-800 focus:outline-none cursor-pointer"
                      {...formik.getFieldProps("business_type")}
                    >
                      <option value="">Select type</option>
                      <option value="Proprietorship">Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Limited Company">Limited Company</option>
                    </select>
                  </div>
                  {formik.touched.business_type &&
                    formik.errors.business_type && (
                      <p className="text-xs text-red-500 mt-1">
                        {formik.errors.business_type}
                      </p>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2.5 bg-gray-50/60 border border-gray-200/80 rounded-xl px-3.5 py-3">
                    <FiDollarSign className="text-gray-400 text-lg shrink-0" />
                    <select
                      className="w-full bg-transparent text-sm text-gray-800 focus:outline-none cursor-pointer"
                      {...formik.getFieldProps("currency_Id")}
                    >
                      <option value="BDT">BDT (৳)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>
                  {formik.touched.currency_Id && formik.errors.currency_Id && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.currency_Id}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    How Did You Hear About Us?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2.5 bg-gray-50/60 border border-gray-200/80 rounded-xl px-3.5 py-3">
                    <FiHelpCircle className="text-gray-400 text-lg shrink-0" />
                    <select
                      className="w-full bg-transparent text-sm text-gray-800 focus:outline-none cursor-pointer"
                      {...formik.getFieldProps("hear_about_us")}
                    >
                      <option value="">Select an option</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Google Search">Google Search</option>
                      <option value="Friend/Referral">Friend / Referral</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {formik.touched.hear_about_us &&
                    formik.errors.hear_about_us && (
                      <p className="text-xs text-red-500 mt-1">
                        {formik.errors.hear_about_us}
                      </p>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    Trade License No. <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2.5 bg-gray-50/60 border border-gray-200/80 rounded-xl px-3.5 py-3">
                    <FiFileText className="text-gray-400 text-lg shrink-0" />
                    <input
                      type="text"
                      placeholder="TRAD-2024-XXXX"
                      className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
                      {...formik.getFieldProps("trade_license_number")}
                    />
                  </div>
                  {formik.touched.trade_license_number &&
                    formik.errors.trade_license_number && (
                      <p className="text-xs text-red-500 mt-1">
                        {formik.errors.trade_license_number}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    Trade License Expiry <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2.5 bg-gray-50/60 border border-gray-200/80 rounded-xl px-3.5 py-3">
                    <FiCalendar className="text-gray-400 text-lg shrink-0" />
                    <input
                      type="date"
                      className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
                      {...formik.getFieldProps("trade_license_expiry")}
                    />
                  </div>
                  {formik.touched.trade_license_expiry &&
                    formik.errors.trade_license_expiry && (
                      <p className="text-xs text-red-500 mt-1">
                        {formik.errors.trade_license_expiry}
                      </p>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    CAAB Certificate No.
                  </label>
                  <div className="flex items-center gap-2.5 bg-gray-50/60 border border-gray-200/80 rounded-xl px-3.5 py-3">
                    <FiShield className="text-gray-400 text-lg shrink-0" />
                    <input
                      type="text"
                      placeholder="CAAB-XXXX"
                      className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
                      {...formik.getFieldProps("caab_certificate_number")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    CAAB Certificate Expiry
                  </label>
                  <div className="flex items-center gap-2.5 bg-gray-50/60 border border-gray-200/80 rounded-xl px-3.5 py-3">
                    <FiCalendar className="text-gray-400 text-lg shrink-0" />
                    <input
                      type="date"
                      className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
                      {...formik.getFieldProps("caab_certificate_expiry")}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2.5 bg-gray-50/60 border border-gray-200/80 rounded-xl px-3.5 py-3">
                    <FiMapPin className="text-gray-400 text-lg shrink-0" />
                    <input
                      type="text"
                      placeholder="Dhaka"
                      className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
                      {...formik.getFieldProps("city")}
                    />
                  </div>
                  {formik.touched.city && formik.errors.city && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    Postcode <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2.5 bg-gray-50/60 border border-gray-200/80 rounded-xl px-3.5 py-3">
                    <FiHash className="text-gray-400 text-lg shrink-0" />
                    <input
                      type="text"
                      placeholder="1212"
                      className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
                      {...formik.getFieldProps("postcode")}
                    />
                  </div>
                  {formik.touched.postcode && formik.errors.postcode && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.postcode}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Office Address <span className="text-red-500">*</span>
                </label>
                <div className="flex items-start gap-2.5 bg-gray-50/60 border border-gray-200/80 rounded-xl px-3.5 py-3 min-h-[80px]">
                  <FiMapPin className="text-gray-400 text-lg shrink-0 mt-0.5" />
                  <textarea
                    rows={2}
                    placeholder="Street, Building, Area details"
                    className="w-full bg-transparent text-sm text-gray-800 focus:outline-none resize-none"
                    {...formik.getFieldProps("address")}
                  />
                </div>
                {formik.touched.address && formik.errors.address && (
                  <p className="text-xs text-red-500 mt-1">
                    {formik.errors.address}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: DOCUMENTS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Document Upload
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Optional documents can be submitted now or attached later from
                  your dashboard
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Logo */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-800">
                    Agency Logo (Optional)
                  </label>
                  {!formik.values.logo ? (
                    <UploadFile
                      accept=".jpg,.jpeg,.png,.webp"
                      maxSizeMB={2}
                      value={formik.values.logo}
                      onChange={(file) => formik.setFieldValue("logo", file)}
                    />
                  ) : (
                    renderDocumentPreview(formik.values.logo, () =>
                      formik.setFieldValue("logo", null),
                    )
                  )}
                </div>

                {/* Trade License File */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-800">
                    Trade License Copy (Optional)
                  </label>
                  {!formik.values.trade_license ? (
                    <UploadFile
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      maxSizeMB={2}
                      value={formik.values.trade_license}
                      onChange={(file) =>
                        formik.setFieldValue("trade_license", file)
                      }
                    />
                  ) : (
                    renderDocumentPreview(formik.values.trade_license, () =>
                      formik.setFieldValue("trade_license", null),
                    )
                  )}
                </div>

                {/* CAAB File */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-800">
                    CAAB Certificate Copy (Optional)
                  </label>
                  {!formik.values.caab_certificate ? (
                    <UploadFile
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      maxSizeMB={2}
                      value={formik.values.caab_certificate}
                      onChange={(file) =>
                        formik.setFieldValue("caab_certificate", file)
                      }
                    />
                  ) : (
                    renderDocumentPreview(formik.values.caab_certificate, () =>
                      formik.setFieldValue("caab_certificate", null),
                    )
                  )}
                </div>

                {/* NID Front */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-800">
                    NID Front Copy (Optional)
                  </label>
                  {!formik.values.nid_front ? (
                    <UploadFile
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      maxSizeMB={2}
                      value={formik.values.nid_front}
                      onChange={(file) =>
                        formik.setFieldValue("nid_front", file)
                      }
                    />
                  ) : (
                    renderDocumentPreview(formik.values.nid_front, () =>
                      formik.setFieldValue("nid_front", null),
                    )
                  )}
                </div>

                {/* NID Back */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-800">
                    NID Back Copy (Optional)
                  </label>
                  {!formik.values.nid_back ? (
                    <UploadFile
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      maxSizeMB={2}
                      value={formik.values.nid_back}
                      onChange={(file) =>
                        formik.setFieldValue("nid_back", file)
                      }
                    />
                  ) : (
                    renderDocumentPreview(formik.values.nid_back, () =>
                      formik.setFieldValue("nid_back", null),
                    )
                  )}
                </div>

                {/* Address Proof */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-800">
                    Address Proof (Optional)
                  </label>
                  {!formik.values.address_proof ? (
                    <UploadFile
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      maxSizeMB={2}
                      value={formik.values.address_proof}
                      onChange={(file) =>
                        formik.setFieldValue("address_proof", file)
                      }
                    />
                  ) : (
                    renderDocumentPreview(formik.values.address_proof, () =>
                      formik.setFieldValue("address_proof", null),
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Review & Submit
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Please review your information carefully before submitting
                </p>
              </div>

              {/* Summary Card */}
              <div className="border border-gray-200/80 rounded-3xl p-6 sm:p-8 space-y-8 bg-white/50">
                {/* 1. Account Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-red-800 flex items-center justify-center shrink-0">
                      <FiUser size={16} />
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">
                      Account Information
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">
                        First Name
                      </p>
                      <p className="font-bold text-gray-900">
                        {formik.values.first_name || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">
                        Last Name
                      </p>
                      <p className="font-bold text-gray-900">
                        {formik.values.last_name || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">Email</p>
                      <p className="font-bold text-gray-900">
                        {formik.values.email || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">Phone</p>
                      <p className="font-bold text-gray-900">
                        +880{formik.values.phone || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Company Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-red-800 flex items-center justify-center shrink-0">
                      <FiBriefcase size={16} />
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">
                      Company Information
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">
                        Agency Name
                      </p>
                      <p className="font-bold text-gray-900">
                        {formik.values.agency_name || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">
                        Business Type
                      </p>
                      <p className="font-bold text-gray-900">
                        {formik.values.business_type || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">
                        Currency
                      </p>
                      <p className="font-bold text-gray-900">
                        {formik.values.currency_Id || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">
                        Hear About Us
                      </p>
                      <p className="font-bold text-gray-900">
                        {formik.values.hear_about_us || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">
                        Trade License No.
                      </p>
                      <p className="font-bold text-gray-900">
                        {formik.values.trade_license_number || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">
                        Trade License Expiry
                      </p>
                      <p className="font-bold text-gray-900">
                        {formik.values.trade_license_expiry || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">
                        CAAB Number
                      </p>
                      <p className="font-bold text-gray-900">
                        {formik.values.caab_certificate_number || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">
                        CAAB Expiry
                      </p>
                      <p className="font-bold text-gray-900">
                        {formik.values.caab_certificate_expiry || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">City</p>
                      <p className="font-bold text-gray-900">
                        {formik.values.city || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">
                        Postcode
                      </p>
                      <p className="font-bold text-gray-900">
                        {formik.values.postcode || "-"}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-gray-500 font-medium mb-0.5">
                        Address
                      </p>
                      <p className="font-bold text-gray-900 break-words">
                        {formik.values.address || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Uploaded Documents */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-red-800 flex items-center justify-center shrink-0">
                      <FiFileText size={16} />
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">
                      Uploaded Documents
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">Logo</p>
                      <p className="font-bold text-gray-900 truncate">
                        {formik.values.logo ? formik.values.logo.name : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">
                        Trade License Copy
                      </p>
                      <p className="font-bold text-gray-900 truncate">
                        {formik.values.trade_license
                          ? formik.values.trade_license.name
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">
                        CAAB Certificate
                      </p>
                      <p className="font-bold text-gray-900 truncate">
                        {formik.values.caab_certificate
                          ? formik.values.caab_certificate.name
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">
                        NID Front
                      </p>
                      <p className="font-bold text-gray-900 truncate">
                        {formik.values.nid_front
                          ? formik.values.nid_front.name
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">
                        NID Back
                      </p>
                      <p className="font-bold text-gray-900 truncate">
                        {formik.values.nid_back
                          ? formik.values.nid_back.name
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-0.5">
                        Address Proof
                      </p>
                      <p className="font-bold text-gray-900 truncate">
                        {formik.values.address_proof
                          ? formik.values.address_proof.name
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions Notice */}
              <div className="bg-red-50/40 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border border-red-800 text-red-800 flex items-center justify-center shrink-0 mt-0.5">
                  <FiCheck size={12} />
                </div>
                <p className="text-xs text-red-950 font-medium leading-relaxed">
                  By submitting this application, you confirm that all provided
                  information is accurate and you agree to our{" "}
                  <a
                    href="#"
                    className="underline font-bold text-red-900 hover:text-red-950"
                  >
                    Terms & Conditions
                  </a>
                  .
                </p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-semibold transition ${
                currentStep === 1
                  ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400"
                  : "border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer"
              }`}
            >
              <FiArrowLeft size={14} /> Back
            </button>

            <div className="flex items-center gap-4">
              <span className="text-xs font-medium text-gray-400">
                Step {currentStep} of {STEPS.length}
              </span>

              {currentStep < STEPS.length ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center gap-2 bg-[#8c181f] hover:bg-[#721319] text-white px-6 py-2.5 rounded-full text-xs font-semibold transition shadow-md cursor-pointer"
                >
                  Continue <FiArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full text-xs font-semibold transition shadow-md cursor-pointer"
                >
                  Submit Application <FiCheck size={14} />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
