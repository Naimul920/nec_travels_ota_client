"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getBanksAction } from "@/actions/bank.action";
import type { BankItem } from "@/interface/bank";
import BankDeposit from "./BankDeposit";
import MobileDeposit from "./MobileDeposit";
import Error from "@/components/common/Error/Error";
import { decoding } from "@/utils";

const Deposit: React.FC = () => {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : undefined;

  const [banks, setBanks] = useState<BankItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getBanksAction();
    setLoading(false);
    if (res.success) setBanks(res.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
    return banks.find((b) => b.id === parsed.id) ?? null;
  }, [parsed, banks]);

  if (!parsed)
    return (
      <Error
        title="Invalid Deposit Link"
        message="This deposit link is corrupted or expired. Please contact support."
      />
    );

  if (loading)
    return (
      <div className="px-5 md:px-0 py-5 space-y-4">
        <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-64 animate-pulse rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-12 rounded bg-gray-100" />
            ))}
          </div>
          <div className="h-24 rounded bg-gray-100" />
        </div>
      </div>
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

      {accountInfo.type === "MOBILE" && <MobileDeposit data={accountInfo} />}
      {accountInfo.type === "BANK" && <BankDeposit data={accountInfo} />}
    </div>
  );
};

export default Deposit;
