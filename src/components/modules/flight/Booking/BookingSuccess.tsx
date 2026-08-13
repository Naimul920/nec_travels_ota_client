import React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import type {
  BookingPassenger,
  BookingSegment,
  FlightBookingResponseData,
  LeadPassenger,
} from "@/interface/flight";
import {
  FiCheckCircle,
  FiClock,
  FiBriefcase,
  FiHome,
  FiSearch,
} from "react-icons/fi";
import {
  MdFlight,
  MdOutlineConfirmationNumber,
  MdOutlineLocalOffer,
} from "react-icons/md";

interface Props {
  booking: FlightBookingResponseData;
  segments: BookingSegment[];
  passengers: BookingPassenger[];
  leadPassenger: LeadPassenger;
  total: number;
  currency?: string;
}

const PAX_LABELS: Record<string, string> = {
  ADT: "Adult",
  CHD: "Child / Kid",
  INF: "Infant",
};

const BookingSuccess: React.FC<Props> = ({
  booking,
  segments,
  passengers,
  leadPassenger,
  total,
  currency = "BDT",
}) => {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-10 sm:px-6">
      {/* Success banner */}
      <div className="overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white shadow-sm">
        <div className="flex flex-col items-center px-6 py-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30">
            <FiCheckCircle className="h-9 w-9" />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Booking Confirmed
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {booking.booking_reference} — your flight has been successfully
            booked and confirmed.
          </p>

          <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-3">
            {[
              { label: "PNR", value: booking.pnr },
              { label: "Booking Ref", value: booking.booking_reference },
              { label: "Booking ID", value: booking.booking_id },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-gray-200 bg-white px-2 py-3 text-center shadow-sm"
              >
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                  {item.label}
                </p>
                <p className="mt-1 truncate text-xs font-bold text-gray-800">
                  {item.value || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flight segments */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/70 px-5 py-3">
          <MdFlight className="text-primary" />
          <h2 className="text-sm font-bold text-gray-800">Flight Journey</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {segments.map((seg, i) => {
            const depTime = dayjs(seg.departure_date_time).format("HH:mm");
            const arrTime = dayjs(seg.arrival_date_time).format("HH:mm");
            const depDate = dayjs(seg.departure_date_time).format(
              "ddd DD MMM YYYY",
            );
            const arrDate = dayjs(seg.arrival_date_time).format(
              "ddd DD MMM YYYY",
            );
            return (
              <div key={i} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FiBriefcase />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {seg.carrier_code} {seg.flight_number}
                    </p>
                    <p className="text-xs text-gray-400">
                      {seg.origin} → {seg.destination}
                    </p>
                    {seg.baggage && (
                      <p className="mt-0.5 text-[11px] font-medium text-gray-500">
                        Baggage: {seg.baggage}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                  <div>
                    <p className="text-base font-bold text-gray-900">{depTime}</p>
                    <p className="text-[11px] text-gray-400">
                      {depDate} · {seg.origin}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-300">
                    <FiClock className="h-4 w-4" />
                    <span className="h-px w-8 bg-gray-200" />
                    <MdFlight className="h-3 w-3 rotate-90 text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900">{arrTime}</p>
                    <p className="text-[11px] text-gray-400">
                      {arrDate} · {seg.destination}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Passengers */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/70 px-5 py-3">
          <FiBriefcase className="text-primary" />
          <h2 className="text-sm font-bold text-gray-800">Travellers</h2>
          <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {passengers.length + 1}
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {[leadPassenger, ...passengers].map((p, i) => (
            <div key={i} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {p.title} {p.firstname} {p.lastname}
                </p>
                <p className="text-[11px] text-gray-400">
                  {p.gender}
                  {p.passenger_type
                    ? ` · ${PAX_LABELS[p.passenger_type] ?? p.passenger_type}`
                    : ""}
                </p>
              </div>
              {p.email && (
                <p className="text-xs text-gray-400">
                  {p.email} {p.phone ? `· ${p.phone}` : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Payment summary */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/70 px-5 py-3">
          <MdOutlineConfirmationNumber className="text-primary" />
          <h2 className="text-sm font-bold text-gray-800">Payment Summary</h2>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MdOutlineLocalOffer className="h-5 w-5 text-primary" />
            Payment via{" "}
            <span className="font-semibold text-gray-700">Cash</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Total amount</p>
            <p className="text-xl font-bold text-gray-900">
              {currency}{" "}
              {(total || 0).toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <FiHome /> Back to Home
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:border-gray-400"
        >
          <FiSearch /> Search Another Flight
        </Link>
      </div>
    </div>
  );
};

export default BookingSuccess;