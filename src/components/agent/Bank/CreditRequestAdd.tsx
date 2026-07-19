"use client"; // 1. Next.js 16 Client Component Boundary

import React, { useMemo } from "react";
// 2. Swapped React Router hook with Next.js App Router parameters utility
import { useParams } from "next/navigation";
import CreditRequest from "@/components/agent/Bank/CreditRequest";
import Error from "@/components/common/Error/Error";
import { decoding } from "@/utils";

interface ParsedType {
  pnr: string;
}

const CreditRequestAdd: React.FC = () => {
  // encoding(JSON.stringify({pnr:"XUYCHY"}))

  // 3. Initialized Next.js path parameter hook
  const params = useParams();

  // 4. Safely extract parameter; in Next.js App Router, dynamic params are strings or string arrays
  const pnr = typeof params?.pnr === "string" ? params.pnr : undefined;

  const parsed = useMemo<ParsedType | null>(() => {
    try {
      if (!pnr) return null;

      const decoded = decoding(pnr);
      if (!decoded) return null;

      const data: ParsedType = JSON.parse(decoded);
      if (!data.pnr) return null;

      return data;
    } catch {
      return null;
    }
  }, [pnr]);

  console.log(parsed);

  if (!parsed)
    return (
      <Error
        title="Invalid Request Link"
        message="This credit request link is corrupted or expired. Please contact support."
      />
    );

  return (
    <div className="px-5 md:px-0 py-5">
      <h1 className="text-gray-950 md:text-2xl text-lg font-bold mb-5">
        Credit Request
      </h1>

      <CreditRequest pnr={parsed.pnr} />
    </div>
  );
};

export default CreditRequestAdd;
