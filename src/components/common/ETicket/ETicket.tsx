"use client";

import dayjs from "dayjs";
import type { BookingItem } from "@/actions/booking.action";

const formatDuration = (start: string, end: string) => {
  const mins = dayjs(end).diff(dayjs(start), "minute");
  if (Number.isNaN(mins) || mins < 0) return "—";
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

interface ETicketProps {
  booking: BookingItem;
}

export default function ETicket({ booking }: ETicketProps) {
  const currency = booking.currency?.symbol ?? "";
  const total = Number(booking.booking_fare?.total_amount || 0);
  const passengerCount = booking.booking_passengers?.length ?? 0;

  return (
    <div className="mx-auto w-full max-w-2xl bg-white p-6 text-[#12233D]">
      <h2 className="mb-4 text-center text-xl font-bold">E-Ticket</h2>

      <div className="mb-4 flex items-center justify-between border-b border-[#12233D]/10 pb-3 text-sm">
        <div>
          <p><span className="font-semibold">Booking ID:</span> {booking.booking_reference}</p>
          <p><span className="font-semibold">Issue Date:</span> {dayjs(booking.created_at).format("DD MMM, YYYY")}</p>
        </div>
        <div className="text-right">
          <p>
            <span className="font-semibold">Reservation PNR:</span>{" "}
            <span className="text-green-700">
              {booking.gds_pnr || booking.provider_booking_id || "—"}
            </span>
          </p>
          <p className="capitalize">{booking.status.toLowerCase()}</p>
        </div>
      </div>

      {/* Passenger details: booking_passengers is currently typed unknown[] —
          only a count is safely available until this is typed/populated server-side */}
      <div className="mb-4">
        <div className="bg-[#0F5C3F] px-3 py-1.5 text-sm font-semibold text-white">
          Passenger Details ({String(passengerCount).padStart(2, "0")})
        </div>
        <table className="w-full border border-t-0 border-[#12233D]/10 text-sm">
          <thead>
            <tr className="border-b border-[#12233D]/10 bg-[#F7F4EC] text-left">
              <th className="px-3 py-2">Passenger</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Ticket No</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: passengerCount }).map((_, i) => (
              <tr key={i} className="border-b border-[#12233D]/10 last:border-0">
                <td className="px-3 py-2">{i === 0 ? "Passenger" : "Co Passenger"}</td>
                <td className="px-3 py-2">—</td>
                <td className="px-3 py-2">—</td>
                <td className="px-3 py-2">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-4">
        <div className="bg-[#0F5C3F] px-3 py-1.5 text-sm font-semibold text-white">
          Flight Details
        </div>
        {booking.booking_segments.map((seg, i) => (
          <div key={i} className="border border-t-0 border-[#12233D]/10">
            <div className="bg-[#F7F4EC] px-3 py-1.5 text-sm font-semibold">
              {seg.origin_airport_code} → {seg.destination_airport_code}
            </div>
            <div className="px-3 py-1.5 text-sm font-medium">
              {seg.airline} | Flight No - {seg.flight_number}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-[#12233D]/10 bg-white text-left">
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Flight Info</th>
                  <th className="px-3 py-2">Flight Time</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#12233D]/10">
                  <td className="px-3 py-2">{dayjs(seg.departure_at).format("DD MMM, YYYY")}</td>
                  <td className="px-3 py-2">{dayjs(seg.departure_at).format("HH:mm")}</td>
                  <td className="px-3 py-2">Departs: {seg.origin_airport_code}</td>
                  <td rowSpan={2} className="px-3 py-2 align-middle">
                    {formatDuration(seg.departure_at, seg.arrival_at)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2">{dayjs(seg.arrival_at).format("DD MMM, YYYY")}</td>
                  <td className="px-3 py-2">{dayjs(seg.arrival_at).format("HH:mm")}</td>
                  <td className="px-3 py-2">Arrival: {seg.destination_airport_code}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="text-right text-sm font-semibold">
        Total Amount: {currency}
        {total.toLocaleString()}
      </div>
    </div>
  );
}