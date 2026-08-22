"use client";

import React from "react";

const SkeletonBlock: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse rounded-lg bg-gray-200/70 ${className || ""}`} />
);

const PassengerCardSkeleton: React.FC = () => (
  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-5 py-3">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-9 w-9 rounded-lg" />
        <div className="space-y-1.5">
          <SkeletonBlock className="h-3.5 w-24" />
          <SkeletonBlock className="h-3 w-20" />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <SkeletonBlock className="h-3 w-16" />
          <SkeletonBlock className="h-12 w-full" />
        </div>
      ))}
    </div>
  </div>
);

const BookingPageSkeleton: React.FC = () => {
  return (
    <div className="py-5 sm:py-8 lg:py-10" aria-busy="true" aria-label="Loading booking form">
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><SkeletonBlock className="h-10 w-32 rounded-xl" /><div className="space-y-2"><SkeletonBlock className="h-5 w-52" /><SkeletonBlock className="h-3 w-72 max-w-full" /></div></div><SkeletonBlock className="mt-4 h-11 w-full rounded-xl" /></div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <div className="space-y-5 lg:col-span-8">
          <PassengerCardSkeleton />
          <PassengerCardSkeleton />
          <PassengerCardSkeleton />
        </div>

        <aside className="space-y-4 lg:col-span-4 lg:sticky lg:top-20">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <SkeletonBlock className="mb-3 h-3 w-20" />
            <div className="flex items-center gap-4">
              <SkeletonBlock className="h-10 w-14" />
              <SkeletonBlock className="h-10 w-36" />
              <SkeletonBlock className="h-10 w-14" />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex gap-2 border-b border-gray-100 pb-3">
              <SkeletonBlock className="h-5 w-24" />
              <SkeletonBlock className="h-5 w-32" />
            </div>
            <div className="mt-4 space-y-3">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-3/4" />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <SkeletonBlock className="mb-2 h-3 w-24" />
            <SkeletonBlock className="mb-4 h-7 w-40" />
            <SkeletonBlock className="h-12 w-full rounded-xl" />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BookingPageSkeleton;
