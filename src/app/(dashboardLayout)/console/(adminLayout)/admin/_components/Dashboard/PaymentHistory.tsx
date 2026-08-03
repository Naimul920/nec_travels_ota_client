"use client";

import React, { useState } from "react";
import { Calendar } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { FiEye } from "react-icons/fi";

const PaymentHistory: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT : PAYMENT SUMMARY */}
        <div className="border border-primary bg-white rounded-xl p-4 space-y-4">
          <h2 className="text-center text-xl font-bold text-primary">
            Payment History
          </h2>

          <div>
            <p className="font-semibold text-gray-700">Balance</p>
            <div className="bg-gray-600 text-white font-bold py-3 rounded-md text-center">
              BDT 45,798.91
            </div>
          </div>

          <div>
            <p className="font-semibold text-red-600">Due</p>
            <div className="bg-red-600 text-white font-bold py-3 rounded-md text-center">
              BDT 45,798.91
            </div>
          </div>

          <div>
            <p className="font-semibold text-green-600">Last Payment</p>
            <div className="bg-green-600 text-white font-bold py-3 rounded-md text-center">
              BDT 45,798.91
            </div>
          </div>
        </div>

        {/* MIDDLE : ALWAYS OPEN CALENDAR */}
        <div className="border bg-white border-green-500 rounded-xl p-3">
          <h2 className="text-center text-xl font-bold text-green-600 mb-2">
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
        <div className="border border-green-500 bg-white rounded-xl p-4">
          <h2 className="text-center text-xl font-bold text-green-600 mb-3">
            {selectedDate.format("DD/MM/YYYY")}
          </h2>

          <div className="space-y-3">
            {[1, 2, 3, 4].map((_, index) => (
              <div
                key={index}
                className="bg-green-100 p-3 rounded-lg flex items-center justify-between"
              >
                <p className="font-medium">PNR</p>
                <button className="flex items-center gap-1 hover:text-primary">
                  <FiEye />
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
