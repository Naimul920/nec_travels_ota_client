import BookingsTable from "../../_components/AirTickets/BookingsTable";

function B2bRefundPage() {
  return (
    <BookingsTable
      status={["REFUNDED", "REFUNDED_PENDING"]}
      title="Refund Tickets"
      bookingSource="B2B"
      dateColumn="issued_at"
      applyDate
      refundAmount
    />
  );
}

export default B2bRefundPage;