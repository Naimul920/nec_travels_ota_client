"use client";

import React, { useCallback, useEffect, useState } from "react";
import { App } from "antd";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui";
import { getBanksAction } from "@/actions/bank.action";
import type { BankItem } from "@/interface/bank";
import BankInfoCard from "./BankInfoCard";
import CreateBankModal from "./CreateBankModal";

interface Props {
  className?: string;
}

const Bank: React.FC<Props> = ({ className = "space-y-8" }) => {
  const { message } = App.useApp();
  const [banks, setBanks] = useState<BankItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getBanksAction();
    setLoading(false);
    if (res.success) {
      setBanks(res.data);
    } else {
      message.error(res.message || "Failed to load banks");
    }
  }, [message]);

  useEffect(() => {
    load();
  }, [load]);

  const bankAccounts = banks.filter((b) => b.type === "BANK");
  const mobileBankingAccounts = banks.filter((b) => b.type === "MOBILE");

  return (
    <>
      <div className={className}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Banks</h2>
          <Button
            variant="primary"
            className="h-9 px-4 text-sm"
            onClick={() => setModalOpen(true)}
          >
            <FiPlus className="mr-1" /> Create Bank
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 rounded bg-gray-200" />
                    <div className="h-3 w-20 rounded bg-gray-100" />
                  </div>
                </div>
                <div className="mt-5 space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-3 w-3/4 rounded bg-gray-100" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : bankAccounts.length > 0 || mobileBankingAccounts.length > 0 ? (
          <>
            {bankAccounts.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-4">Bank Accounts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bankAccounts.map((item) => (
                    <BankInfoCard key={item.id} data={item} />
                  ))}
                </div>
              </div>
            )}

            {mobileBankingAccounts.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-4">Mobile Banking</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mobileBankingAccounts.map((item) => (
                    <BankInfoCard key={item.id} data={item} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-400">
            No banks found yet. Click &quot;Create Bank&quot; to add one.
          </div>
        )}
      </div>

      <CreateBankModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={load}
      />
    </>
  );
};

export default Bank;
