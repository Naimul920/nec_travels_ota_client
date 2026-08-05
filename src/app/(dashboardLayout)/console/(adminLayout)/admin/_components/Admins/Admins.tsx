"use client";

import React from "react";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

const Admins: React.FC = () => {
  const router = useRouter();

  return (
    <div className="md:px-0 px-5 mt-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl line-clamp-1 font-semibold text-gray-800">
          My Admins
        </h1>
        <Button
          onClick={() => router.push("/console/admin/admins/new")}
          className="!bg-primary !text-white"
        >
          Add Admin
        </Button>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        Manage the sub-admin accounts for your agency here.
      </p>
    </div>
  );
};

export default Admins;