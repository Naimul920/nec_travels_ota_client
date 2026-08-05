"use client";

import dayjs from "dayjs";
import type { BookingItem } from "@/actions/booking.action";

interface ETicketProps {
  booking?: BookingItem;
}

export default function ETicket({ booking }: ETicketProps) {
  return (
    <>
      <div className="">
        <div className="grid  md:grid-cols-12 gap-4">
          <div className="col-span-10">
            <h1>Hello</h1>
          </div>
          <div className="col-span-2">
            <h2>World</h2>
          </div>
        </div>
      </div>
    </>
  );
}
