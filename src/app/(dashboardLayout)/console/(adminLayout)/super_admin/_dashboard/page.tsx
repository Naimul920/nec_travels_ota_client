"use client";

import { PaymentHistory, SalesSummery } from "../_components/Dashboard";

const Dashboard = () => {
  return (
    <div className="px-2 sm:px-4">
      <SalesSummery />
      <PaymentHistory />
    </div>
  );
};

export default Dashboard;
