"use client";

import React, { useState } from "react";
import { Modal, Input, InputNumber } from "antd";
import { updateUserAction, type UpdateUserPayload } from "@/actions/user.action";
import type { AdminUser } from "@/types/user.type";

interface UserUpdateModalProps {
  user: AdminUser;
  onClose: () => void;
  onSuccess: () => void;
}

const UserUpdateModal: React.FC<UserUpdateModalProps> = ({
  user,
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState<UpdateUserPayload>({
    first_name: user.profile?.first_name ?? "",
    last_name: user.profile?.last_name ?? "",
    phone: user.phone ?? "",
    email: user.email ?? "",
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof UpdateUserPayload, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    const payload: UpdateUserPayload = {
      ...form,
      credit_limit:
        form.credit_limit !== undefined ? Number(form.credit_limit) : undefined,
    };
    setSubmitting(true);
    const res = await updateUserAction(user.id, payload);
    setSubmitting(false);
    if (res.success) onSuccess();
  };

  return (
    <Modal
      title="Update User"
      open
      onCancel={onClose}
      onOk={handleSave}
      confirmLoading={submitting}
      okText="Update"
      cancelText="Cancel"
      destroyOnHidden
    >
      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            First Name
          </label>
          <Input
            value={form.first_name}
            onChange={(e) => set("first_name", e.target.value)}
            placeholder="First name"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <Input
            value={form.last_name}
            onChange={(e) => set("last_name", e.target.value)}
            placeholder="Last name"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Phone
          </label>
          <Input
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="Phone"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="Email"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Department
          </label>
          <Input
            value={form.department}
            onChange={(e) => set("department", e.target.value)}
            placeholder="Department"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Credit Limit
          </label>
          <InputNumber
            className="w-full"
            min={0}
            value={form.credit_limit}
            onChange={(v) => set("credit_limit", v)}
            placeholder="Credit limit"
          />
        </div>
      </div>
    </Modal>
  );
};

export default UserUpdateModal;