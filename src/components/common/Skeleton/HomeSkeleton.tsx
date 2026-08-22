const Bone = ({ className = "" }: { className?: string }) => (
  <div className={`skeleton-shimmer rounded-xl ${className}`} />
);

const SectionHeading = () => (
  <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4 text-center">
    <Bone className="h-6 w-44 rounded-full" />
    <Bone className="h-10 w-full max-w-lg" />
    <Bone className="h-4 w-full max-w-md" />
  </div>
);

const VideoSkeleton = () => (
  <div className="relative h-[320px] overflow-hidden bg-[#071827] sm:h-[380px] lg:h-[460px]">
    {/* Slow cinematic light sweep instead of a flat full-frame shimmer. */}
    <div className="skeleton-shimmer absolute inset-y-0 left-[-25%] w-[70%] skew-x-[-12deg] opacity-15" />

    {/* Abstract landscape layers match the movement and depth of the video. */}
    <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#06111d] via-[#0d3b35]/80 to-transparent" />
    <div className="absolute -bottom-20 -left-[10%] h-56 w-[65%] rotate-3 rounded-[50%] bg-emerald-950/80 blur-sm sm:h-72" />
    <div className="absolute -bottom-24 -right-[12%] h-64 w-[72%] -rotate-3 rounded-[50%] bg-[#164e49]/60 blur-md sm:h-80" />
    <div className="absolute left-[12%] top-[22%] h-24 w-24 rounded-full bg-brand/10 blur-2xl sm:h-36 sm:w-36" />
    <div className="absolute right-[14%] top-[18%] h-32 w-32 rounded-full bg-sky-300/10 blur-3xl sm:h-44 sm:w-44" />

    {/* Minimal media indicator makes the state feel intentional and branded. */}
    <div className="absolute left-1/2 top-[42%] flex -translate-x-1/2 flex-col items-center gap-4">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur sm:h-16 sm:w-16">
        <span className="absolute inset-2 animate-pulse rounded-full border border-brand/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-brand shadow-[0_0_18px_rgba(0,165,80,0.8)]" />
      </div>
      <div className="flex items-center gap-2">
        <Bone className="h-1.5 w-12 bg-white/15" />
        <Bone className="h-1.5 w-5 bg-brand/35" />
        <Bone className="h-1.5 w-12 bg-white/15" />
      </div>
    </div>

    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
  </div>
);

export default function HomeSkeleton() {
  return (
    <div className="overflow-hidden bg-white" aria-busy="true" aria-label="Loading homepage">
      <section className="relative pb-14 sm:pb-18 lg:pb-24">
        <VideoSkeleton />
        <div className="relative z-10 mx-auto -mt-20 max-w-7xl px-4 sm:-mt-24 sm:px-6 lg:-mt-32 lg:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_-24px_rgba(15,35,61,0.35)]">
            <div className="mb-5 flex gap-2 overflow-hidden">
              {Array.from({ length: 6 }).map((_, index) => (
                <Bone key={index} className="h-10 w-24 shrink-0 rounded-full" />
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="space-y-3 rounded-xl border border-slate-200 p-4">
                  <Bone className="h-3 w-16" />
                  <Bone className="h-6 w-24" />
                  <Bone className="h-3 w-28" />
                </div>
              ))}
            </div>
            <Bone className="mx-auto mt-5 h-12 w-40" />
          </div>
        </div>
      </section>

      <section className="border-y border-emerald-950/5 bg-[#f4faf7] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 grid gap-4 lg:grid-cols-2">
            <div className="space-y-4"><Bone className="h-5 w-44" /><Bone className="h-12 max-w-xl" /></div>
            <div className="space-y-3 lg:justify-self-end"><Bone className="h-4 w-80 max-w-full" /><Bone className="h-4 w-64 max-w-full" /></div>
          </div>
          <div className="grid gap-10 rounded-[32px] border border-slate-200 bg-white p-6 lg:grid-cols-2 lg:p-12">
            <div className="space-y-5"><Bone className="h-5 w-40" /><Bone className="h-24 w-full" /><Bone className="h-4 w-full" /><Bone className="h-4 w-4/5" /><Bone className="h-12 w-36" /></div>
            <Bone className="mx-auto h-[340px] w-full max-w-[310px] rounded-3xl" />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading />
          <Bone className="mx-auto mb-10 h-12 max-w-2xl rounded-full" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => <Bone key={index} className="h-[380px]" />)}
          </div>
        </div>
      </section>

      <section className="border-t border-emerald-950/5 bg-[#f4faf7] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading />
          <div className="flex items-center justify-center gap-4 overflow-hidden py-4">
            <Bone className="hidden h-[320px] w-56 sm:block" />
            <Bone className="h-[420px] w-[280px] shrink-0 sm:w-[320px]" />
            <Bone className="hidden h-[320px] w-56 sm:block" />
          </div>
          <Bone className="mx-auto mt-14 h-52 max-w-6xl rounded-[28px]" />
        </div>
      </section>
    </div>
  );
}
