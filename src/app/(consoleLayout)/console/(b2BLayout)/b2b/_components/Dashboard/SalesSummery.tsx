import React from "react";
import { IoChevronDown } from "react-icons/io5";
import {
  FaChartLine,
  FaMoneyBillWave,
  FaTicketAlt,
  FaUsers,
} from "react-icons/fa";
import SalesSummaryCard from "./SalesSummeryCard";
import { Select } from "@/components/ui";

const salesSummaryData = [
  {
    id: 1,
    title: "Total Booking",
    total: 561,
    summary: "+8% from yesterday",
    icon: <FaTicketAlt size={18} />,
    bgColor: "bg-red-100",
    iconBg: "bg-red-500",
    summaryColor: "text-green-600",
  },
  {
    id: 2,
    title: "Total Customers",
    total: 1280,
    summary: "+5% from last week",
    icon: <FaUsers size={18} />,
    bgColor: "bg-blue-100",
    iconBg: "bg-blue-500",
    summaryColor: "text-green-600",
  },
  {
    id: 3,
    title: "Total Revenue",
    total: "৳ 2.4M",
    summary: "+12% this month",
    icon: <FaMoneyBillWave size={18} />,
    bgColor: "bg-green-100",
    iconBg: "bg-green-500",
    summaryColor: "text-green-700",
  },
  {
    id: 4,
    title: "Growth Rate",
    total: "18%",
    summary: "-2% from last month",
    icon: <FaChartLine size={18} />,
    bgColor: "bg-purple-100",
    iconBg: "bg-purple-500",
    summaryColor: "text-red-500",
  },
  {
    id: 5,
    title: "Growth Rate",
    total: "19%",
    summary: "-3% from last month",
    icon: <FaChartLine size={18} />,
    bgColor: "bg-purple-200",
    iconBg: "bg-purple-400",
    summaryColor: "text-red-400",
  },
];

const SalesSummery: React.FC = () => {
  return (
    <div className="p-5 border border-primary bg-white rounded-lg my-5">
      <div className="flex items-center justify-between">
        <h1 className="text-primary md:text-2xl line-clamp-1 text-lg font-bold">
          Sales Summery
        </h1>
        <div className="md:w-2/9">
          <Select
            className="border-primary! rounded"
            //   value={role}
            //   onChange={(e) => setRole(e.target.value)}
            options={[
              { label: "Last Week", value: "week" },
              { label: "Last Month", value: "month" },
              { label: "Last Year", value: "year" },
            ]}
            iconRight={<IoChevronDown />}
          />
        </div>
      </div>
      <div className="grid md:grid-cols-5 gap-4 mt-5">
        {salesSummaryData.map((item) => (
          <SalesSummaryCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default SalesSummery;
