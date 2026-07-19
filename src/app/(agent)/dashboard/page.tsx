import { PaymentHistory, SalesSummery } from "@/components/agent/Dashboard";

const Dashboard = () => {
  return (
    <div className="px-5 md:px-0 py-5">
      <SalesSummery />
      <PaymentHistory />
    </div>
  );
};

export default Dashboard;
