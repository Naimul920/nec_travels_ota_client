import BookingsTable from "../../../../(b2bLayout)/b2b/_components/AirTickets/BookingsTable";

function page() {
  return (
    <BookingsTable
      status="APPROVED"
      title="Issued Tickets"
      admin
      ticketIssueSource
      ticketIssueStatus="APPROVED"
    />
  );
}

export default page;
