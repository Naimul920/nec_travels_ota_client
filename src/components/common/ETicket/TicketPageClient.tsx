"use client";

import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getTicketAction } from "@/actions/booking.action";
import ETicket from "@/components/common/ETicket/ETicket";
import type { BookingItem } from "@/actions/booking.action";

interface TicketPageClientProps {
  ticketId: string;
  backLink: string;
}

export default function TicketPageClient({
  ticketId,
  backLink,
}: TicketPageClientProps) {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTicket = useCallback(async () => {
    setLoading(true);
    setError(null);
    const ticket = await getTicketAction(ticketId);
    if (ticket.data) {
      setBooking(ticket.data);
    } else {
      setBooking(null);
      setError(ticket.message || "Ticket not found");
      Swal.fire({
        icon: "error",
        title: ticket.statusCode === 404 ? "Booking Not Found" : "Failed to Load Ticket",
        html: `<p>${ticket.message || "The requested ticket could not be loaded."}</p><p class="mt-1 text-xs text-gray-400">Status: ${ticket.statusCode}</p>`,
        confirmButtonText: "Back to bookings",
        allowOutsideClick: false,
        customClass: {
          confirmButton: "!bg-secondary",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = backLink;
        }
      });
    }
    setLoading(false);
  }, [ticketId, backLink]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="mx-auto max-w-4xl bg-white text-gray-800 text-sm border border-gray-200 shadow-sm animate-pulse">
          <div className="border-b-2 border-gray-800 py-4 flex justify-center">
            <div className="h-8 w-48 rounded bg-gray-200" />
          </div>
          <div className="flex justify-between items-start px-6 py-5 border-b border-gray-200">
            <div className="space-y-3">
              <div className="h-5 w-40 rounded bg-gray-200" />
              <div className="h-3 w-52 rounded bg-gray-100" />
              <div className="h-3 w-44 rounded bg-gray-100" />
              <div className="h-3 w-40 rounded bg-gray-100" />
              <div className="h-3 w-36 rounded bg-gray-100" />
            </div>
            <div className="h-14 w-32 rounded bg-gray-200" />
          </div>
          <div className="flex justify-center py-3 border-b border-gray-200 bg-gray-50">
            <div className="h-4 w-56 rounded bg-gray-200" />
          </div>
          <div className="space-y-2 p-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-lg bg-gray-100"
                style={{ width: `${90 - ((i * 8) % 40)}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return null;
  }

  return (
    <div className="p-4">
      <ETicket booking={booking} />
    </div>
  );
}
