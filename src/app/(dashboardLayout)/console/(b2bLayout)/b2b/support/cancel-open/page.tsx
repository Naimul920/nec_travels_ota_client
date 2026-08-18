import BookingsTable from "../../_components/AirTickets/BookingsTable";

function B2bCancelOpenPage() {
  return (
    <BookingsTable
      status="CANCELLED"
      title="Cancel Open"
      bookingSource="B2B"
    />
  );
}

export default B2bCancelOpenPage;