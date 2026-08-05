import React from "react";
import { getTicketAction } from "@/actions/booking.action";
import ETicket from "@/components/common/ETicket/ETicket";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  // const ticket = await getTicketAction(ticketId);

  return (
    <div>
      <ETicket />
    </div>
  );
}
