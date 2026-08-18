import BookingsTable from "../../_components/AirTickets/BookingsTable";

function B2bVoidPage() {
  return (
    <BookingsTable
      status="VOID"
      title="Void Tickets"
      bookingSource="B2B"
      dateColumn="issued_at"
    />
  );
}

export default B2bVoidPage;