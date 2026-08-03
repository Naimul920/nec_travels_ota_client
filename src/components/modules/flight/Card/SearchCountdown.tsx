"use client";

import React, { useEffect, useState } from "react";
import { MdOutlineTimer } from "react-icons/md";

interface Props {
  expiresAt?: string;
  onExpire?: () => void;
}

const SearchCountdown: React.FC<Props> = ({ expiresAt, onExpire }) => {
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    if (!expiresAt) return;
    const target = new Date(expiresAt).getTime();

    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setRemaining(diff);
      if (diff <= 0) {
        clearInterval(id);
        if (onExpire) {
          onExpire();
        } else if (typeof window !== "undefined") {
          window.location.reload();
        }
      }
    };

    const id = setInterval(tick, 1000);
    tick();
    return () => clearInterval(id);
  }, [expiresAt, onExpire]);

  if (!expiresAt) return null;

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const expired = remaining <= 0;
  const low = remaining <= 60000;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
        expired
          ? "bg-red-100 text-red-600"
          : low
            ? "bg-red-50 text-red-500 animate-pulse"
            : "bg-gray-100 text-gray-600"
      }`}
    >
      <MdOutlineTimer size={14} />
      {expired ? (
        <span>Expired</span>
      ) : (
        <span>
          {mins.toString().padStart(2, "0")}:
          {secs.toString().padStart(2, "0")}
        </span>
      )}
    </div>
  );
};

export default SearchCountdown;