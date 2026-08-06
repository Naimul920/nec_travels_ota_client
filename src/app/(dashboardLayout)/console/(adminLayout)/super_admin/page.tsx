import { PaymentHistory, SalesSummery } from "./_components/Dashboard";

export default function SuperAdminDashboardPage() {
  return (
    <>
      {/* <HomeTabs /> */}
      <div className="px-2 sm:px-4">
      <SalesSummery />
      <PaymentHistory />
    </div>
    </>
  );
}
