"use client"; // 1. Next.js 16 Client Component Boundary

import React, { useMemo } from "react";
// 2. Swapped React Router hook with Next.js App Router parameters utility
import { useParams } from "next/navigation";
import { bankAccounts, mobileBankingAccounts } from "@/data/bankAccounts";
import BankDeposit from "@/components/agent/Bank/BankDeposit";
import MobileDeposit from "@/components/agent/Bank/MobileDeposit";
import Error from "@/components/common/Error/Error";
import { decoding } from "@/utils";

const Deposit: React.FC = () => {
  // 3. Initialized Next.js path parameter hook
  const params = useParams();

  // 4. Safely extract dynamic segment; handles Next.js Router parameter array types safely
  const id = typeof params?.id === "string" ? params.id : undefined;

  const parsed = useMemo(() => {
    try {
      if (!id) return null;

      const decoded = decoding(id);
      if (!decoded) return null;

      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }, [id]);

  const accountInfo = useMemo(() => {
    if (!parsed?.id || !parsed?.type) return null;

    return parsed.type === "BANK"
      ? bankAccounts.find((b) => b.id === parsed.id)
      : mobileBankingAccounts.find((m) => m.id === parsed.id);
  }, [parsed]);

  if (!parsed)
    return (
      <Error
        title="Invalid Deposit Link"
        message="This deposit link is corrupted or expired. Please contact support."
      />
    );

  if (!accountInfo)
    return (
      <Error
        title="Account Not Found"
        message="The selected bank or mobile account does not exist."
      />
    );

  return (
    <div className="px-5 md:px-0 py-5">
      <h1 className="text-gray-950 md:text-2xl text-lg font-bold mb-5">
        Add Payment
      </h1>

      {parsed.type === "MOBILE" && <MobileDeposit data={accountInfo} />}
      {parsed.type === "BANK" && <BankDeposit data={accountInfo} />}
    </div>
  );
};

export default Deposit;
