import React from "react";
import { IoChevronDown } from "react-icons/io5";
import {
  FaChartLine,
  FaMoneyBillWave,
  FaTicketAlt,
  FaUsers,
  FaPlane,
} from "react-icons/fa";
import SalesSummaryCard from "./SalesSummeryCard";
import { Select } from "@/components/ui";

const salesSummaryData = [
  {
    id: 1,
    title: "Total Booking",
    total: 561,
    summary: "+8%",
    icon: <FaTicketAlt size={18} />,
    iconBg: "bg-rose-500",
    summaryColor: "text-rose-600",
  },
  {
    id: 2,
    title: "Total Customers",
    total: 1280,
    summary: "+5%",
    icon: <FaUsers size={18} />,
    iconBg: "bg-blue-500",
    summaryColor: "text-blue-600",
  },
  {
    id: 3,
    title: "Total Revenue",
    total: "৳ 2.4M",
    summary: "+12%",
    icon: <FaMoneyBillWave size={18} />,
    iconBg: "bg-primary",
    summaryColor: "text-emerald-600",
  },
  {
    id: 4,
    title: "Flights Issued",
    total: 312,
    summary: "+8%",
    icon: <FaPlane size={18} />,
    iconBg: "bg-violet-500",
    summaryColor: "text-violet-600",
  },
  {
    id: 5,
    title: "Growth Rate",
    total: "18%",
    summary: "-2%",
    icon: <FaChartLine size={18} />,
    iconBg: "bg-amber-500",
    summaryColor: "text-amber-600",
  },
];

const SalesSummery: React.FC = () => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-gray-900 md:text-xl">
            Sales Summary
          </h1>
          <p className="text-xs text-gray-400">
            Overview of your booking performance
          </p>
        </div>
        <div className="w-44">
          <Select
            iconRight={<IoChevronDown />}
            defaultValue="week"
            options={[
              { label: "Last Week", value: "week" },
              { label: "Last Month", value: "month" },
              { label: "Last Year", value: "year" },
            ]}
          />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {salesSummaryData.map((item) => (
          <SalesSummaryCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default SalesSummery;