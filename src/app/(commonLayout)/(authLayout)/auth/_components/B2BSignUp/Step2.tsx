"use client";

import dayjs from "dayjs";
import { DatePicker } from "antd";
import { FormikProps } from "formik";
import { B2BSignUpFormValues } from "./types";
import FormField from "./FormField";
import ErrorText from "./ErrorText";

export default function Step2({
  formik,
}: {
  formik: FormikProps<B2BSignUpFormValues>;
}) {
  const setDateField = (
    name: keyof B2BSignUpFormValues,
    value: dayjs.Dayjs | null,
  ) => {
    formik.setFieldValue(name, value ? value.format("YYYY-MM-DD") : "");
    formik.setFieldTouched(name, true);
  };

  return (
    <div className="space-y-2.5">
      <div>
        <h2 className="text-base font-bold text-slate-900">
          Business Information
        </h2>
        <p className="text-[11px] text-slate-500">
          Enter your Business details.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <FormField
          label="Agency name"
          // name="agency_name"
          type="text"
          placeholder="Agency name"
          error={formik.errors.agency_name}
          {...formik.getFieldProps("agency_name")}
        />
        <FormField
          label="CAAB certificate number"
          // name="caab_certificate_number"
          type="text"
          placeholder="CAAB certificate number"
          error={formik.errors.caab_certificate_number}
          {...formik.getFieldProps("caab_certificate_number")}
        />
      </div>

      {/* <div className="grid gap-3 md:grid-cols-2">
        
      </div> */}

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label
            htmlFor="caab_certificate_expiry"
            className="mb-1 block text-xs font-medium text-slate-700"
          >
            CAAB certificate expiry
          </label>
          <DatePicker
            id="caab_certificate_expiry"
            size="middle"
            className="w-full"
            value={
              formik.values.caab_certificate_expiry
                ? dayjs(formik.values.caab_certificate_expiry)
                : null
            }
            onChange={(date) => setDateField("caab_certificate_expiry", date)}
          />
          <ErrorText
            id="caab_certificate_expiry-error"
            message={formik.errors.caab_certificate_expiry}
          />
        </div>
        <FormField
          label="Business address"
          // name="address"
          type="text"
          placeholder="Business address"
          error={formik.errors.address}
          {...formik.getFieldProps("address")}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <FormField
          label="City"
          // name="city"
          type="text"
          placeholder="City"
          error={formik.errors.city}
          {...formik.getFieldProps("city")}
        />
        <FormField
          label="Postcode"
          // name="postcode"
          type="text"
          placeholder="Postcode"
          error={formik.errors.postcode}
          {...formik.getFieldProps("postcode")}
        />
      </div>

      {/*remove @Akib vai*/}

      {/* <div>
        <label htmlFor="hear_about_us" className="mb-1.5 block text-sm font-medium text-slate-700">
          How did you hear about us?
        </label>
        <Select
          id="hear_about_us"
          size="large"
          className="w-full"
          placeholder="Select option"
          options={hearAboutUs}
          value={formik.values.hear_about_us || undefined}
          onChange={(value) => setField("hear_about_us", value)}
        />
        <ErrorText id="hear_about_us-error" message={formik.errors.hear_about_us} />
      </div> */}
    </div>
  );
}
