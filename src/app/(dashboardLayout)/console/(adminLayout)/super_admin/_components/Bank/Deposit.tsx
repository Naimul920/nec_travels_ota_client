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

  useEffect(() => {
    getBanksAction().then((res) => {
      if (res.success) setBanks(res.data);
    });
  }, []);

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