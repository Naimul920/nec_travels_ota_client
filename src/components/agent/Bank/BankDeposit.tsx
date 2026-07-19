"use client";
import React from "react";
import { DatePicker } from "antd";
import { useFormik } from "formik";
import { Button, Input, UploadFile } from "@/components/ui";
import type { BankAccountInfo } from "@/interface";

interface Props {
  data: BankAccountInfo;
}

const BankDeposit: React.FC<Props> = ({ data }) => {
  const formik = useFormik({
    initialValues: {
      date: null,
      reference: "",
      amount: "",
      file: null,
    },
    onSubmit: (values) => {
      console.log({
        ...values,
        bankId: data.id,
        depositType: data.accountType,
      });
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-white p-6 rounded-xl shadow-sm space-y-6"
    >
      {/* Grid Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Auto fill */}
        <Input
          label="Bank Name"
          className="rounded-sm border-primary"
          value={data.bankName}
          disabled
        />

        <Input
          label="Account Number"
          className="rounded-sm border-primary"
          value={data.accountNumber}
          disabled
        />

        <Input
          label="Deposit Type"
          className="rounded-sm border-primary"
          value={data.accountType || "Bank Deposit"}
          disabled
        />

        {/* Date */}
        <div>
          <label className="block mb-1 text-sm font-medium">Deposit Date</label>
          <DatePicker
            className="w-full h-12 border border-primary! rounded-sm"
            onChange={(d) => formik.setFieldValue("date", d)}
          />
        </div>

        <Input
          className="rounded-sm border-primary"
          label="Reference"
          placeholder="Cheque / Slip No"
          {...formik.getFieldProps("reference")}
        />

        <Input
          className="rounded-sm border-primary"
          label="Amount"
          type="number"
          {...formik.getFieldProps("amount")}
        />
      </div>

      {/* Upload (Full Width) */}
      <div className="md:col-span-2">
        <UploadFile
          accept="image/png, image/jpeg"
          value={formik.values.file}
          onChange={(file) => formik.setFieldValue("file", file)}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        className="w-full md:w-1/9 mx-auto"
      >
        Submit Deposit
      </Button>
    </form>
  );
};

export default BankDeposit;
