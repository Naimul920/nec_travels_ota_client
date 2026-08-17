"use client";

import React from "react";

const Bone: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`skeleton-shimmer rounded-md ${className}`} />
);

const SearchPanel = () => (
  <div className="rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_20px_60px_rgba(15,35,61,0.15)] md:p-4">
    {/* Tab pills */}
    <div className="mb-4 flex gap-2 overflow-hidden">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Bone
          key={i}
          className={`h-9 shrink-0 rounded-full ${
            i === 0 ? "w-24 bg-slate-700" : "w-20"
          }`}
        />
      ))}
    </div>

    {/* Trip type radios */}
    <div className="mb-3 flex items-center gap-5 px-1">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full border-2 border-gray-300 bg-white" />
          <Bone className="h-3 w-14" />
        </div>
      ))}
    </div>

    {/* Search form fields */}
    <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
      <div className="grid gap-3 sm:grid-cols-2 md:col-span-2">
        <div className="space-y-2 rounded-md border border-slate-200 bg-white p-3">
          <Bone className="h-2.5 w-16" />
          <Bone className="h-5 w-24" />
          <Bone className="h-2 w-28" />
        </div>
        <div className="hidden space-y-2 rounded-md border border-slate-200 bg-white p-3 sm:block">
          <Bone className="h-2.5 w-16" />
          <Bone className="h-5 w-24" />
          <Bone className="h-2 w-28" />
        </div>
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

    {/* Search button */}
    <div className="mt-6 flex justify-center">
      <Bone className="h-11 w-40 rounded-lg bg-slate-700" />
    </div>
  </div>
);

const CardGrid: React.FC<{ cards?: number; imageH?: string }> = ({
  cards = 4,
  imageH = "h-36",
}) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: cards }).map((_, i) => (
      <div
        key={i}
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      >
        <Bone className={`w-full ${imageH} !rounded-none`} />
        <div className="space-y-2 p-4">
          <Bone className="h-4 w-3/4" />
          <Bone className="h-3 w-1/2" />
          <Bone className="h-3 w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

const AppSkeleton = () => {
  return (
    <div aria-busy="true" aria-label="Loading">
      {/* Hero video placeholder */}
      <div className="relative h-70 w-full overflow-hidden bg-gray-900 md:h-96">
        <div className="skeleton-shimmer absolute inset-0 opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white/40" />

        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-300" />
          </div>
          <div className="space-y-2">
            <Bone className="h-3 w-44 bg-white/40" />
            <Bone className="h-3 w-28 bg-white/30" />
          </div>
        </div>
      </div>

      {/* Floating search panel */}
      <div className="relative z-10 mx-auto -mt-20 max-w-7xl px-2 sm:px-4 md:-mt-32">
        <SearchPanel />
      </div>

      {/* Content sections */}
      <div className="mx-auto max-w-7xl space-y-10 px-2 py-10 sm:px-4">
        <section className="space-y-4">
          <Bone className="h-6 w-48" />
          <Bone className="h-3 w-64" />
          <CardGrid cards={4} />
        </section>

        <section className="space-y-4">
          <Bone className="h-6 w-56" />
          <CardGrid cards={3} imageH="h-44" />
        </section>

        <section className="space-y-4">
          <Bone className="h-6 w-52" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="space-y-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
              >
                <Bone className="h-14 w-full !rounded-none" />
                <Bone className="h-3 w-20" />
                <Bone className="h-3 w-16" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AppSkeleton;