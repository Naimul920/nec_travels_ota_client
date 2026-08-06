"use client";

import React from "react";
import { DatePicker } from "antd";
import { useFormik } from "formik";
import { Button, Input, UploadFile } from "@/components/ui";
import type { BankItem } from "@/interface/bank";

interface Props {
  data: BankItem;
}

const MobileDeposit: React.FC<Props> = ({ data }) => {
  const formik = useFormik({
    initialValues: {
      date: null,
      amount: "",
      gatewayFee: "",
      reference: "",
      file: null,
    },
    onSubmit: (values) => {
      console.log({
        ...values,
        accountId: data.id,
        type: data.type,
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
        {/* Auto fields */}
        <Input
          label="Gateway"
          className="rounded-sm border-primary"
          value={data.bank_name}
          disabled
        />

        <Input
          label="Account Number"
          className="rounded-sm border-primary"
          value={data.account_number}
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
          label="Deposit Amount"
          type="number"
          {...formik.getFieldProps("amount")}
        />

        <Input
          className="rounded-sm border-primary"
          label="Gateway Fee"
          type="number"
          {...formik.getFieldProps("gatewayFee")}
        />

        <Input
          className="rounded-sm border-primary"
          label="Reference"
          placeholder="Transaction ID / Reference"
          {...formik.getFieldProps("reference")}
        />
      </div>

      {/* Upload (Full Width) */}
      <div className="md:col-span-2">
        <UploadFile
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

export default MobileDeposit;
