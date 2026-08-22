"use client";

import { useState } from "react";
import { Calendar, ConfigProvider } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { FiArrowUpRight, FiCalendar, FiCreditCard, FiEye } from "react-icons/fi";
import { useAuthStore } from "@/store/auth.store";

const bookings = ["NY4K8P", "BL7D2Q", "RT9M3A"];

export default function PaymentHistory() {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const { user } = useAuthStore();
  const currency = user?.currency || "BDT";
  const balance = user?.balance ?? 0;

  const amounts = [
    { label: "Available balance", value: balance, icon: FiCreditCard, tone: "bg-[#12233D] text-white" },
    { label: "Outstanding due", value: 45798.91, icon: FiArrowUpRight, tone: "bg-rose-50 text-rose-700" },
    { label: "Last payment", value: 45798.91, icon: FiCalendar, tone: "bg-emerald-50 text-emerald-700" },
  ] as const;

  return (
    <section aria-labelledby="account-activity-heading" className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
      <div className="mb-4 flex items-end justify-between gap-4 border-b border-dashed border-slate-200 pb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">Operations board</p>
          <h2 id="account-activity-heading" className="mt-1 text-base font-bold text-[#12233D]">Payments and departures</h2>
        </div>
        <span className="hidden rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] font-bold text-slate-500 sm:inline">LOCAL / DAC</span>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <article className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 xl:col-span-12">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-bold text-[#12233D]">Financial position</h3>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Updated today</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {amounts.map(({ label, value, icon: Icon, tone }) => (
              <div key={label} className={`rounded-xl p-3.5 ${tone}`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold opacity-75">{label}</p>
                  <Icon aria-hidden="true" />
                </div>
                <p className="mt-2 font-mono text-lg font-bold tracking-tight">
                  {currency} {value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 xl:col-span-7">
          <div className="mb-2 flex items-center justify-between gap-3 px-1">
            <h3 className="text-sm font-bold text-[#12233D]">Departure calendar</h3>
            <span className="rounded-md bg-emerald-50 px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-brand">{selectedDate.format("MMM YYYY")}</span>
          </div>
          <ConfigProvider theme={{ token: { colorPrimary: "#00a550", borderRadius: 10 } }}>
            <Calendar className="custom-calender" fullscreen={false} value={selectedDate} onSelect={setSelectedDate} />
          </ConfigProvider>
        </article>

        <article className="rounded-xl border border-slate-200 bg-[#f7fafc] p-3 xl:col-span-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#12233D]">Passenger records</h3>
              <p className="mt-1 font-mono text-[11px] uppercase text-slate-500">{selectedDate.format("ddd, DD MMM YYYY")}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{bookings.length}</span>
          </div>

          <div className="mt-5 space-y-3">
            {bookings.map((pnr, index) => (
              <div key={pnr} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#12233D] font-mono text-xs font-bold text-white">{String(index + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PNR</p>
                  <p className="truncate font-mono text-sm font-bold tracking-wider text-[#12233D]">{pnr}</p>
                </div>
                <button type="button" aria-label={`View booking ${pnr}`} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                  <FiEye aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
