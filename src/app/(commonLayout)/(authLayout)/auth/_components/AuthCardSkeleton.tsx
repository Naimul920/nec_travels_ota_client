import React from "react";

interface AuthCardSkeletonProps {
  compact?: boolean;
}

const AuthCardSkeleton: React.FC<AuthCardSkeletonProps> = ({ compact }) => {
  if (compact) {
    return (
      <div className="w-full animate-pulse space-y-6 p-6 sm:p-8">
        <div className="space-y-2">
          <div className="h-8 w-44 rounded bg-slate-200" />
          <div className="h-4 w-56 rounded bg-slate-200" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-12 w-full rounded-xl bg-slate-200" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-12 w-full rounded-xl bg-slate-200" />
        </div>
        <div className="h-12 w-full rounded-xl bg-[#6FDB9E]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100svh-4rem)] w-full items-center justify-center px-4 py-10">
      <div className="relative grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-[#12233D]/10 bg-white shadow-2xl animate-pulse md:grid-cols-5">
        {/* Left ticket stub placeholder */}
        <div className="relative col-span-2 hidden flex-col justify-between overflow-hidden bg-brand/70 p-10 md:flex">
          <div className="space-y-4">
            <div className="h-4 w-28 rounded bg-white/40" />
            <div className="h-24 w-44 rounded bg-white/30" />
          </div>
          <div className="h-16 w-40 rounded bg-white/30" />
        </div>

        {/* Right form panel placeholder */}
        <div className="col-span-1 p-8 sm:p-10 md:col-span-3">
          <div className="mx-auto w-full max-w-sm space-y-6">
            <div className="space-y-2">
              <div className="h-8 w-44 rounded bg-slate-200" />
              <div className="h-4 w-60 rounded bg-slate-200" />
            </div>

            <div className="space-y-3">
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="h-12 w-full rounded-xl bg-slate-200" />
            </div>

            <div className="space-y-3">
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="h-12 w-full rounded-xl bg-slate-200" />
            </div>

            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="h-4 w-28 rounded bg-slate-200" />
            </div>

            <div className="h-12 w-full rounded-xl bg-brand/40" />

            <div className="mx-auto h-4 w-48 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCardSkeleton;
