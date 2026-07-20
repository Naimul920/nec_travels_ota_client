"use client"; // 1. Next.js 16 Client Component Boundary

import React, { useState } from "react";
import { Card } from "antd";
import { AiOutlineEdit, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import clsx from "clsx";
import { Input } from "@/components/ui";

interface ProfileData {
  username: string;
  email: string;
  companyName: string;
  mobileNumber: string;
  companyAddress: string;
  memberSince: string;
}

const EditProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    username: "john_doe",
    email: "john@example.com",
    companyName: "ABC Travels Ltd.",
    mobileNumber: "+880 1712345678",
    companyAddress: "Dhaka, Bangladesh",
    memberSince: "12 March 2022",
  });

  const handleChange = (key: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = () => {
    setIsEditing(false);
    console.log("Updated Profile:", profile);
    // 🔜 API call later
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const renderRow = (
    label: string,
    value: string,
    field: keyof ProfileData,
    type: string = "text",
  ) => (
    <tr className="border-b border-b-tertiary/10 last:border-b-0">
      <td className="py-3 px-4 font-medium text-gray-600 w-1/3">{label}</td>
      <td className="py-3 px-4">
        <Input
          type={type}
          value={value}
          disabled={!isEditing}
          onChange={(e) => handleChange(field, e.target.value)}
          className={clsx(
            "w-full px-3 py-2 rounded border transition",
            isEditing
              ? "border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              : "border-transparent bg-gray-100 cursor-not-allowed",
          )}
        />
      </td>
    </tr>
  );

  return (
    <Card className="md:max-w-5/6 w-full border! border-primary! rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg line-clamp-1 font-semibold text-gray-800">
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
              className="flex items-center gap-1 text-primary hover:opacity-65"
            >
              <AiOutlineCheck /> Update
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-tertiary/10 rounded-lg">
          <tbody>
            {renderRow("Username", profile.username, "username")}
            {renderRow("Email", profile.email, "email", "email")}
            {renderRow("Company Name", profile.companyName, "companyName")}
            {renderRow("Mobile Number", profile.mobileNumber, "mobileNumber")}
            {renderRow(
              "Company Address",
              profile.companyAddress,
              "companyAddress",
            )}
            {renderRow("Member Since", profile.memberSince, "memberSince")}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default EditProfile;
