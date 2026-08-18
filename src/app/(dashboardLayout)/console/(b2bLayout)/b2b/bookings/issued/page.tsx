import BookingsTable from "../../_components/AirTickets/BookingsTable";

function IssuedTicketPage() {
  return (
    <BookingsTable
      status="ISSUE"
      title="Issued Tickets"
      bookingSource="B2B"
      dateColumn="issued_at"
    />
  );
}

export default IssuedTicketPage;