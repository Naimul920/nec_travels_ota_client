import dayjs from "dayjs";
import type { ReactNode } from "react";
import type { BookingItem } from "@/actions/booking.action";

interface ETicketProps {
  booking?: BookingItem;
}

// Custom interface extensions to safely type optional fields on agency/segments
interface ExtendedAgency {
  address?: string;
  mocat_no?: string;
}

interface ExtendedSegment {
  aircraft_model?: string;
  origin_terminal?: string;
}

// ---- Constants & Mappings ----
const PAX_LABEL: Record<string, string> = {
  ADT: "Adult",
  C07: "Child",
  C03: "Child",
  CNN: "Child",
  INF: "Infant",
};

const AIRLINE_NAMES: Record<string, string> = {
  GF: "Gulf Air",
  QR: "Qatar Airways",
  EK: "Emirates",
  BG: "Biman Bangladesh Airlines",
  BS: "US-Bangla Airlines",
  VQ: "NovoAir",
};

// ---- Helper Functions ----
function formatDate(iso?: string | null): string {
  return iso ? dayjs(iso).format("DD MMM, YYYY") : "-";
}

function formatTime(iso?: string | null): string {
  return iso ? dayjs(iso).format("HH:mm") : "-";
}

function formatDuration(minutes?: string | number | null): string {
  if (!minutes) return "-";
  const m = typeof minutes === "string" ? parseInt(minutes, 10) : minutes;
  if (Number.isNaN(m)) return "-";
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h}h ${min}m`;
}

function formatGender(gender?: string | null): string {
  if (!gender) return "-";
  return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
}

function resolveAirlineName(code?: string | null): string {
  if (!code) return "-";
  return AIRLINE_NAMES[code] ?? code;
}

function resolveImageSrc(src?: string | null): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("/api/v1/uploads/")) {
    return `/api/media?path=${encodeURIComponent(src)}`;
  }
  return src;
}

// ---- Sub-components ----

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="bg-[#167236] text-white font-semibold px-4 py-2 text-sm tracking-wide">
      {title}
    </div>
  );
}

function TicketHeader({ booking }: { booking: BookingItem }) {
  const { user, booking_reference, created_at } = booking;
  const agency = user?.b2b_user;
  const extendedAgency = agency as (typeof agency & ExtendedAgency) | undefined;
  const docNumber = agency?.documents?.[0]?.caab_certificate_number;

  return (
    <div>
      <div className="border-b-2 border-gray-900 pb-3 text-center">
        <h1 className="text-3xl font-extrabold tracking-wide text-gray-900">
          E - Ticket
        </h1>
      </div>

      <div className="flex justify-between items-start py-4 border-b border-gray-300">
        <div className="space-y-0.5 text-xs text-gray-700">
          <h2 className="font-bold text-lg text-gray-900 uppercase tracking-tight">
            {(agency?.agency_name as ReactNode) ?? "Agency Name"}
          </h2>
          {extendedAgency?.address && (
            <p>{extendedAgency.address as ReactNode}</p>
          )}
          {user?.phone && <p>{user.phone as ReactNode}</p>}
          {docNumber && <p>Mocat No: {docNumber as ReactNode}</p>}
          {user?.email && <p>{user.email as ReactNode}</p>}
          <p className="pt-1 font-medium">
            <span className="text-gray-500">Booking ID:</span>{" "}
            {(booking_reference as ReactNode) ?? "-"}
          </p>
          <p className="font-medium">
            <span className="text-gray-500">Issue Date:</span>{" "}
            {formatDate(created_at)}
          </p>
        </div>

        {agency?.logo_key ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={resolveImageSrc(agency.logo_key)}
            alt={agency.agency_name || "Agency Logo"}
            className="h-16 max-w-[200px] object-contain"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/assets/images/logo.png"
            alt="NEC Travels"
            className="h-16 max-w-[200px] object-contain"
          />
        )}
      </div>
    </div>
  );
}

function PassengerTable({ booking }: { booking: BookingItem }) {
  const { booking_passengers = [], booking_segments = [] } = booking;
  const count = String(booking_passengers.length).padStart(2, "0");
  const commonAirlinePnr = (booking_segments[0]?.airline_pnr as ReactNode) ?? "-";

  return (
    <div className="mt-4">
      <SectionHeader title={`Passenger Details (${count})`} />
      <div className="overflow-x-auto border-x border-b border-gray-300">
        <table className="w-full text-xs text-left text-gray-800 border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 font-semibold text-gray-900">
              <th className="px-3 py-2 border-r border-gray-300">Passenger</th>
              <th className="px-3 py-2 border-r border-gray-300">Name</th>
              <th className="px-3 py-2 border-r border-gray-300">Type</th>
              <th className="px-3 py-2 border-r border-gray-300 text-center">
                Airline PNR
              </th>
              <th className="px-3 py-2 text-[#167236]">Ticket No</th>
            </tr>
          </thead>
          <tbody>
            {booking_passengers.map((p, index) => {
              const paxType = PAX_LABEL[p.passenger_type] ?? p.passenger_type;
              const gender = formatGender(p.gender);

              return (
                <tr key={p.id ?? index} className="border-b last:border-b-0 border-gray-300">
                  <td className="px-3 py-2 border-r border-gray-300 text-[#167236] font-medium">
                    {index === 0 ? "Passenger" : "Co Passenger"}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-300 font-semibold uppercase">
                    {(p.title as ReactNode)} {(p.first_name as ReactNode)} {(p.last_name as ReactNode)}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-300">
                    {(paxType as ReactNode)} &rarr; {gender}
                  </td>
                  
                  {index === 0 && (
                    <td
                      rowSpan={booking_passengers.length}
                      className="px-3 py-2 border-r border-gray-300 text-center font-bold tracking-wider align-middle bg-gray-50/50"
                    >
                      {commonAirlinePnr}
                    </td>
                  )}

                  <td className="px-3 py-2 text-[#167236] font-semibold">
                    {(p.ticket_number as ReactNode) ?? "Pending"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FlightDetails({ booking }: { booking: BookingItem }) {
  const { booking_segments = [] } = booking;

  return (
    <div className="mt-5">
      <SectionHeader title="Flight Details" />
      <div className="space-y-4 mt-2">
        {booking_segments.map((seg, idx) => {
          const airlineCode = seg.airline_code ?? seg.airline;
          const airlineName = resolveAirlineName(airlineCode);
          const extSeg = seg as typeof seg & ExtendedSegment;

          return (
            <div key={idx} className="border border-gray-300 rounded-sm">
              <div className="bg-gray-100 px-3 py-1.5 font-bold text-gray-900 border-b border-gray-300 text-xs">
                {(seg.origin_airport_code as ReactNode)} &rarr; {(seg.destination_airport_code as ReactNode)}
              </div>

              <div className="flex items-center gap-2 px-3 py-2 text-xs border-b border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveImageSrc(
                    `/api/v1/uploads/files/images/public/airlines_logo/${airlineCode}.svg`,
                  )}
                  alt={airlineName}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <span className="font-bold text-gray-900">{airlineName}</span>
                <span className="text-gray-600">
                  | Flight No - {(seg.flight_number as ReactNode)}
                  {extSeg.aircraft_model && (
                    <> | Aircraft Model - {extSeg.aircraft_model as ReactNode}</>
                  )}
                </span>
              </div>

              <table className="w-full text-xs text-left text-gray-800 border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-300 font-semibold">
                    <th className="px-3 py-1.5 border-r border-gray-300 w-28">Date</th>
                    <th className="px-3 py-1.5 border-r border-gray-300 w-16">Time</th>
                    <th className="px-3 py-1.5 border-r border-gray-300">Flight Info</th>
                    <th className="px-3 py-1.5 border-r border-gray-300 text-center w-24">
                      Flight Time
                    </th>
                    <th className="px-3 py-1.5 border-r border-gray-300 text-center w-28">
                      Cabin
                    </th>
                    <th className="px-3 py-1.5 text-center w-28">Baggage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-3 py-2 border-r border-gray-300 font-medium">
                      {formatDate(seg.departure_at)}
                    </td>
                    <td className="px-3 py-2 border-r border-gray-300 font-medium">
                      {formatTime(seg.departure_at)}
                    </td>
                    <td className="px-3 py-2 border-r border-gray-300">
                      Departs: <span className="font-bold">{(seg.origin_airport_code as ReactNode)}</span>
                      {extSeg.origin_terminal && (
                        <div className="text-[10px] text-gray-500">
                          Terminal: {extSeg.origin_terminal as ReactNode}
                        </div>
                      )}
                    </td>
                    <td
                      rowSpan={2}
                      className="px-3 py-2 border-r border-gray-300 text-center align-middle font-medium"
                    >
                      {formatDuration(seg.duration)}
                    </td>
                    <td
                      rowSpan={2}
                      className="px-3 py-2 border-r border-gray-300 text-center align-middle font-medium"
                    >
                      {(seg.cabin as ReactNode)} {seg.booking_class ? `(${seg.booking_class})` : ""}
                    </td>
                    <td
                      rowSpan={2}
                      className="px-3 py-2 text-center align-middle font-medium"
                    >
                      {(seg.baggage as ReactNode) ?? "N/A"}
                    </td>
                  </tr>

                  <tr>
                    <td className="px-3 py-2 border-r border-gray-300 font-medium">
                      {formatDate(seg.arrival_at ?? seg.departure_at)}
                    </td>
                    <td className="px-3 py-2 border-r border-gray-300 font-medium">
                      {formatTime(seg.arrival_at)}
                    </td>
                    <td className="px-3 py-2 border-r border-gray-300">
                      Arrival: <span className="font-bold">{(seg.destination_airport_code as ReactNode)}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NoticeBoard() {
  return (
    <div className="mt-5">
      <SectionHeader title="Important Notice For Passengers" />
      <div className="p-4 text-[11px] leading-relaxed text-gray-700 space-y-2.5 border-x border-b border-gray-300 rounded-b-sm">
        <p>
          <strong className="text-gray-900">E-Ticket Notice:</strong> Carriage and other services provided by the carrier are subject to conditions of carriage which are hereby incorporated by reference. These conditions may be obtained from the issuing carrier.
        </p>
        <p>
          <strong className="text-gray-900">Passport/Visa/Health:</strong> Please ensure that you have all the required travel documents for your entire journey — i.e. valid passport &amp; necessary Visas and that you have had the recommended vaccinations / immunizations for your destination(s).
        </p>
        <p>
          <strong className="text-gray-900">Carry-on Baggage Allowance:</strong> LIMIT: 1 Carry-On bag per passenger / SIZE LIMIT: 22in x 15in x 8in (L+W+H=45 inches) / WEIGHT LIMIT: Max weight 7 kg / 15 lb.
        </p>
        <p>
          <strong className="text-gray-900">Reporting Time:</strong> Flights open for check-in 1 hour before scheduled departure time on domestic flights and 3 hours before scheduled departure time on international flights. Passengers must check-in 1 hour before flight departure. Check-in counters close 30 minutes before departure for domestic, and 90 minutes before scheduled departure for international flights.
        </p>
      </div>
    </div>
  );
}

// ---- Main Component ----
export default function ETicket({ booking }: ETicketProps) {
  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-gray-500 font-medium">
        Ticket not found.
      </div>
    );
  }

  const { gds_pnr, status } = booking;
  const isConfirmed = status === "CONFIRMED";
  const isHold = status === "HOLD";

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 border border-gray-300 shadow-sm p-8 print:p-0 print:border-none print:shadow-none font-sans">
      <TicketHeader booking={booking} />

      <div className="text-center py-2.5 border-b border-gray-300 bg-gray-50/70 text-sm">
        <span>
          Reservation PNR: <strong className="text-gray-900 font-bold">{(gds_pnr as ReactNode) ?? "-"}</strong>{" "}
          {isConfirmed && (
            <span className="text-[#167236] font-semibold ml-2 inline-flex items-center gap-1">
              ✓ Confirmed
            </span>
          )}
          {isHold && (
            <span className="text-amber-600 font-semibold ml-2 inline-flex items-center gap-1">
              ⏳ On Hold
            </span>
          )}
          {!isConfirmed && !isHold && (
            <span className="text-red-600 font-semibold ml-2">{(status as ReactNode)}</span>
          )}
        </span>
      </div>

      <PassengerTable booking={booking} />
      <FlightDetails booking={booking} />
      <NoticeBoard />
    </div>
  );
}