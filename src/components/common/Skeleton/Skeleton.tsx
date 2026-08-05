"use client";

import React from "react";

interface SkeletonProps {
  rows?: number;
  title?: boolean;
  avatar?: boolean;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  rows = 6,
  title = true,
  avatar = false,
  className = "",
}) => {
  return (
    <div
      className={`w-full p-6 md:p-8 bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse ${className}`}
      aria-busy="true"
      aria-label="Loading"
    >
      {avatar && (
        <div className="mb-5 flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/5 rounded bg-gray-200" />
            <div className="h-3 w-2/5 rounded bg-gray-200" />
          </div>
        </div>
      )}

      {title && (
        <div className="mb-5">
          <div className="h-5 w-1/3 rounded bg-gray-200" />
          <div className="mt-2 h-3 w-2/3 rounded bg-gray-100" />
        </div>
      )}

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-10 rounded-lg bg-gray-100"
            style={{
              width: `${90 - ((i * 7) % 40)}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Skeleton;