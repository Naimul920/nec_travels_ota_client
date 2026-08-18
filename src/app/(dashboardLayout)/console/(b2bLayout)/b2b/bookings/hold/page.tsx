import BookingsTable from "../../_components/AirTickets/BookingsTable";

function B2bHoldPage() {
  return (
    <BookingsTable
      status={["HOLD", "ISSUE_PENDING"]}
      title="Hold Tickets"
      bookingSource="B2B"
    />
  );
}

export default B2bHoldPage;