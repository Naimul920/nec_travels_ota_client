"use client";

import React from "react";

interface Props { cardCount?: number }

const Bone = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
);

const FlightSearchSkeleton: React.FC<Props> = ({ cardCount = 3 }) => (
  <div aria-busy="true" aria-label="Searching for available flights">
    <div className="mb-4 flex min-h-16 items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="space-y-2"><Bone className="h-2.5 w-24" /><Bone className="h-4 w-40" /></div>
      <div className="flex items-center gap-3"><Bone className="h-8 w-24 rounded-full" /><Bone className="hidden h-3 w-28 sm:block" /></div>
    </div>

    <div className="grid grid-cols-12 gap-5">
      <aside className="col-span-3 hidden lg:block">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="space-y-2 border-b border-slate-100 p-4"><Bone className="h-2.5 w-24" /><Bone className="h-5 w-28" /></div>
          {[0, 1, 2, 3, 4].map((section) => (
            <div key={section} className="space-y-3 border-b border-slate-100 p-4 last:border-0">
              <Bone className="h-3 w-24" />
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2"><Bone className="h-4 w-4 rounded" /><Bone className="h-3 w-20" /></div>
                  <Bone className="h-3 w-14" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </aside>

      <section className="col-span-12 min-w-0 lg:col-span-9">
        <div className="mb-3 flex gap-2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="flex h-14 min-w-40 items-center gap-3 rounded-xl border border-slate-200 px-3">
              <Bone className="h-9 w-9 shrink-0" /><div className="space-y-2"><Bone className="h-3 w-20" /><Bone className="h-2.5 w-24" /></div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {Array.from({ length: cardCount }).map((_, card) => (
            <div key={card} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 grid grid-cols-12 items-center gap-2 md:col-span-9 md:border-r md:border-dashed md:border-slate-200 md:pr-5">
                  <div className="col-span-2 flex flex-col items-center gap-2 md:col-span-1"><Bone className="h-11 w-11 rounded-xl" /><Bone className="h-2.5 w-14" /></div>
                  <div className="col-span-3 space-y-2 md:col-span-2"><Bone className="h-6 w-20" /><Bone className="h-3 w-24" /></div>
                  <div className="col-span-4 flex flex-col items-center gap-2 md:col-span-7"><Bone className="h-3 w-14" /><Bone className="h-3 w-20" /><Bone className="h-px w-full rounded-none" /></div>
                  <div className="col-span-3 flex flex-col items-end gap-2 md:col-span-2"><Bone className="h-6 w-20" /><Bone className="h-3 w-24" /></div>
                </div>
                <div className="col-span-3 hidden flex-col items-center justify-center gap-3 md:flex"><Bone className="h-6 w-28 rounded-full" /><Bone className="h-5 w-24" /><Bone className="h-10 w-32 rounded-xl" /></div>
                <div className="col-span-12 mt-2 flex items-center justify-between border-t border-slate-100 pt-4 md:hidden"><Bone className="h-10 w-24 rounded-xl" /><Bone className="h-5 w-24" /><Bone className="h-10 w-24 rounded-xl" /></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
);

export default FlightSearchSkeleton;
