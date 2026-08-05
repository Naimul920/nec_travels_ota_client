import React from "react";
import Skeleton from "@/components/common/Skeleton/Skeleton";

const DashboardLoading = () => {
  return (
    <div className="p-3 md:p-0 md:pt-2">
      <Skeleton />
    </div>
  );
};

export default DashboardLoading;