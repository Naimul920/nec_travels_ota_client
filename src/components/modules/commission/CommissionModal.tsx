"use client";

import React, { useState } from "react";
import { Modal, App } from "antd";
import { useFormik } from "formik";
import { Button, Input, Select } from "@/components/ui";
import {
  createCommissionAction,
  updateCommissionAction,
  type CommissionInput,
} from "@/actions/commission.action";
import type { CommissionItem } from "@/interface/commission";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editing?: CommissionItem | null;
  packageOptions: { label: string; value: string }[];
}

const CommissionModal: React.FC<Props> = ({
  open,
  onClose,
  onSaved,
  editing,
  packageOptions,
}) => {
  const { message } = App.useApp();
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik<CommissionInput>({
    initialValues: {
      airline: editing?.airline ?? "",
      origin: editing?.origin ?? "",
      destination: editing?.destination ?? "",
      business_class_out: editing?.business_class_out ?? 0,
      economy_class_out: editing?.economy_class_out ?? 0,
      business_charge_out: editing?.business_charge_out ?? 0,
      economy_charge_out: editing?.economy_charge_out ?? 0,
      api_currency_id: editing?.api_currency_id ?? "",
      user_currency_id: editing?.user_currency_id ?? "",
      package_id: editing?.package_id ?? "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      setSubmitting(true);
      const payload: CommissionInput = {
        ...values,
        airline: values.airline || null,
        origin: values.origin || null,
        destination: values.destination || null,
        business_class_out: values.business_class_out || "0",
        economy_class_out: values.economy_class_out || "0",
        business_charge_out: values.business_charge_out || "0",
        economy_charge_out: values.economy_charge_out || "0",
        api_currency_id: values.api_currency_id || null,
        user_currency_id: values.user_currency_id || null,
        package_id: values.package_id || null,
      };

      const result = editing
        ? await updateCommissionAction(editing.id, payload)
        : await createCommissionAction(payload);
      setSubmitting(false);

      if (result.success) {
        message.success(result.message || "Commission saved successfully");
        onSaved();
        onClose();
      } else {
        message.error(result.message || "Failed to save commission");
      }
    },
  });

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
      title={
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand" />
          <span className="text-base font-bold text-gray-900">
            {editing ? "Edit Commission" : "Create Commission"}
          </span>
        </div>
      }
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Airline"
            name="airline"
            value={formik.values.airline ?? ""}
            onChange={formik.handleChange}
            placeholder="e.g. Biman Bangladesh"
          />
          <Select
            label="Package"
            name="package_id"
            value={formik.values.package_id ?? ""}
            onChange={formik.handleChange}
            options={
              packageOptions.length
                ? packageOptions
                : [{ label: "No packages", value: "" }]
            }
            placeholder="Select package"
          />
          <Input
            label="Origin"
            name="origin"
            value={formik.values.origin ?? ""}
            onChange={formik.handleChange}
            placeholder="e.g. DAC"
          />
          <Input
            label="Destination"
            name="destination"
            value={formik.values.destination ?? ""}
            onChange={formik.handleChange}
            placeholder="e.g. JFK"
          />
        </div>

        <p className="text-sm font-semibold text-gray-700">Commission (%)</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Business Class"
            name="business_class_out"
            value={String(formik.values.business_class_out)}
            onChange={formik.handleChange}
            placeholder="e.g. 5"
          />
          <Input
            label="Economy Class"
            name="economy_class_out"
            value={String(formik.values.economy_class_out)}
            onChange={formik.handleChange}
            placeholder="e.g. 3"
          />
        </div>

        <p className="text-sm font-semibold text-gray-700">Charge</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Business Charge"
            name="business_charge_out"
            value={String(formik.values.business_charge_out)}
            onChange={formik.handleChange}
            placeholder="e.g. 10"
          />
          <Input
            label="Economy Charge"
            name="economy_charge_out"
            value={String(formik.values.economy_charge_out)}
            onChange={formik.handleChange}
            placeholder="e.g. 8"
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
            {submitting ? "Saving..." : editing ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CommissionModal;