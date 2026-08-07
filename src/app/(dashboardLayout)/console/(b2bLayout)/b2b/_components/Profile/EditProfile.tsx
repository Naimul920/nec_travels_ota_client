"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, App } from "antd";
import Image from "next/image";
import {
  AiOutlineEdit,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineUser,
  AiOutlineCamera,
} from "react-icons/ai";
import clsx from "clsx";
import { Input } from "@/components/ui";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useAuthStore } from "@/store/auth.store";
import { updateUserProfile } from "@/actions/user.action";

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

const EditProfile: React.FC = () => {
  const { message } = App.useApp();
  const [isEditing, setIsEditing] = useState(false);
  const { data: userProfile, refetch } = useUserInfo();
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setProfile({
        first_name: userProfile.profile?.first_name || "",
        last_name: userProfile.profile?.last_name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
      });
    } else if (user) {
      const names = user.full_name?.split(" ") || ["", ""];
      setProfile({
        first_name: names[0] || "",
        last_name: names.slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [userProfile, user]);

  const handleChange = (key: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const buildFormData = (file?: File | null) => {
    const fd = new FormData();
    fd.append("first_name", profile.first_name);
    fd.append("last_name", profile.last_name);
    fd.append("phone", profile.phone);
    if (file) {
      fd.append("image", file);
    }
    fd.append("logo", "");
    return fd;
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const result = await updateUserProfile(buildFormData(file));
      if (result.success) {
        const newImage = result.data?.profile?.image ?? null;
        if (newImage && user) {
          setUser({ ...user, image: newImage });
        }
        setSelectedFile(null);
        message.success("Profile image updated");
        await refetch();
      } else {
        message.error(result.message || "Profile image upload failed");
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    } catch {
      message.error("Image upload failed. Please try again.");
      setSelectedFile(null);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const result = await updateUserProfile(buildFormData(selectedFile));

      if (!result.success) {
        message.error(result.message || "Failed to update profile");
        return;
      }

      setIsEditing(false);
      message.success(result.message || "Profile updated successfully");
      if (user) {
        setUser({
          ...user,
          full_name: `${profile.first_name} ${profile.last_name}`.trim(),
          phone: profile.phone,
        });
      }
      await refetch();
    } catch {
      message.error("Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (userProfile) {
      setProfile({
        first_name: userProfile.profile?.first_name || "",
        last_name: userProfile.profile?.last_name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
      });
    }
  };

  const image = userProfile?.profile?.image || user?.image;
  const displayImage = previewUrl || image;

  const renderRow = (
    label: string,
    value: string,
    field: keyof ProfileData,
    type: string = "text",
    readOnly?: boolean,
  ) => (
    <tr className="border-b border-b-tertiary/10 last:border-b-0">
      <td className="w-1/3 px-4 py-3 font-medium text-gray-600">{label}</td>
      <td className="px-4 py-3">
        <Input
          type={type}
          value={value}
          disabled={!isEditing || readOnly}
          onChange={(e) => handleChange(field, e.target.value)}
          className={clsx(
            "w-full rounded border px-3 py-2 transition",
            isEditing && !readOnly
              ? "border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              : "cursor-not-allowed border-transparent bg-gray-100",
          )}
        />
      </td>
    </tr>
  );

  return (
    <Card className="w-full border! border-primary! rounded-lg md:max-w-5/6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="line-clamp-1 text-lg font-semibold text-gray-800">
          Profile Information
        </h1>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
          >
            <AiOutlineEdit /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex items-center gap-1 text-primary hover:opacity-65 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <AiOutlineCheck /> {isUpdating ? "Updating..." : "Update"}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 text-secondary hover:opacity-65"
            >
              <AiOutlineClose /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="mb-6 flex items-center gap-5">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100">
            {user?.image ? (
              <Image
                src={user?.image || ""}
                alt="Profile"
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            ) : (
              <AiOutlineUser className="text-3xl text-gray-400" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
            ) : displayImage ? (
              <AiOutlineCamera size={14} />
            ) : (
              <AiOutlineEdit size={14} />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleImageSelect}
          />
        </div>
        <div>
          <p className="font-medium text-gray-800">
            {profile.first_name} {profile.last_name}
          </p>
          <p className="text-sm text-gray-500">{profile.email}</p>
          {selectedFile && (
            <p className="mt-1 text-xs text-primary">{selectedFile.name}</p>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full rounded-lg border border-tertiary/10">
          <tbody>
            {renderRow("First Name", profile.first_name, "first_name")}
            {renderRow("Last Name", profile.last_name, "last_name")}
            {renderRow("Email", profile.email, "email", "email", true)}
            {renderRow("Phone", profile.phone, "phone", "tel")}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default EditProfile;