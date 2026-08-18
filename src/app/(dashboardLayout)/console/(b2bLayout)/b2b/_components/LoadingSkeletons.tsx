import React from "react";

export const Bone: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`skeleton-shimmer rounded-md ${className}`} />
);

export const DashboardSkeleton = () => {
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
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <Bone className="mx-auto h-5 w-36" />
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <Bone className="h-3 w-16" />
              <Bone className="mt-1.5 h-9 w-full rounded-md" />
            </div>
          ))}
        </div>

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

const TABLE_HEADERS = [
  "SL",
  "Date",
  "Booking Reference",
  "Passenger",
  "PNR",
  "Route",
  "Amount",
];

export const PageTableSkeleton = () => {
  return (
    <div className="p-3 md:p-0 md:pt-2" aria-busy="true" aria-label="Loading table">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 md:pb-5">
        <Bone className="h-8 w-44" />
        <Bone className="h-10 w-64 rounded-md" />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="hidden grid-cols-7 gap-4 border-b border-gray-100 bg-gray-50/60 px-4 py-3 sm:grid">
          {TABLE_HEADERS.map((h, i) => (
            <Bone
              key={h}
              className={`h-3 ${i === 2 ? "col-span-2" : ""} w-16`}
            />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, r) => (
          <div
            key={r}
            className="grid grid-cols-4 gap-4 border-b border-gray-100 px-4 py-4 last:border-b-0 sm:grid-cols-7"
          >
            <Bone className="h-3 w-6" />
            <Bone className="h-3 w-16" />
            <Bone className="h-3 w-24 sm:col-span-2" />
            <Bone className="h-3 w-20" />
            <Bone className="h-3 w-12" />
            <Bone className="h-3 w-16" />
            <Bone className="h-3 w-14" />
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <Bone className="h-3 w-28" />
          <div className="flex gap-2">
            <Bone className="h-8 w-20 rounded-md" />
            <Bone className="h-8 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfileSkeleton = () => {
  const CardShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="rounded-lg border border-primary/20 bg-white p-5 shadow-sm">
      {children}
    </div>
  );

  return (
    <div
      className="grid grid-cols-1 gap-6 xl:grid-cols-2"
      aria-busy="true"
      aria-label="Loading profile"
    >
      <CardShell>
        <div className="mb-6 flex items-center justify-between">
          <Bone className="h-5 w-40" />
          <Bone className="h-4 w-12" />
        </div>
        <div className="mb-6 flex items-center gap-5">
          <Bone className="h-20 w-20 shrink-0 rounded-full" />
          <div className="space-y-2">
            <Bone className="h-4 w-32" />
            <Bone className="h-3 w-44" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-tertiary/10 py-3 last:border-b-0"
            >
              <Bone className="h-3 w-20" />
              <Bone className="h-4 w-40 rounded" />
            </div>
          ))}
        </div>
      </CardShell>

      <CardShell>
        <div className="mb-6 flex items-center justify-between">
          <Bone className="h-5 w-36" />
          <Bone className="h-8 w-8 rounded-full" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Bone className="h-3 w-24" />
              <Bone className="h-10 w-full rounded-md" />
            </div>
          ))}
          <Bone className="h-11 w-full rounded-lg" />
        </div>
      </CardShell>
    </div>
  );
};

export const FlightSearchSkeleton = () => {
  return (
    <div className="p-3 md:p-0 md:pt-2" aria-busy="true" aria-label="Loading flight search">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_20px_60px_rgba(15,35,61,0.15)] md:p-4">
        <div className="mb-4 flex gap-2 overflow-hidden">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Bone
              key={i}
              className={`h-9 shrink-0 rounded-full ${i === 0 ? "w-24" : "w-20"}`}
            />
          ))}
        </div>

        <div className="mb-3 flex items-center gap-5 px-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full border-2 border-gray-300 bg-white" />
              <Bone className="h-3 w-14" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          <div className="grid gap-3 sm:grid-cols-2 md:col-span-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="space-y-2 rounded-md border border-slate-200 bg-white p-3"
              >
                <Bone className="h-2.5 w-16" />
                <Bone className="h-5 w-24" />
                <Bone className="h-2 w-28" />
              </div>
            ))}
          </div>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="space-y-2 rounded-md border border-slate-200 bg-white p-3"
            >
              <Bone className="h-2.5 w-20" />
              <Bone className="h-5 w-24" />
              <Bone className="h-2 w-16" />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Bone className="h-11 w-40 rounded-lg bg-slate-700" />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <Bone className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Bone className="h-4 w-40" />
                <Bone className="h-3 w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <Bone className="ml-auto h-5 w-20" />
              <Bone className="h-8 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const B2bGenericSkeleton = () => {
  return (
    <div className="p-3 md:p-0 md:pt-2" aria-busy="true" aria-label="Loading page">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 md:pb-5">
        <Bone className="h-8 w-44" />
        <Bone className="h-10 w-40 rounded-md" />
      </div>

      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-3">
              <Bone className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Bone className="h-4 w-40" />
                <Bone className="h-3 w-28" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="space-y-2">
                  <Bone className="h-3 w-20" />
                  <Bone className="h-5 w-24" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
