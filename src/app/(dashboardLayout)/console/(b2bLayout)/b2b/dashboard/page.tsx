"use client";

import { PaymentHistory, SalesSummery } from "../_components/Dashboard";

const Dashboard = () => {
  return (
    <div className="px-4 sm:px-6 py-10">
      <SalesSummery />
      <PaymentHistory />
    </div>
  );
};

export default Dashboard;
