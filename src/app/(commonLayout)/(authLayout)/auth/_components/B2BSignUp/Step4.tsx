"use client";

import { ReactNode } from "react";
import {
  FiBriefcase,
  FiCheckCircle,
  FiFile,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import { B2BSignUpFormValues } from "./types";

function Item({ icon, label, value }: { icon: ReactNode; label: string; value?: string }) {
  return (
    <div className="flex gap-2 rounded-lg border border-slate-200 p-2.5">
      <div className="mt-0.5 text-brand">{icon}</div>

      <div className="flex-1">
        <p className="text-[9px] uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 text-[13px] font-medium text-slate-800">{value || "-"}</p>
      </div>
    </div>
  );
}

function FileItem({ label, file }: { label: string; file: File | null }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-2.5">
      <div className="flex items-center gap-2">
        <FiFile className="text-base text-brand" />

        <div>
          <p className="text-[13px] font-medium text-slate-800">{label}</p>
          <p className="text-[11px] text-slate-500">{file ? file.name : "Not uploaded"}</p>
        </div>
      </div>

      {file && <FiCheckCircle className="text-lg text-emerald-500" />}
    </div>
  );
}

export default function Step4({ values }: { values: B2BSignUpFormValues }) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-base font-bold text-slate-900">Review registration</h2>
        <p className="text-[11px] text-slate-500">Please review all information before submitting.</p>
      </div>

      <div>
        <h3 className="mb-1.5 text-[13px] font-semibold text-slate-900">Account information</h3>

        <div className="grid gap-2 md:grid-cols-2">
          <Item icon={<FiUser />} label="First name" value={values.first_name} />
          <Item icon={<FiUser />} label="Last name" value={values.last_name} />
          <Item icon={<FiMail />} label="Email" value={values.email} />
          <Item icon={<FiPhone />} label="Phone" value={values.phone} />
        </div>
      </div>

      <div>
        <h3 className="mb-1.5 text-[13px] font-semibold text-slate-900">Company information</h3>

        <div className="grid gap-2 md:grid-cols-2">
          <Item icon={<FiBriefcase />} label="Agency" value={values.agency_name} />
          <Item icon={<FiBriefcase />} label="CAAB certificate" value={values.caab_certificate_number} />
          <Item icon={<FiMapPin />} label="City" value={values.city} />
          <Item icon={<FiMapPin />} label="Postcode" value={values.postcode} />
          <Item icon={<FiMapPin />} label="Address" value={values.address} />
          {/* <Item icon={<FiMapPin />} label="Hear about us" value={values.hear_about_us} /> */}
        </div>
      </div>

      <div>
        <h3 className="mb-1.5 text-[13px] font-semibold text-slate-900">Uploaded documents</h3>

        <div className="grid gap-2 md:grid-cols-2">
          <FileItem label="Company logo" file={values.logo} />
          <FileItem label="Trade license" file={values.trade_license} />
          <FileItem label="CAAB certificate" file={values.caab_certificate} />
          <FileItem label="NID" file={values.nid} />
          <FileItem label="Business card" file={values.business_card} />
        </div>
      </div>

      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
        <div className="flex gap-2">
          <FiCheckCircle className="mt-0.5 text-lg text-emerald-600" />

          <div>
            <h4 className="text-xs font-semibold text-emerald-700">Ready to submit</h4>
            <p className="mt-0.5 text-[11px] text-emerald-600">
              By clicking <strong>Submit registration</strong>, you confirm that all provided
              information and uploaded documents are accurate. Our team will review your
              application and notify you by email once verification is complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
