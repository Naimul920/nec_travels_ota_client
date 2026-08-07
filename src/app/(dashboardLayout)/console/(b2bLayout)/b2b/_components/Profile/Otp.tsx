"use client"; // 1. Next.js 16 Client Component Boundary

import React from "react";
import { IoChevronDown } from "react-icons/io5";
import { Button, Select } from "@/components/ui";

const Otp: React.FC = () => {
  return (
    <>
      <div className="max-w-full md:space-y-5 space-y-2 mt-5">
        <h1 className="text-primary md:text-2xl text-lg font-bold">
          Login OTP Status :
        </h1>
        <Select
          label="SELECT STATUS :"
          className="bg-white border-primary rounded"
          //   value={role}
          //   onChange={(e) => setRole(e.target.value)}
          options={[
            { label: "Login OTP Inactive", value: "inactive" },
            { label: "Login OTP Active", value: "active" },
          ]}
          iconRight={<IoChevronDown />}
        />
        <Button className="bg-primary text-white w-30 h-10">Update</Button>
      </div>
    </>
  );
};

export default Otp;
