import React from "react";
import { getUserRole } from "@/utils/session";
import TicketPageClient from "@/components/common/ETicket/TicketPageClient";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const role = await getUserRole();
  const roleLower = (role ?? "b2c").toLowerCase();
  const backLink = `/console/${roleLower}/bookings`;

  return <TicketPageClient ticketId={ticketId} backLink={backLink} />;
}