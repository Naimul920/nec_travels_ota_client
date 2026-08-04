import React from "react";

interface SignUpSkeletonProps {
  variant?: "b2c" | "b2b";
}

function FieldBlock() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-24 rounded bg-slate-200" />
      <div className="h-12 w-full rounded-xl bg-slate-200" />
    </div>
  );
}

const SignUpSkeleton: React.FC<SignUpSkeletonProps> = ({ variant = "b2c" }) => {
  if (variant === "b2b") {
    return (
      <div className="mx-auto w-full max-w-4xl animate-pulse space-y-8 p-4">
        {/* Stepper placeholder */}
        <div className="mb-10">
          <div className="relative flex justify-between">
            <div className="absolute left-5.5 right-5.5 top-5 h-0.5 rounded-full bg-slate-200" />
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative z-10 flex flex-col items-center"
              >
                <div className="h-11 w-11 rounded-2xl bg-slate-200" />
                <div className="mt-2 h-3 w-16 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid gap-5 md:grid-cols-2">
            <FieldBlock />
            <FieldBlock />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <FieldBlock />
            <FieldBlock />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <FieldBlock />
            <FieldBlock />
          </div>

          <div className="flex items-center justify-between">
            <div className="h-10 w-20 rounded-xl bg-slate-200" />
            <div className="h-10 w-44 rounded-xl bg-brand/40" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg animate-pulse space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-44 rounded bg-slate-200" />
        <div className="h-4 w-64 rounded bg-slate-200" />
      </div>

      {/* Account type tabs placeholder */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 p-2">
        <div className="flex h-14 flex-1 items-center gap-3 rounded-xl bg-slate-100 px-4">
          <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="h-3.5 w-28 rounded bg-slate-200" />
            <div className="h-3 w-20 rounded bg-slate-200" />
          </div>
        </div>
        <div className="flex h-14 flex-1 items-center gap-3 rounded-xl bg-slate-100 px-4">
          <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="h-3.5 w-24 rounded bg-slate-200" />
            <div className="h-3 w-16 rounded bg-slate-200" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FieldBlock />
        <FieldBlock />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <FieldBlock />
        <FieldBlock />
      </div>

      <div className="h-12 w-full rounded-xl bg-brand/40" />
    </div>
  );
};

export default SignUpSkeleton;
