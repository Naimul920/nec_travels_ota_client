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
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">
          {label}
          {required && <span className="text-rose-500"> *</span>}
        </label>

        <label
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-3 transition-colors ${
            error
              ? "border-rose-300 bg-rose-50"
              : "border-slate-200 bg-slate-50 hover:border-brand hover:bg-brand/5"
          }`}
        >
          <FiUploadCloud className="mb-1.5 text-2xl text-brand" />

          <span className="max-w-full truncate px-2 text-xs font-medium text-slate-700">
            {file ? file.name : "Click to upload"}
          </span>

          <span className="mt-0.5 text-[10px] text-slate-400">JPG, PNG or PDF</span>

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
            className="mt-1 flex items-center gap-1 text-[10px] font-medium text-slate-500 hover:text-rose-600"
          >
            <FiX /> Remove file
          </button>
        )}

        <ErrorText id={errorId} message={error} />
      </div>
    </div>
  );
}

const UPLOAD_FIELDS: { label: string; name: FileFieldName }[] = [
  { label: "Company logo", name: "logo" },
  { label: "Trade license", name: "trade_license" },
  { label: "CAAB certificate", name: "caab_certificate" },
  { label: "NID", name: "nid" },
  { label: "Business card", name: "business_card" },
];

export default function Step3({ formik }: { formik: FormikProps<B2BSignUpFormValues> }) {
  return (
    <div className="space-y-2.5">
      <div>
        <h2 className="text-base font-bold text-slate-900">Upload documents</h2>
        <p className="text-[11px] text-slate-500">Upload all required company documents.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {UPLOAD_FIELDS.map((field) => (
          <UploadField key={field.name} label={field.label} name={field.name} formik={formik} />
        ))}
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
        <div className="flex items-start gap-2">
          <FiFileText className="mt-0.5 text-base text-blue-600" />

          <div>
            <h4 className="text-xs font-semibold text-blue-700">Document requirements</h4>

            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] text-blue-600">
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
