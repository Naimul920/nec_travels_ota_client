"use client";

import React, { useState } from "react";
import { Modal, App } from "antd";
import { useFormik } from "formik";
import { Button, Input, Select, UploadFile } from "@/components/ui";
import { createBankAction } from "@/actions/bank.action";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface CreateBankValues {
  type: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  branch: string;
  routing_number: string;
  account_type: string;
  logo: File | null;
}

const ACCOUNT_TYPES = ["CURRENT", "SAVINGS"];

const CreateBankModal: React.FC<Props> = ({ open, onClose, onCreated }) => {
  const { message } = App.useApp();
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik<CreateBankValues>({
    initialValues: {
      type: "BANK",
      bank_name: "",
      account_name: "",
      account_number: "",
      branch: "",
      routing_number: "",
      account_type: "CURRENT",
      logo: null,
    },
    onSubmit: async (values) => {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("type", values.type);
      fd.append("bank_name", values.bank_name);
      fd.append("account_name", values.account_name);
      fd.append("account_number", values.account_number);
      fd.append("branch", values.branch);
      fd.append("routing_number", values.routing_number);
      fd.append("account_type", values.account_type);
      if (values.logo) fd.append("logo", values.logo);

      const result = await createBankAction(fd);
      setSubmitting(false);

      if (result.success) {
        message.success(result.message || "Bank created successfully");
        formik.resetForm();
        onCreated();
        onClose();
      } else {
        message.error(result.message || "Failed to create bank");
      }
    },
  });

  const setField = (name: keyof CreateBankValues) => (value: unknown) => {
    formik.setFieldValue(name, value);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
      title={
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand" />
          <span className="text-base font-bold text-gray-900">Create Bank</span>
        </div>
      }
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Bank Name"
            name="bank_name"
            value={formik.values.bank_name}
            onChange={formik.handleChange}
            placeholder="e.g. Dutch-Bangla Bank Limited"
            required
          />
          <Select
            label="Account Type"
            name="account_type"
            value={formik.values.account_type}
            onChange={formik.handleChange}
            options={ACCOUNT_TYPES.map((t) => ({ label: t, value: t }))}
          />
          <Input
            label="Account Name"
            name="account_name"
            value={formik.values.account_name}
            onChange={formik.handleChange}
            placeholder="e.g. NEC Express Limited"
            required
          />
          <Input
            label="Account Number"
            name="account_number"
            value={formik.values.account_number}
            onChange={formik.handleChange}
            placeholder="e.g. 1781100022124"
            required
          />
          <Input
            label="Branch"
            name="branch"
            value={formik.values.branch}
            onChange={formik.handleChange}
            placeholder="e.g. Rampura"
          />
          <Input
            label="Routing Number"
            name="routing_number"
            value={formik.values.routing_number}
            onChange={formik.handleChange}
            placeholder="e.g. 090275740"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Logo
          </label>
          <UploadFile
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            value={formik.values.logo}
            onChange={setField("logo")}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="h-10 px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={submitting}
            className="h-10 px-6"
          >
            {submitting ? "Creating..." : "Create Bank"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateBankModal;
