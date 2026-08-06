"use client";
import React, { useState } from "react";
import { DatePicker, App } from "antd";
import { useFormik } from "formik";
import { Button, Input, UploadFile } from "@/components/ui";
import { createDepositAction } from "@/actions/deposit.action";
import type { BankItem } from "@/interface/bank";
import type { Dayjs } from "dayjs";

interface Props {
  data: BankItem;
}

const BankDeposit: React.FC<Props> = ({ data }) => {
  const { message } = App.useApp();
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      date: null as Dayjs | null,
      senderName: "",
      senderAccount: "",
      transactionId: "",
      amount: "",
      note: "",
      file: null as File | null,
    },
    onSubmit: async (values) => {
      setSubmitting(true);
      const result = await createDepositAction({
        bankId: data.id,
        amount: Number(values.amount) || undefined,
        senderAccount: values.senderAccount || undefined,
        senderName: values.senderName || undefined,
        transactionId: values.transactionId || undefined,
        paymentDate: values.date?.isValid()
          ? values.date.toISOString()
          : undefined,
        note: values.note || undefined,
        file: values.file,
      });
      setSubmitting(false);

      if (result.success) {
        message.success(result.message || "Deposit request created successfully");
        formik.resetForm();
      } else {
        message.error(result.message || "Failed to submit deposit");
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-white p-6 rounded-xl shadow-sm space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Bank Name"
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

        <div>
          <label className="block mb-1 text-sm font-medium">Payment Date</label>
          <DatePicker
            className="w-full h-12 border border-primary! rounded-sm"
            onChange={(d) => formik.setFieldValue("date", d)}
          />
        </div>

        <Input
          className="rounded-sm border-primary"
          label="Amount"
          type="number"
          {...formik.getFieldProps("amount")}
        />

        <Input
          className="rounded-sm border-primary"
          label="Sender Name"
          placeholder="Your account holder name"
          {...formik.getFieldProps("senderName")}
        />

        <Input
          className="rounded-sm border-primary"
          label="Sender Account"
          placeholder="Your sending account number"
          {...formik.getFieldProps("senderAccount")}
        />

        <Input
          className="rounded-sm border-primary"
          label="Transaction ID"
          placeholder="Cheque / Slip / Transaction No"
          {...formik.getFieldProps("transactionId")}
        />

        <Input
          className="rounded-sm border-primary"
          label="Note"
          placeholder="Optional note"
          {...formik.getFieldProps("note")}
        />
      </div>

      <div className="md:col-span-2">
        <UploadFile
          accept="image/png, image/jpeg"
          value={formik.values.file}
          onChange={(file) => formik.setFieldValue("file", file)}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        isLoading={submitting}
        className="w-full md:w-1/9 mx-auto"
      >
        {submitting ? "Submitting..." : "Submit Deposit"}
      </Button>
    </form>
  );
};

export default BankDeposit;