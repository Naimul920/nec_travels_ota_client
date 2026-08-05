"use client";

import React, { useMemo, useState } from "react";
import { Calendar } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  FiEye,
  FiArrowUp,
  FiArrowDown,
  FiClock,
} from "react-icons/fi";

const pnrData = [
  { pnr: "PNR001", amount: 85000, color: "bg-emerald-50 text-emerald-700" },
  { pnr: "PNR002", amount: 45000, color: "bg-rose-50 text-rose-600" },
  { pnr: "PNR003", amount: 25000, color: "bg-blue-50 text-blue-600" },
  { pnr: "PNR004", amount: 120000, color: "bg-violet-50 text-violet-600" },
];

const PaymentHistory: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const balanceInfo = useMemo(
    () => [
      {
        label: "Balance",
        value: "BDT 45,798.91",
        color: "text-gray-900",
        icon: <FiMenuIcon type="balance" />,
      },
      {
        label: "Due",
        value: "BDT 45,798.91",
        color: "text-rose-600",
        icon: <FiMenuIcon type="due" />,
      },
      {
        label: "Last Payment",
        value: "BDT 45,798.91",
        color: "text-emerald-600",
        icon: <FiMenuIcon type="paid" />,
      },
    ],
    [],
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* LEFT : PAYMENT SUMMARY */}
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Payment History</h2>

        {balanceInfo.map((info) => (
          <div
            key={info.label}
            className="rounded-xl border border-gray-100 bg-gray-50 p-4"
          >
            <div className="flex items-center gap-2">
              {info.icon}
              <p className="font-semibold text-gray-700">{info.label}</p>
            </div>
            <p className={`mt-2 text-xl font-bold ${info.color}`}>
              {info.value}
            </p>
          </div>
        ))}
      </div>

      {/* MIDDLE : CALENDAR */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-center text-lg font-bold text-gray-900">
          Event Calendar
        </h2>
        <Calendar
          className="custom-calender"
          fullscreen={false}
          value={selectedDate}
          onSelect={(date) => setSelectedDate(date)}
        />
      </div>

      {/* RIGHT : DATE WISE PNR */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-4 border-b border-gray-100 pb-3">
          <h2 className="text-sm font-semibold text-gray-400">
            PNR on selected date
          </h2>
          <p className="text-lg font-bold text-gray-900">
            {selectedDate.format("DD MMMM, YYYY")}
          </p>
        </div>

        <div className="space-y-3">
          {pnrData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${item.color}`}
                >
                  {item.pnr.slice(-3)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {item.pnr}
                  </p>
                  <p className="text-xs text-gray-400">
                    BDT {item.amount.toLocaleString()}
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                <FiEye />
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FiMenuIcon = ({ type }: { type: string }) => {
  const common = "mr-1 h-4 w-4";
  if (type === "due") return <FiArrowDown className={`${common} text-rose-500`} />;
  if (type === "paid")
    return <FiArrowUp className={`${common} text-emerald-500`} />;
  return <FiClock className={`${common} text-gray-500`} />;
};

export default PaymentHistory;