"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, App } from "antd";
import {
  AiOutlineEdit,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineUser,
  AiOutlineCamera,
} from "react-icons/ai";
import clsx from "clsx";
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

const EditProfile: React.FC = () => {
  const { message } = App.useApp();
  const [isEditing, setIsEditing] = useState(false);
  const { data: userProfile, isPending, refetch } = useUserInfo();
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

  const displayImage = selectedFile ? previewUrl : user?.image;
  const isLoading = isPending && !user;

  const inputClass = (editable: boolean) =>
    clsx(
      "bg-white",
      editable
        ? ""
        : "cursor-not-allowed opacity-70",
    );

  return (
    <Card className="h-full w-full border! border-primary! rounded-lg">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            Profile Information
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Update your personal details
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            <AiOutlineEdit /> Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-55"
            >
              <AiOutlineCheck /> {isUpdating ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:border-secondary hover:text-secondary"
            >
              <AiOutlineClose /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="mb-6 flex items-center gap-5">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100 ring-2 ring-primary/15">
            {displayImage ? (
              <img
                src={displayImage}
                alt="Profile"
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
            title="Change photo"
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm transition hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
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
        <div className="min-w-0">
          <p className="truncate font-medium text-gray-800">
            {profile.first_name} {profile.last_name}
          </p>
          <p className="truncate text-sm text-gray-500">{profile.email}</p>
          {selectedFile ? (
            <p className="mt-1 truncate text-xs text-primary">
              {selectedFile.name}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">JPG, PNG or WEBP</p>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton-shimmer h-3 w-24 rounded-md" />
              <div className="skeleton-shimmer h-12 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              First Name
            </label>
            <Input
              value={profile.first_name}
              disabled={!isEditing}
              onChange={(e) => handleChange("first_name", e.target.value)}
              className={inputClass(isEditing)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Last Name
            </label>
            <Input
              value={profile.last_name}
              disabled={!isEditing}
              onChange={(e) => handleChange("last_name", e.target.value)}
              className={inputClass(isEditing)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Email
            </label>
            <Input
              type="email"
              value={profile.email}
              disabled
              className={inputClass(false)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Phone
            </label>
            <PhoneInputField
              value={profile.phone}
              disabled={!isEditing}
              onChange={(v) => handleChange("phone", v)}
              className={clsx("transition", !isEditing && "cursor-not-allowed")}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default EditProfile;