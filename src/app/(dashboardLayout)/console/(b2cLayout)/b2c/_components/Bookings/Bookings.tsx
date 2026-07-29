"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSearch } from "@/hooks";
import Table from "@/components/common/Table/Table";
import holdTicketsColumns from "@/utils/tableConstant/holdTickets.constant";
import ActionButton from "@/components/common/Action/ActionButton";
import { FiClock, FiCheckCircle, FiXCircle, FiPauseCircle, FiList, FiMapPin } from "react-icons/fi";

type TabKey = "all" | "pending" | "cancel" | "hold" | "issued";
type ProductType = "Flight" | "Hotel" | "Tour" | "Gift Card";

const tabs: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "hold", label: "Hold" },
  { key: "issued", label: "Issued" },
  { key: "cancel", label: "Cancel" },
];

const productTypes: ProductType[] = ["Flight", "Hotel", "Tour", "Gift Card"];
const years = ["2026", "2025", "2024", "2023", "2022"];

const allBookingsData = [
  { key: 1, sl: 1, bookingId: "BK1001", origin: "DAC", destination: "DXB", airline: "Emirates", pnr: "PNR001", contactNo: "01711111111", amount: 85000, bookedOn: "01-12-2025", travel_date: "12-12-2025", status: "issued", productType: "Flight" as ProductType },
  { key: 2, sl: 2, bookingId: "BK1002", origin: "DAC", destination: "KUL", airline: "Malaysia Airlines", pnr: "PNR002", contactNo: "01822222222", amount: 45000, bookedOn: "02-12-2025", travel_date: "13-12-2025", status: "hold", productType: "Flight" as ProductType },
  { key: 3, sl: 3, bookingId: "BK1003", origin: "DAC", destination: "DEL", airline: "Indigo", pnr: "PNR003", contactNo: "01933333333", amount: 25000, bookedOn: "03-12-2025", travel_date: "12-12-2025", status: "cancel", productType: "Flight" as ProductType },
  { key: 4, sl: 4, bookingId: "BK1004", origin: "DAC", destination: "JED", airline: "Saudia", pnr: "PNR004", contactNo: "01644444444", amount: 95000, bookedOn: "04-12-2025", travel_date: "15-12-2025", status: "pending", productType: "Flight" as ProductType },
  { key: 5, sl: 5, bookingId: "BK1005", origin: "DAC", destination: "SIN", airline: "Singapore Airlines", pnr: "PNR005", contactNo: "01755555555", amount: 65000, bookedOn: "05-12-2025", travel_date: "14-12-2025", status: "issued", productType: "Flight" as ProductType },
  { key: 6, sl: 6, bookingId: "BK1006", origin: "DAC", destination: "KUL", airline: "Air Asia", pnr: "PNR006", contactNo: "01866666666", amount: 35000, bookedOn: "06-12-2025", travel_date: "16-12-2025", status: "pending", productType: "Flight" as ProductType },
];

const statusTitleMap: Record<TabKey, string> = {
  all: "All Bookings",
  pending: "Pending Bookings",
  cancel: "Cancelled Bookings",
  hold: "Hold Bookings",
  issued: "Issued Bookings",
};

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white px-6 py-20 text-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#DCEBF9]">
        <FiMapPin size={36} className="text-[#8FA9BE]" />
      </div>
      <h3 className="text-xl font-bold text-[#0F1B47]">No bookings yet</h3>
      <p className="text-sm text-[#6B7785]">Start your travel planning for your next adventure today</p>
      <button
        type="button"
        className="mt-2 rounded-xl bg-[#F5C518] px-8 py-3 text-sm font-bold text-[#0F1B47] transition-opacity hover:opacity-90"
      >
        Search
      </button>
    </div>
  );
}

export default function Bookings() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [selectedProductTypes, setSelectedProductTypes] = useState<ProductType[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  const toggleFilter = <T,>(value: T, list: T[], setList: (v: T[]) => void) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const resetFilters = () => {
    setSelectedProductTypes([]);
    setSelectedYears([]);
  };

  const filteredByStatus = useMemo(() => {
    let data = activeTab === "all" ? allBookingsData : allBookingsData.filter((b) => b.status === activeTab);

    if (selectedProductTypes.length) {
      data = data.filter((b) => selectedProductTypes.includes(b.productType));
    }
    if (selectedYears.length) {
      data = data.filter((b) => selectedYears.some((y) => b.travel_date.endsWith(y)));
    }
    return data;
  }, [activeTab, selectedProductTypes, selectedYears]);

  const filteredData = useSearch(filteredByStatus, searchString);
  const hasResults = !!filteredData?.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-20 px-5 sm:px-10">
      <div className="space-y-4 pb-4 text-center">
        <h1 className="text-2xl font-bold text-[#0F1B47]">My Bookings</h1>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                activeTab === key
                  ? "bg-[#0F1B47] text-white shadow-sm"
                  : "bg-white text-[#5B6B7A] hover:bg-[#F7F4EC]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="border-t border-[#12233D]/10" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-[#12233D]/10 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0F1B47]">Filters</h2>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-medium text-[#9AA5B1] hover:text-[#5B6B7A]"
            >
              Reset
            </button>
          </div>

          <div className="mb-4 border-t border-[#12233D]/10" />

          <div className="mb-5">
            <h3 className="mb-3 text-sm font-bold text-[#0F1B47]">Product Type</h3>
            <div className="space-y-2.5">
              {productTypes.map((type) => (
                <label key={type} className="flex cursor-pointer items-center gap-2.5 text-sm text-[#5B6B7A]">
                  <input
                    type="checkbox"
                    checked={selectedProductTypes.includes(type)}
                    onChange={() => toggleFilter(type, selectedProductTypes, setSelectedProductTypes)}
                    className="h-4 w-4 rounded border-[#C7CED6] text-[#0F1B47] focus:ring-[#0F1B47]"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-[#0F1B47]">Year</h3>
            <div className="space-y-2.5">
              {years.map((year) => (
                <label key={year} className="flex cursor-pointer items-center gap-2.5 text-sm text-[#5B6B7A]">
                  <input
                    type="checkbox"
                    checked={selectedYears.includes(year)}
                    onChange={() => toggleFilter(year, selectedYears, setSelectedYears)}
                    className="h-4 w-4 rounded border-[#C7CED6] text-[#0F1B47] focus:ring-[#0F1B47]"
                  />
                  {year}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div>
          {hasResults ? (
            <Table
              title={statusTitleMap[activeTab]}
              columns={holdTicketsColumns}
              pagination={{ pageSize: 20 }}
              dataSource={filteredData?.map((data, i) => ({
                ...data,
                sl: i + 1,
                action: (
                  <div className="flex items-center justify-center">
                    {data?.pnr && (
                      <ActionButton
                        viewContent={
                          <div>
                            <p><strong>PNR:</strong> {data.pnr}</p>
                            <p><strong>Booking:</strong> {data.bookingId}</p>
                          </div>
                        }
                        handleDelete={
                          activeTab === "hold" ? () => console.log("delete", data.pnr) : undefined
                        }
                      />
                    )}
                  </div>
                ),
              }))}
              rowKey="sl"
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}