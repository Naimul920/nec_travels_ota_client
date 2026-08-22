"use client";

import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { FaChartLine, FaMoneyBillWave, FaTicketAlt, FaUsers } from "react-icons/fa";
import { Select } from "@/components/ui";
import SalesSummaryCard from "./SalesSummeryCard";

type Period = "week" | "month" | "year";

const SUMMARY_BY_PERIOD = {
  week: [
    { title: "Bookings", total: 38, summary: "+8% vs previous week", icon: <FaTicketAlt />, bgColor: "bg-rose-50/70", iconBg: "bg-rose-500", summaryColor: "text-emerald-700" },
    { title: "Travelers", total: 74, summary: "+5% vs previous week", icon: <FaUsers />, bgColor: "bg-sky-50/70", iconBg: "bg-sky-500", summaryColor: "text-emerald-700" },
    { title: "Gross sales", total: "৳186K", summary: "+12% vs previous week", icon: <FaMoneyBillWave />, bgColor: "bg-emerald-50/70", iconBg: "bg-emerald-600", summaryColor: "text-emerald-700" },
    { title: "Conversion", total: "18.2%", summary: "-2% vs previous week", icon: <FaChartLine />, bgColor: "bg-violet-50/70", iconBg: "bg-violet-500", summaryColor: "text-rose-600" },
  ],
  month: [
    { title: "Bookings", total: 156, summary: "+11% vs previous month", icon: <FaTicketAlt />, bgColor: "bg-rose-50/70", iconBg: "bg-rose-500", summaryColor: "text-emerald-700" },
    { title: "Travelers", total: 312, summary: "+7% vs previous month", icon: <FaUsers />, bgColor: "bg-sky-50/70", iconBg: "bg-sky-500", summaryColor: "text-emerald-700" },
    { title: "Gross sales", total: "৳742K", summary: "+9% vs previous month", icon: <FaMoneyBillWave />, bgColor: "bg-emerald-50/70", iconBg: "bg-emerald-600", summaryColor: "text-emerald-700" },
    { title: "Conversion", total: "20.1%", summary: "+1.4% vs previous month", icon: <FaChartLine />, bgColor: "bg-violet-50/70", iconBg: "bg-violet-500", summaryColor: "text-emerald-700" },
  ],
  year: [
    { title: "Bookings", total: 1842, summary: "+16% vs previous year", icon: <FaTicketAlt />, bgColor: "bg-rose-50/70", iconBg: "bg-rose-500", summaryColor: "text-emerald-700" },
    { title: "Travelers", total: 3690, summary: "+13% vs previous year", icon: <FaUsers />, bgColor: "bg-sky-50/70", iconBg: "bg-sky-500", summaryColor: "text-emerald-700" },
    { title: "Gross sales", total: "৳8.9M", summary: "+18% vs previous year", icon: <FaMoneyBillWave />, bgColor: "bg-emerald-50/70", iconBg: "bg-emerald-600", summaryColor: "text-emerald-700" },
    { title: "Conversion", total: "21.4%", summary: "+2.1% vs previous year", icon: <FaChartLine />, bgColor: "bg-violet-50/70", iconBg: "bg-violet-500", summaryColor: "text-emerald-700" },
  ],
} satisfies Record<Period, Array<React.ComponentProps<typeof SalesSummaryCard>>>;

export default function SalesSummery() {
  const [period, setPeriod] = useState<Period>("month");

  return (
    <section aria-labelledby="sales-summary-heading" className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="sales-summary-heading" className="text-base font-bold text-[#12233D]">Traffic and sales</h2>
          <p className="mt-0.5 text-xs text-slate-500">Commercial performance overview</p>
        </div>
        <div className="w-full sm:w-44">
          <Select
            aria-label="Sales summary period"
            value={period}
            onChange={(event) => setPeriod(event.target.value as Period)}
            className="h-9! rounded-lg! border-slate-200! bg-white! text-xs! shadow-none!"
            options={[
              { label: "Last week", value: "week" },
              { label: "Last month", value: "month" },
              { label: "Last year", value: "year" },
            ]}
            iconRight={<IoChevronDown />}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SUMMARY_BY_PERIOD[period].map((item) => (
          <SalesSummaryCard key={item.title} {...item} bgColor="bg-white" />
        ))}
      </div>
    </section>
  );
}
