import BookingsTable from "../../_components/AirTickets/BookingsTable";

function IssuedTicketPage() {
  return (
    <BookingsTable
      status="ISSUED"
      title="Issued Tickets"
      bookingSource="B2B"
      dateColumn="issued_at"
    />
  );
}

export default IssuedTicketPage;