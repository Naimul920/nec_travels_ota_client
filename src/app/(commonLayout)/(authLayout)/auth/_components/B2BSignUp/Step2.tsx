"use client";

import dayjs from "dayjs";
import { DatePicker, Select } from "antd";
import { FormikProps } from "formik";
import { B2BSignUpFormValues } from "./types";
import FormField from "./FormField";
import ErrorText from "./ErrorText";

const businessTypes = [
  { label: "Travel Agency", value: "TRAVEL_AGENCY" },
  { label: "Tour Operator", value: "TOUR_OPERATOR" },
  { label: "Corporate", value: "CORPORATE" },
];

const currencies = [
  { label: "BDT", value: "BDT" },
  { label: "USD", value: "USD" },
];

const hearAboutUs = [
  { label: "Google", value: "GOOGLE" },
  { label: "Facebook", value: "FACEBOOK" },
  { label: "Friend", value: "FRIEND" },
  { label: "Advertisement", value: "ADVERTISEMENT" },
];

export default function Step2({ formik }: { formik: FormikProps<B2BSignUpFormValues> }) {
  const setField = (name: keyof B2BSignUpFormValues, value: string) => {
    formik.setFieldValue(name, value);
    formik.setFieldTouched(name, true);
  };

  const setDateField = (name: keyof B2BSignUpFormValues, value: dayjs.Dayjs | null) => {
    formik.setFieldValue(name, value ? value.format("YYYY-MM-DD") : "");
    formik.setFieldTouched(name, true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Business Information</h2>
        <p className="mt-1 text-sm text-slate-500">Enter your Business details.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          label="Agency name"
          // name="agency_name"
          type="text"
          placeholder="Agency name"
          error={formik.errors.agency_name}
          {...formik.getFieldProps("agency_name")}
        />
        <FormField
          label="Trade / Business license number"
          // name="trade_license_number"
          type="text"
          placeholder="License number"
          error={formik.errors.trade_license_number}
          {...formik.getFieldProps("trade_license_number")}
        />

      
      </div>

      {/* <div className="grid md:grid-cols-2"> */}
        {/** Remove for Akib vai requirments */}
        {/* <div>
          <label htmlFor="business_type" className="mb-1.5 block text-sm font-medium text-slate-700">
            Business type
          </label>
          <Select
            id="business_type"
            size="large"
            className="w-full"
            placeholder="Select business type"
            options={businessTypes}
            status={formik.errors.business_type ? "error" : undefined}
            value={formik.values.business_type || undefined}
            onChange={(value) => setField("business_type", value)}
          />
          <ErrorText id="business_type-error" message={formik.errors.business_type} />
        </div> */}



        {/** No need this input field it will handle in developer  */}
        {/* <div>
          <label htmlFor="currency_id" className="mb-1.5 block text-sm font-medium text-slate-700">
            Currency
          </label>
          <Select
            id="currency_id"
            size="large"
            className="w-full"
            options={currencies}
            value={formik.values.currency_id}
            onChange={(value) => setField("currency_id", value)}
          />
          <ErrorText id="currency_id-error" message={formik.errors.currency_id} />
        </div> */}

        
      {/* </div> */}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="trade_license_expiry"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Trade license expiry
          </label>
          <DatePicker
            id="trade_license_expiry"
            size="large"
            className="w-full"
            status={formik.errors.trade_license_expiry ? "error" : undefined}
            value={
              formik.values.trade_license_expiry ? dayjs(formik.values.trade_license_expiry) : null
            }
            onChange={(date) => setDateField("trade_license_expiry", date)}
          />
          <ErrorText id="trade_license_expiry-error" message={formik.errors.trade_license_expiry} />
        </div>

        <FormField
          label="CAAB certificate number"
          // name="caab_certificate_number"
          type="text"
          placeholder="CAAB certificate number"
          error={formik.errors.caab_certificate_number}
          {...formik.getFieldProps("caab_certificate_number")}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="caab_certificate_expiry"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            CAAB certificate expiry
          </label>
          <DatePicker
            id="caab_certificate_expiry"
            size="large"
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

      <div className="grid gap-5 md:grid-cols-2">
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
