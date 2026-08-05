import clsx from "clsx";
import React from "react";

interface SalesSummaryCardProps {
  iconBg?: string;
  icon: React.ReactNode;
  total: number | string;
  title: string;
  summary: string;
  summaryColor?: string;
}

const SalesSummaryCard: React.FC<SalesSummaryCardProps> = ({
  iconBg = "bg-primary",
  icon,
  total,
  title,
  summary,
  summaryColor = "text-emerald-600",
}) => {
  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div
          className={clsx(
            "flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-300 group-hover:scale-105",
            iconBg,
          )}
        >
          {icon}
        </div>
        <span
          className={clsx(
            "inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium",
            summaryColor,
          )}
        >
          {summary}
        </span>
      </div>

      <div className="mt-5">
        <h2 className="text-2xl font-bold leading-none text-gray-900">
          {total}
        </h2>
        <p className="mt-1 text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );
};

export default SalesSummaryCard;