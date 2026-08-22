import React from "react";

interface AuthCardSkeletonProps {
  compact?: boolean;
  wide?: boolean;
  recovery?: boolean;
}

const AuthCardSkeleton: React.FC<AuthCardSkeletonProps> = ({ compact, wide = false, recovery = false }) => {
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
    <div className="flex w-full items-center justify-center" aria-busy="true" aria-label="Loading authentication form">
      <div className={`relative grid w-full animate-pulse grid-cols-1 overflow-hidden rounded-3xl border border-[#12233D]/10 bg-white shadow-xl md:grid-cols-5 ${wide ? "max-w-6xl" : "max-w-4xl"}`}>
        {/* Left ticket stub placeholder */}
        <div className="relative col-span-2 hidden flex-col overflow-hidden bg-linear-to-l from-[#F0F9F1] via-[#B9EBCF] to-[#6FDB9E] p-10 md:flex">
          <div className="h-4 w-28 rounded bg-white/45" />
          {recovery ? (
            <div className="flex flex-1 flex-col justify-center space-y-5 py-8">
              <div className="h-14 w-14 rounded-2xl bg-white/55" />
              <div className="space-y-3"><div className="h-7 w-52 rounded bg-white/50" /><div className="h-3 w-full rounded bg-white/35" /><div className="h-3 w-4/5 rounded bg-white/35" /></div>
              <div className="h-44 w-full rounded-2xl bg-white/60" />
            </div>
          ) : (
            <><div className="mt-10 h-24 w-44 rounded bg-white/30" /><div className="mt-auto h-16 w-40 rounded bg-white/30" /></>
          )}
        </div>

        {/* Right form panel placeholder */}
        <div className="col-span-1 p-8 sm:p-10 md:col-span-3">
          <div className={`mx-auto w-full space-y-6 ${wide ? "max-w-lg" : "max-w-sm"}`}>
            <div className="space-y-2">
              <div className="h-8 w-44 rounded bg-slate-200" />
              <div className="h-4 w-60 rounded bg-slate-200" />
            </div>

            {wide && (
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 p-1.5">
                <div className="h-12 rounded-xl bg-brand/30" />
                <div className="h-12 rounded-xl bg-slate-100" />
              </div>
            )}

            <div className={wide ? "grid gap-4 sm:grid-cols-2" : "space-y-6"}>
              {Array.from({ length: wide ? 4 : recovery ? 1 : 2 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="h-4 w-24 rounded bg-slate-200" />
                  <div className="h-12 w-full rounded-xl bg-slate-200" />
                </div>
              ))}
            </div>

            {!recovery && (
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 rounded bg-slate-200" />
                <div className="h-4 w-28 rounded bg-slate-200" />
              </div>
            )}

            <div className="h-12 w-full rounded-xl bg-brand/40" />

            {!recovery && <div className="mx-auto h-4 w-48 rounded bg-slate-200" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCardSkeleton;
