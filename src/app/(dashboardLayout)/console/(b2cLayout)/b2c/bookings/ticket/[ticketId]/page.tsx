import React from "react";
import TicketPageClient from "@/components/common/ETicket/TicketPageClient";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;

  return (
    <TicketPageClient ticketId={ticketId} backLink="/console/b2c/bookings" />
  );
}