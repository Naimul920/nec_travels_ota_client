import BookingsTable from "../../_components/AirTickets/BookingsTable";

function B2bAddSsrPage() {
  return (
    <BookingsTable
      status={["SSR", "SSR_PENDING"]}
      title="Add SSR Service"
      bookingSource="B2B"
    />
  );
}

export default B2bAddSsrPage;