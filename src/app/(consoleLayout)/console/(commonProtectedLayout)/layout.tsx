"use client";

import { useState } from "react";
// import { Header } from "@/components/shared";
import Sidebar from "@/components/shared/Sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex flex-1 flex-col">
        {/* <Header /> */}
        <h1>Common Protected Layout Header</h1>
        <main className="flex-1 overflow-auto p-6">{children}</main>
        <p>Footer common protected layout</p>
      </div>
    </div>
  );
}
