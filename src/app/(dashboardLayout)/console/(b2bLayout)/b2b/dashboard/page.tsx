import { PaymentHistory, SalesSummery } from "../_components/Dashboard";

export default function Dashboard() {
  return (
    <div className="min-w-0 space-y-4 pb-8 pt-2 sm:pt-4">
      <header className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand">B2B operations</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#12233D]">Agency control center</h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          Services operational
        </div>
      </header>
      <SalesSummery />
      <PaymentHistory />
    </div>
  );
}
