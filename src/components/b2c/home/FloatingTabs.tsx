import React from "react";
import {
  MdOutlineFlightTakeoff,
  MdDirectionsRun,
  MdCreditCard,
} from "react-icons/md";
import { FaHotel, FaBookJournalWhills } from "react-icons/fa6";
import { BsFillPassportFill } from "react-icons/bs"; // Verify paths match your package setup

export type TabKey =
  | "flight"
  | "hotel"
  | "visa"
  | "insurance"
  | "activity"
  | "payment";

interface TabItem {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
}

interface FloatingTabsProps {
  activeTab: TabKey | null;
  onTabChange: (key: TabKey) => void;
}

export default function FloatingTabs({
  activeTab,
  onTabChange,
}: FloatingTabsProps) {
  const tabs: TabItem[] = [
    {
      key: "flight",
      label: "Flight",
      icon: <MdOutlineFlightTakeoff size={20} />,
    },
    { key: "hotel", label: "Hotel", icon: <FaHotel size={20} /> },
    { key: "visa", label: "Visa", icon: <BsFillPassportFill size={20} /> },
    {
      key: "insurance",
      label: "Insurance",
      icon: <FaBookJournalWhills size={20} />,
    },
    { key: "activity", label: "Activity", icon: <MdDirectionsRun size={20} /> },
    { key: "payment", label: "Payment", icon: <MdCreditCard size={20} /> },
  ];

  return (
    <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 z-40 w-full max-w-[1100px] px-4 lg:px-0">
      <div className="w-full bg-[#00A550] px-8 text-white rounded-t-4xl shadow-2xl relative">
        {/* Navigation Bar Header (Static 95px) */}
        <div className="grid grid-cols-6 h-[95px] relative z-50 bg-primary rounded-t-4xl">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer h-full text-base ${
                  isSelected
                    ? "bg-white/15 font-semibold shadow-inner"
                    : "hover:bg-white/5 opacity-85 hover:opacity-100"
                }`}
              >
                <span className="text-white">{tab.icon}</span>
                <span className="tracking-wide capitalize">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Floating Context Panel Body (Hangs beneath 95px boundary) */}
        <div
          className="absolute left-0 right-0 top-[95px] bg-[#00A550] text-white overflow-hidden transition-all duration-300 ease-in-out shadow-2xl rounded-b-lg z-40"
          style={{ height: activeTab ? "305px" : "0px" }}
        >
          {activeTab && (
            <div className="p-6 h-[305px] overflow-y-auto animate-fadeIn border-t border-white/10">
              {activeTab === "flight" && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold">Search Flights</h3>
                  <p className="text-sm opacity-90">
                    Flight booking fields and API integration logic.
                  </p>
                </div>
              )}
              {activeTab === "hotel" && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold">Find Accommodations</h3>
                  <p className="text-sm opacity-90">
                    Hotel matrixing engines and configurations.
                  </p>
                </div>
              )}
              {!["flight", "hotel"].includes(activeTab) && (
                <div className="flex items-center justify-center h-full opacity-75 italic text-sm">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} form
                  setup module coming soon.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
