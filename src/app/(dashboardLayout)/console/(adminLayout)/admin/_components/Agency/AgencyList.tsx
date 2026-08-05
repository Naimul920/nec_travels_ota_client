"use client";

import React from "react";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

const AgencyList: React.FC = () => {
  const router = useRouter();

  return (
    <div className="md:px-0 px-5 mt-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl line-clamp-1 font-semibold text-gray-800">
          Agency List
        </h1>
        <Button
          onClick={() => router.push("/console/admin/agencies/new")}
          className="!bg-primary !text-white"
        >
          Create New Agency
        </Button>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        Manage your partner agencies here. Use the button above to create a new
        agency.
      </p>
    </div>
  );
};

export default AgencyList;