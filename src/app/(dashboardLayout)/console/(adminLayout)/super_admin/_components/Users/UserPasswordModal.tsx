"use client";

import React, { useState } from "react";
import { Modal, Input } from "antd";
import {
  changeAdminUserPasswordAction,
  type ChangeUserPasswordPayload,
} from "@/actions/user.action";
import type { AdminUser } from "@/types/user.type";

interface UserPasswordModalProps {
  user: AdminUser;
  onClose: () => void;
  onSuccess: () => void;
}

const UserPasswordModal: React.FC<UserPasswordModalProps> = ({
  user,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    if (!password || password !== confirmation) return;
    const payload: ChangeUserPasswordPayload = {
      password,
      password_confirmation: confirmation,
    };
    setSubmitting(true);
    const res = await changeAdminUserPasswordAction(user.id, payload);
    setSubmitting(false);
    if (res.success) onSuccess();
  };

  return (
    <Modal
      title={`Change Password — ${user.email}`}
      open
      onCancel={onClose}
      onOk={handleSave}
      confirmLoading={submitting}
      okButtonProps={{ disabled: !password || password !== confirmation }}
      okText="Change Password"
      cancelText="Cancel"
      destroyOnHidden
    >
      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            New Password
          </label>
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <Input.Password
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="Re-enter new password"
            status={
              confirmation && password !== confirmation ? "error" : undefined
            }
          />
          {confirmation && password !== confirmation && (
            <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UserPasswordModal;