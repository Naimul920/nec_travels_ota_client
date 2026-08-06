"use client";

import React from "react";
import { Divider } from "antd";
import type { BankItem } from "@/interface/bank";

interface Props {
  data: BankItem;
}

const resolveLogo = (logoKey?: string | null) => {
  if (!logoKey) return undefined;
  return `/api/media?path=${encodeURIComponent(logoKey)}`;
};

const BankInfoCard: React.FC<Props> = ({ data }) => {
  const isMobile = data.type === "MOBILE";
  const logo = resolveLogo(data.logo_key);

  return (
    <div className="bg-white rounded-xl border border-primary shadow p-5 space-y-3 hover:shadow-sm transition">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold overflow-hidden">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt={data.bank_name}
              className="h-full w-full object-contain"
            />
          ) : (
            (data.bank_name?.charAt(0) ?? "B")
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{data.bank_name}</h3>
          <p className="text-xs text-gray-500">{data.branch}</p>
        </div>
      </div>
      <Divider />
      <div className="text-sm space-y-1">
        <p>
          <span className="font-medium">Account Name:</span>{" "}
          {data.account_name}
        </p>
        <p>
          <span className="font-medium">Account Number:</span>{" "}
          {data.account_number}
        </p>
        {!isMobile && (
          <>
            <p>
              <span className="font-medium">Routing Number:</span>{" "}
              {data.routing_number || "-"}
            </p>
            {data.account_type && (
              <p>
                <span className="font-medium">Account Type:</span>{" "}
                {data.account_type}
              </p>
            )}
          </>
        )}
        {isMobile && (
          <p>
            <span className="font-medium">Type:</span> Merchant Account
          </p>
        )}
      </div>
    </div>
  );
};

export default BankInfoCard;