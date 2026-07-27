import React from "react";
import CommonLayout from "@/components/shared/CommonLayout/CommonLayout";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <CommonLayout>{children}</CommonLayout>;
}
