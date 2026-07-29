"use client";

import { FormikProps } from "formik";
import { FiFileText, FiUploadCloud, FiX } from "react-icons/fi";
import { B2BSignUpFormValues, FileFieldName } from "./types";
import ErrorText from "./ErrorText";

interface UploadFieldProps {
  label: string;
  name: FileFieldName;
  formik: FormikProps<B2BSignUpFormValues>;
}

function UploadField({ label, name, formik }: UploadFieldProps) {
  const file = formik.values[name];
  const error = formik.errors[name] as string | undefined;
  const required = false;
  const errorId = `${name}-error`;

  const handleChange = (selected: File | null) => {
    formik.setFieldValue(name, selected);
    formik.setFieldTouched(name, true);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>

      <label
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-colors ${
          error
            ? "border-rose-300 bg-rose-50"
            : "border-slate-200 bg-slate-50 hover:border-[#8c181f] hover:bg-red-50"
        }`}
      >
        <FiUploadCloud className="mb-3 text-4xl text-[#8c181f]" />

        <span className="max-w-full truncate px-2 font-medium text-slate-700">
          {file ? file.name : "Click to upload"}
        </span>

        <span className="mt-1 text-xs text-slate-400">JPG, PNG or PDF (max 5MB)</span>

        <input
          hidden
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => handleChange(e.currentTarget.files?.[0] ?? null)}
        />
      </label>

      {file && (
        <button
          type="button"
          onClick={() => handleChange(null)}
          className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-rose-600"
        >
          <FiX /> Remove file
        </button>
      )}

      <ErrorText id={errorId} message={error} />
    </div>
  );
}

const UPLOAD_FIELDS: { label: string; name: FileFieldName }[] = [
  { label: "Company logo", name: "logo" },
  { label: "Trade license", name: "trade_license" },
  { label: "CAAB certificate", name: "caab_certificate" },
  { label: "NID", name: "full_nid" },
  { label: "Business card", name: "business_card" },
  { label: "Address proof", name: "address_proof" },
];

export default function Step3({ formik }: { formik: FormikProps<B2BSignUpFormValues> }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Upload documents</h2>
        <p className="mt-1 text-sm text-slate-500">Upload all required company documents.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {UPLOAD_FIELDS.map((field) => (
          <UploadField key={field.name} label={field.label} name={field.name} formik={formik} />
        ))}
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <FiFileText className="mt-1 text-xl text-blue-600" />

          <div>
            <h4 className="font-semibold text-blue-700">Document requirements</h4>

            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-blue-600">
              <li>Maximum file size: 1 MB.</li>
              <li>Supported formats: JPG, PNG, PDF.</li>
              <li>Trade license must be valid and unexpired.</li>
              <li>Documents should be clear and readable.</li>
              <li>NID must show both front and back.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
