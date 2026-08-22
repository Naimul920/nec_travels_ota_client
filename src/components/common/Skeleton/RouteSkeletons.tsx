const Bone = ({ className = "" }: { className?: string }) => (
  <div className={`skeleton-shimmer rounded-md ${className}`} />
);

const LoadingFrame = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="min-w-0 pb-8 pt-2 sm:pt-4" aria-busy="true" aria-label={label}>{children}</div>
);

export function TablePageSkeleton() {
  return (
    <LoadingFrame label="Loading table">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2"><Bone className="h-6 w-48" /><Bone className="h-3 w-64 max-w-full" /></div>
        <div className="flex gap-2"><Bone className="h-10 w-40" /><Bone className="h-10 w-24" /></div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="hidden grid-cols-6 gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:grid">
          {Array.from({ length: 6 }).map((_, i) => <Bone key={i} className="h-3 w-20 max-w-full" />)}
        </div>
        {Array.from({ length: 7 }).map((_, row) => (
          <div key={row} className="grid grid-cols-2 gap-4 border-b border-slate-100 px-4 py-4 last:border-0 sm:grid-cols-6">
            {Array.from({ length: 6 }).map((_, cell) => <Bone key={cell} className={`h-3 ${cell === 1 ? "w-28" : "w-16"} max-w-full`} />)}
          </div>
        ))}
        <div className="flex justify-between border-t border-slate-100 px-4 py-3"><Bone className="h-3 w-28" /><Bone className="h-8 w-36" /></div>
      </div>
    </LoadingFrame>
  );
}

export function FormPageSkeleton() {
  return (
    <LoadingFrame label="Loading form">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <div className="mb-6 space-y-2 border-b border-slate-100 pb-5"><Bone className="h-6 w-48" /><Bone className="h-3 w-72 max-w-full" /></div>
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="space-y-2"><Bone className="h-3 w-24" /><Bone className="h-11 w-full rounded-lg" /></div>)}
        </div>
        <div className="mt-6 flex justify-end gap-3"><Bone className="h-10 w-24" /><Bone className="h-10 w-32" /></div>
      </div>
    </LoadingFrame>
  );
}

export function ProfilePageSkeleton() {
  return (
    <LoadingFrame label="Loading profile">
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center"><Bone className="mx-auto h-24 w-24 rounded-full" /><Bone className="mx-auto mt-4 h-5 w-36" /><Bone className="mx-auto mt-2 h-3 w-44" /></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><Bone className="mb-6 h-6 w-40" /><div className="grid gap-5 sm:grid-cols-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="space-y-2"><Bone className="h-3 w-20" /><Bone className="h-10 w-full" /></div>)}</div></div>
      </div>
    </LoadingFrame>
  );
}

export function ContentPageSkeleton() {
  return (
    <LoadingFrame label="Loading content">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3 text-center"><Bone className="mx-auto h-3 w-28" /><Bone className="mx-auto h-9 w-2/3" /><Bone className="mx-auto h-4 w-3/4" /></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">{Array.from({ length: 4 }).map((_, section) => <div key={section} className="mb-7 space-y-3 last:mb-0"><Bone className="h-5 w-48" /><Bone className="h-3 w-full" /><Bone className="h-3 w-11/12" /><Bone className="h-3 w-4/5" /></div>)}</div>
      </div>
    </LoadingFrame>
  );
}

export function FlightBookingSkeleton() {
  return (
    <LoadingFrame label="Loading booking">
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5"><Bone className="h-5 w-44" /><div className="mt-5 grid gap-4 sm:grid-cols-2">{Array.from({ length: 4 }).map((_, j) => <div key={j} className="space-y-2"><Bone className="h-3 w-20" /><Bone className="h-11 w-full" /></div>)}</div></div>)}</div>
        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5"><Bone className="h-6 w-36" /><Bone className="mt-5 h-24 w-full" /><div className="mt-5 space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="flex justify-between"><Bone className="h-3 w-24" /><Bone className="h-3 w-20" /></div>)}</div><Bone className="mt-6 h-11 w-full" /></div>
      </div>
    </LoadingFrame>
  );
}

export function FlightSearchPageSkeleton() {
  return (
    <LoadingFrame label="Loading flight search">
      <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex gap-3 overflow-hidden">{Array.from({ length: 5 }).map((_, i) => <Bone key={i} className="h-14 min-w-36 flex-1" />)}</div><Bone className="mx-auto mt-4 h-10 w-36" /></div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[240px_1fr]"><div className="hidden rounded-2xl border border-slate-200 bg-white p-4 lg:block"><Bone className="h-5 w-24" />{Array.from({ length: 6 }).map((_, i) => <Bone key={i} className="mt-4 h-8 w-full" />)}</div><div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex justify-between gap-4"><div className="flex gap-3"><Bone className="h-11 w-11 rounded-full" /><div className="space-y-2"><Bone className="h-4 w-40" /><Bone className="h-3 w-24" /></div></div><Bone className="h-8 w-24" /></div><Bone className="mt-5 h-12 w-full" /></div>)}</div></div>
    </LoadingFrame>
  );
}

export function TicketPageSkeleton() {
  return (
    <LoadingFrame label="Loading ticket">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="flex justify-between bg-slate-50 p-5"><Bone className="h-8 w-40" /><Bone className="h-8 w-24" /></div><div className="space-y-6 p-5 sm:p-8"><div className="grid grid-cols-3 gap-4"><Bone className="h-16 w-full" /><Bone className="h-16 w-full" /><Bone className="h-16 w-full" /></div>{Array.from({ length: 4 }).map((_, i) => <div key={i} className="grid grid-cols-2 gap-4 border-t border-dashed border-slate-200 pt-5 sm:grid-cols-4">{Array.from({ length: 4 }).map((_, j) => <div key={j} className="space-y-2"><Bone className="h-2.5 w-16" /><Bone className="h-4 w-24 max-w-full" /></div>)}</div>)}</div></div>
    </LoadingFrame>
  );
}
