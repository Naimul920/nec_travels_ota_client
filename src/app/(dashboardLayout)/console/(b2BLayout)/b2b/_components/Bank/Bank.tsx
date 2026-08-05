import React from "react";
import { bankAccounts, mobileBankingAccounts } from "@/data/bankAccounts";
import BankInfoCard from "./BankInfoCard";

const Bank: React.FC = () => {
  return (
    <>
      <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bank Accounts */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Bank Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bankAccounts.map((item) => (
              <BankInfoCard key={item.id} data={item} />
            ))}
          </div>
        </div>

        {/* Mobile Banking */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Mobile Banking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mobileBankingAccounts.map((item) => (
              <BankInfoCard key={item.id} data={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Bank;
