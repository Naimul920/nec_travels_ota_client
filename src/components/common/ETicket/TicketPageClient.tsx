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
  const [isCancelling, setIsCancelling] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);

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

  const handleCancelBooking = () => {
    Swal.fire({
      title: "Confirm Booking Cancellation",
      text: `Are you sure you want to cancel booking (${booking?.booking_reference ?? ""})?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "Keep Booking",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsCancelling(true);
        setTimeout(() => {
          setIsCancelling(false);
          Swal.fire(
            "Booking Cancelled",
            "Your booking has been cancelled successfully.",
            "success",
          );
          loadTicket();
        }, 1000);
      }
    });
  };

  const handleIssueTicket = () => {
    Swal.fire({
      title: "Confirm Issuing Ticket",
      text: `Are you sure you want to issue the ticket for (${booking?.booking_reference ?? ""})?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0F1B47",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Issue",
      cancelButtonText: "Not Now",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsIssuing(true);
        setTimeout(() => {
          setIsIssuing(false);
          Swal.fire(
            "Ticket Issued",
            `Ticket ${booking?.booking_reference ?? ""} has been issued successfully.`,
            "success",
          );
          loadTicket();
        }, 1000);
      }
    });
  };

  if (loading) {
    return (
      <div className="p-4" aria-busy="true" aria-label="Loading ticket">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-start">
          {/* Main ticket panel */}
          <div className="min-w-0 flex-1 overflow-hidden border border-gray-300 bg-white shadow-sm">
            {/* E - Ticket header */}
            <div className="border-b-[3px] border-gray-900 pb-2 pt-4 text-center">
              <div className="skeleton-shimmer mx-auto h-7 w-40 rounded-md" />
            </div>

            {/* Agency info + logo */}
            <div className="flex items-start justify-between gap-4 px-6 py-3">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="skeleton-shimmer h-4 w-48 max-w-full rounded-sm" />
                <div className="skeleton-shimmer h-3 w-64 max-w-full rounded-sm" />
                <div className="skeleton-shimmer h-3 w-52 max-w-full rounded-sm" />
                <div className="skeleton-shimmer h-3 w-56 max-w-full rounded-sm" />
                <div className="skeleton-shimmer h-3 w-44 max-w-full rounded-sm" />
              </div>
              <div className="skeleton-shimmer h-12 w-32 shrink-0 rounded-sm" />
            </div>

            {/* PNR status bar */}
            <div className="flex items-center justify-center gap-3 border-y border-gray-300 bg-gray-50/70 py-2.5">
              <div className="skeleton-shimmer h-4 w-44 rounded-sm" />
              <div className="skeleton-shimmer h-4 w-20 rounded-full" />
            </div>

            {/* Passenger table */}
            <div className="px-6 pt-3">
              <div className="skeleton-shimmer h-6 w-full rounded-sm" />
              <div className="mt-1 overflow-hidden border border-gray-300">
                <div className="skeleton-shimmer h-7 w-full border-b border-gray-300" />
                {Array.from({ length: 2 }).map((_, r) => (
                  <div
                    key={r}
                    className="grid grid-cols-5 gap-2 border-b border-gray-200 px-2 py-2 last:border-b-0"
                  >
                    {Array.from({ length: 5 }).map((_, c) => (
                      <div
                        key={c}
                        className="skeleton-shimmer h-4 rounded-sm"
                        style={{ width: `${70 + ((c * 6) % 25)}%` }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Flight details */}
            <div className="px-6 pt-5">
              <div className="skeleton-shimmer h-6 w-full rounded-sm" />
              <div className="mt-2 space-y-3">
                {[0, 1].map((s) => (
                  <div key={s} className="overflow-hidden border border-gray-300">
                    <div className="skeleton-shimmer h-5 w-full border-b border-gray-300" />
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="skeleton-shimmer h-6 w-6 shrink-0 rounded-sm" />
                      <div className="skeleton-shimmer h-3 w-24 rounded-sm" />
                      <div className="skeleton-shimmer h-3 w-32 rounded-sm" />
                    </div>
                    <div className="grid grid-cols-4 gap-2 border-t border-gray-200 px-3 py-2">
                      <div className="skeleton-shimmer h-5 rounded-sm" />
                      <div className="skeleton-shimmer col-span-3 h-5 rounded-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fare + Notice */}
            <div className="space-y-5 px-6 py-5 pb-6">
              <div className="skeleton-shimmer h-6 w-full rounded-sm" />
              <div className="skeleton-shimmer h-28 w-full rounded-sm border border-gray-300" />
            </div>
          </div>

          {/* Toolbar sidebar */}
          <aside className="w-full shrink-0 space-y-3 rounded-md border border-gray-200 bg-white p-4 shadow-sm lg:sticky lg:top-4 lg:w-72 lg:self-start">
            <div className="skeleton-shimmer h-5 w-full rounded-sm" />
            <div className="skeleton-shimmer h-5 w-full rounded-sm" />
            <div className="space-y-2.5 border-t border-gray-200 pt-3">
              {[0, 1, 2, 3].map((b) => (
                <div key={b} className="skeleton-shimmer h-9 w-full rounded-md" />
              ))}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return null;
  }

  return (
    <div className="p-4">
      <ETicket
        booking={booking}
        onCancelBooking={handleCancelBooking}
        onIssueTicket={handleIssueTicket}
        isCancelling={isCancelling}
        isIssuing={isIssuing}
      />
    </div>
  );
}
