"use client";

import React from "react";
import { DatePicker } from "antd";
import { useFormik } from "formik";
import { Button, Input } from "@/components/ui";

interface CreditRequestFormValues {
  amount: string;
  commitmentDate: null | unknown;
  airline: string;
  remarks: string;
  pnr: string;
  travelDate: null | unknown;
}
interface CreditRequestProps {
  pnr: string;
}
const CreditRequest: React.FC<CreditRequestProps> = ({ pnr }) => {
  const formik = useFormik<CreditRequestFormValues>({
    initialValues: {
      amount: "",
      commitmentDate: null,
      airline: "",
      remarks: "",
      pnr: pnr || "",
      travelDate: null,
    },
    onSubmit: (values) => {
      console.log("Credit Request Submitted:", values);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-white p-6 rounded-xl shadow-sm space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Amount"
          type="number"
          className="rounded-sm border-primary"
          {...formik.getFieldProps("amount")}
        />

        <div>
          <label className="block mb-1 text-sm font-medium">
            Commitment Date
          </label>
          <DatePicker
            className="w-full h-12 border border-primary! rounded-sm"
            onChange={(d) => formik.setFieldValue("commitmentDate", d)}
          />
        </div>

        <Input
          label="Airline"
          className="rounded-sm border-primary"
          {...formik.getFieldProps("airline")}
        />

        <Input
          label="PNR"
          type="text"
          className="rounded-sm border-primary"
          value={pnr}
          onChange={(e) => formik.setFieldValue("pnr", e.target.value)}
        />

        <div>
          <label className="block mb-1 text-sm font-medium">Travel Date</label>
          <DatePicker
            className="w-full h-12 border border-primary! rounded-sm"
            onChange={(d) => formik.setFieldValue("travelDate", d)}
          />
        </div>

        <Input
          label="Remarks"
          className="rounded-sm border-primary"
          placeholder="Additional information"
          {...formik.getFieldProps("remarks")}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full md:w-2/9 mx-auto"
      >
        Submit Credit Request
      </Button>
    </form>
  );
};

export default CreditRequest;
