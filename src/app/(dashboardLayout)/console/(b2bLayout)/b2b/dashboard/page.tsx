"use client";

import { PaymentHistory, SalesSummery } from "../_components/Dashboard";

const Dashboard = () => {
  return (
    <div className="max-w-[1600px] mx-auto px-10 sm:px-20 py-10">
      <SalesSummery />
      <PaymentHistory />
    </div>
  );
};

export default Dashboard;
