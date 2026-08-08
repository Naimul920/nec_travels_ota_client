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
  AiOutlineMail,
  AiOutlinePhone,
} from "react-icons/ai";
import { FiUser, FiAtSign } from "react-icons/fi";
import { Input, PhoneInputField } from "@/components/ui";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useAuthStore } from "@/store/auth.store";
import { updateUserProfile } from "@/actions/user.action";

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

const B2cEditProfile: React.FC = () => {
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
  const fullName = `${profile.first_name} ${profile.last_name}`.trim() || "Your Name";

  const inputClass = (isActive: boolean) =>
    isActive
      ? "border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
      : "cursor-default border-transparent bg-gray-50";

  return (
    <Card
      className="overflow-hidden rounded-2xl border! border-gray-100! shadow-sm"
      styles={{ body: { padding: 0 } }}
    >
      {/* Header band */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-[#0F1B47] to-[#1B2E5F] px-6 py-5">
        <div>
          <h1 className="text-lg font-bold text-white">Profile Information</h1>
          <p className="text-xs text-white/60">
            Manage your personal details and profile photo
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[#F5C518] px-4 py-2 text-sm font-bold text-[#0F1B47] transition-all hover:opacity-90"
          >
            <AiOutlineEdit size={15} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <AiOutlineCheck size={15} />
              {isUpdating ? "Updating..." : "Update"}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white/25"
            >
              <AiOutlineClose size={15} /> Cancel
            </button>
          </div>
        )}
      </div>

      {/* Identity section */}
      <div className="flex flex-col items-center gap-5 border-b border-gray-100 px-6 py-6 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#DCEBF9] bg-gray-100 ring-2 ring-[#0F1B47]/5">
            {displayImage ? (
              <Image
                src={displayImage}
                alt="Profile"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            ) : (
              <AiOutlineUser className="text-4xl text-gray-300" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute -bottom-0.5 -right-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md transition-colors hover:bg-[#F7F4EC] hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
            ) : (
              <AiOutlineCamera size={15} />
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

        <div className="text-center sm:text-left">
          <p className="text-lg font-bold text-[#0F1B47]">{fullName}</p>
          <div className="mt-1.5 flex flex-col items-center gap-1 text-sm text-[#6B7785] sm:items-start">
            <span className="inline-flex items-center gap-1.5">
              <FiAtSign size={13} className="text-[#8FA9BE]" />
              {profile.email || "—"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <AiOutlinePhone size={13} className="text-[#8FA9BE]" />
              {profile.phone || "—"}
            </span>
          </div>
          {selectedFile && (
            <p className="mt-1.5 text-xs text-primary">{selectedFile.name}</p>
          )}
        </div>
      </div>

      {/* Fields */}
      <div className="px-6 py-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#0F1B47]">
          <FiUser size={15} className="text-[#8FA9BE]" />
          Personal Details
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            value={profile.first_name}
            disabled={!isEditing}
            onChange={(e) => handleChange("first_name", e.target.value)}
            iconLeft={<FiUser />}
            className={inputClass(isEditing)}
          />
          <Input
            label="Last Name"
            value={profile.last_name}
            disabled={!isEditing}
            onChange={(e) => handleChange("last_name", e.target.value)}
            iconLeft={<FiUser />}
            className={inputClass(isEditing)}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            label="Email"
            type="email"
            value={profile.email}
            disabled
            onChange={(e) => handleChange("email", e.target.value)}
            iconLeft={<AiOutlineMail />}
            className="cursor-not-allowed border-transparent bg-gray-50 opacity-70"
          />
          <PhoneInputField
            label="Phone"
            value={profile.phone}
            disabled={!isEditing}
            onChange={(v) => handleChange("phone", v)}
            className={inputClass(isEditing)}
          />
        </div>
      </div>
    </Card>
  );
};

export default B2cEditProfile;
