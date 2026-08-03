"use client"; // 1. Next.js 16 Client Component Boundary

import React from "react";
import { Button } from "@/components/ui";
import { Divider } from "antd";
// 2. Swapped React Router hook with Next.js App Router navigation utility
import { useRouter } from "next/navigation";
import { encoding } from "@/utils";
import Image from "next/image";

interface Props {
  data: any;
}

const BankInfoCard: React.FC<Props> = ({ data }) => {
  const isMobile = data.type === "MOBILE";

  // 3. Initialized Next.js router engine
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl border border-primary shadow p-5 space-y-3 hover:shadow-sm transition">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold overflow-hidden">
          {data.logo && data.logo.length > 0 ? (
            <Image
              src={data.logo}
              alt="bank logo"
              width={300}
              height={300}
              className="h-full w-full object-contain"
            />
          ) : (
            data.bankName.charAt(0)
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{data.bankName}</h3>
          <p className="text-xs text-gray-500">{data.name}</p>
        </div>
      </div>
      <Divider />
      {/* Info */}
      <div className="text-sm space-y-1">
        <p>
          <span className="font-medium">Account Name:</span> {data.accountName}
        </p>

        <p>
          <span className="font-medium">Account Number:</span>{" "}
          {data.accountNumber}
        </p>

        {!isMobile && (
          <>
            <p>
              <span className="font-medium">Routing Number:</span>{" "}
              {data.routingNumber}
            </p>
            {data.accountType.length > 0 && (
              <p>
                <span className="font-medium">Account Type:</span>{" "}
                {data.accountType}
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

      {/* Action */}
      <Button
        onClick={() =>
          // 4. Converted navigate call to router.push
          router.push(
            `/bank-info/${encoding(
              JSON.stringify({ id: data.id, type: data.type }, null, 2),
            )}`,
          )
        }
        variant="primary"
        className="w-fit h-9 text-sm"
      >
        Deposit Request
      </Button>
    </div>
  );
};

export default BankInfoCard;
