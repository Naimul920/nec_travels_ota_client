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
    <div
      className={clsx("rounded-2xl p-5 flex flex-col gap-3 shadow-sm", bgColor)}
    >
      <div
        className={clsx(
          "w-10 h-10 flex items-center justify-center rounded-full text-white",
          iconBg,
        )}
      >
        {icon}
      </div>

      <h2 className="text-2xl font-bold text-gray-900">{total}</h2>

      <p className="text-sm text-gray-600">{title}</p>

      <p className={clsx("text-sm font-medium", summaryColor)}>{summary}</p>
    </div>
  );
};

export default SalesSummaryCard;
