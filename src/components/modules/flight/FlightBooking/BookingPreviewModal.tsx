"use client";

import React from "react";
import { Modal } from "antd";
import type { Itinerary, PassengerFare } from "@/interface/flight";
import type { BookingFormValues } from "@/interface";
import {
  getLegs,
  getPriceSummary,
  formatTime,
  formatDate,
  stopLabel,
  TYPE_LABEL,
} from "./bookingSummary.util";

interface Props {
  open: boolean;
  onClose: () => void;
  itinerary: Itinerary;
  values: BookingFormValues;
}

const LegHeader: React.FC<{ index: number }> = ({ index }) => (
  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
    {index === 0 ? "Departure" : `Leg ${index + 1}`}
  </div>
);

const PassengerPreview: React.FC<{
  title: string;
  name: string;
  detail: string;
  index: number;
}> = ({ title, name, detail, index }) => (
  <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2">
    <div className="flex items-center gap-2">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
        {index + 1}
      </span>
      <div>
        <p className="text-sm font-semibold text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">{detail}</p>
      </div>
    </div>
    <span className="text-[11px] font-semibold uppercase tracking-wide text-brand">
      {title}
    </span>
  </div>
);

const TYPE_ORDER = ["adult", "child", "kid", "infant"] as const;

const TYPE_LABELS: Record<string, string> = {
  adult: "Adult",
  child: "Child",
  kid: "Kid",
  infant: "Infant",
};

const BookingPreviewModal: React.FC<Props> = ({
  open,
  onClose,
  itinerary,
  values,
}) => {
  const legs = getLegs(itinerary);
  const price = getPriceSummary(itinerary);
  const fareBreakdown = (itinerary.passengerFareBreakDown ?? []).filter(
    (p) => (p.passengerNumber ?? 0) > 0,
  );

  const allTravelers = TYPE_ORDER.flatMap((type) =>
    (values[type] ?? []).map((p) => ({
      type,
      name: `${p.title} ${p.firstname} ${p.lastname}`.trim(),
      detail: `${p.gender || "--"} · ${p.date_of_birth || "--"} · ${
        p.passport_number || "--"
      }`,
    })),
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      title={
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand" />
          <span className="text-base font-bold text-gray-900">
            Booking Preview
          </span>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Flight legs */}
        <div className="space-y-2">
          {legs.map((leg, i) => (
            <div key={i}>
              <LegHeader index={i} />
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">
                    {leg.flightName || `${leg.carrierCode} ${leg.flightNumber}`}
                  </span>
                  <span>
                    {stopLabel(leg.stops)} · {leg.duration}
                  </span>
                </div>
                {leg.baggage && (
                  <p className="mb-2 text-[11px] text-gray-500">
                    Baggage:{" "}
                    <span className="font-semibold text-gray-700">
                      {leg.baggage}
                    </span>
                  </p>
                )}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div className="text-left">
                    <p className="text-lg font-extrabold text-gray-900">
                      {leg.fromCode}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(leg.departISO)}
                    </p>
                    <p className="text-sm font-semibold text-brand">
                      {formatTime(leg.departISO)}
                    </p>
                  </div>
                  <div className="text-center text-[11px] text-gray-400">
                    ✈ {leg.duration}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-gray-900">
                      {leg.toCode}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(leg.arriveISO)}
                    </p>
                    <p className="text-sm font-semibold text-brand">
                      {formatTime(leg.arriveISO)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Travelers */}
        <div>
          <SectionTitle>Travelers</SectionTitle>
          <div className="space-y-2">
            {allTravelers.map((t, i) => (
              <PassengerPreview
                key={i}
                index={i}
                title={TYPE_LABELS[t.type] ?? t.type}
                name={t.name}
                detail={t.detail}
              />
            ))}
          </div>
        </div>

        {/* Fare breakdown */}
        <div>
          <SectionTitle>Fare Summary</SectionTitle>
          <div className="space-y-1 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            {fareBreakdown.map((f: PassengerFare, idx: number) => {
              const label = TYPE_LABEL[f.passengerType] ?? f.passengerType;
              const unitPrice = (f.totalFare ?? 0) + (f.totalTaxAmount ?? 0);
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm text-gray-700"
                >
                  <span>
                    {label}{" "}
                    <span className="text-gray-400">× {f.passengerNumber}</span>
                  </span>
                  <span className="font-semibold">
                    {price.currency}{" "}
                    {(unitPrice * (f.passengerNumber ?? 1)).toLocaleString()}
                  </span>
                </div>
              );
            })}
            <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-2">
              <span className="text-sm font-semibold text-gray-800">
                Total Fare
              </span>
              <span className="text-lg font-extrabold text-brand">
                {price.currency} {price.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
    {children}
  </p>
);

export default BookingPreviewModal;