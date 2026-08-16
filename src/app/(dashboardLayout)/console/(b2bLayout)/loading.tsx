import React from "react";

const Bone: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`skeleton-shimmer rounded-md ${className}`} />
);

const B2bLoading = () => {
  return (
    <div
      className="p-3 md:p-0 md:pt-2"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      {/* Sales Summary */}
      <div className="my-5 space-y-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <Bone className="h-6 w-36 sm:w-44" />
          <Bone className="hidden h-9 w-32 rounded-md sm:block" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <Bone className="h-10 w-10 shrink-0 rounded-full" />
                <Bone className="h-3 w-16 min-w-0" />
              </div>
              <Bone className="mt-4 h-6 w-24 max-w-full" />
              <Bone className="mt-2 h-3 w-20 max-w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left: payment summary */}
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <Bone className="mx-auto h-5 w-36" />
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <Bone className="h-3 w-16" />
              <Bone className="mt-1.5 h-9 w-full rounded-md" />
            </div>
          ))}
        </div>

        {/* Middle: calendar */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <Bone className="mx-auto h-5 w-32" />
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              {Array.from({ length: 7 }).map((_, c) => (
                <Bone key={c} className="h-3 w-6" />
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 28 }).map((_, d) => (
                <Bone key={d} className="h-9 w-full rounded-md" />
              ))}
            </div>
          </div>
        </div>

        {/* Right: date wise PNR */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <Bone className="mx-auto h-5 w-24" />
          <div className="mt-4 space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
              >
                <Bone className="h-3 w-14 rounded-md" />
                <div className="flex items-center gap-1.5">
                  <Bone className="h-4 w-4 rounded-md" />
                  <Bone className="h-3 w-10 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2bLoading;