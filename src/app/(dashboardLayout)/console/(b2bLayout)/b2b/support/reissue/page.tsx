import BookingsTable from "../../_components/AirTickets/BookingsTable";

function B2bReissuePage() {
  return (
    <BookingsTable
      status={["REISSUED", "REISSUED_PENDING"]}
      title="Reissue"
      bookingSource="B2B"
      dateColumn="issued_at"
    />
  );
}

export default B2bReissuePage;