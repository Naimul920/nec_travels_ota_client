import clsx from "clsx";
import React from "react";

interface SalesSummaryCardProps {
  bgColor?: string;
  iconBg?: string;
  icon: React.ReactNode;
  total: number | string;
  title: string;
  summary: string;
  summaryColor?: string;
}

const SalesSummaryCard: React.FC<SalesSummaryCardProps> = ({
  bgColor = "bg-red-100",
  iconBg = "bg-red-500",
  icon,
  total,
  title,
  summary,
  summaryColor = "text-green-600",
}) => {
  return (
    <article className={clsx("relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4", bgColor)}>
      <span className={clsx("absolute inset-y-0 left-0 w-1", iconBg)} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-[#12233D]">{total}</p>
        </div>
        <span className={clsx("flex h-9 w-9 items-center justify-center rounded-lg text-white", iconBg)}>{icon}</span>
      </div>
      <p className={clsx("mt-3 border-t border-dashed border-slate-200 pt-2 text-[11px] font-semibold", summaryColor)}>{summary}</p>
    </article>
  );
};

export default SalesSummaryCard;
