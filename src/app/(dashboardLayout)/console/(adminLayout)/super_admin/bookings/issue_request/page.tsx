import BookingsTable from "../../../../(b2bLayout)/b2b/_components/AirTickets/BookingsTable";

function IssueRequestPage() {
  return (
    <BookingsTable
      status="ISSUE_PENDING"
      title="Issue Request"
      admin
      ticketIssueSource
    />
  );
}

export default IssueRequestPage;