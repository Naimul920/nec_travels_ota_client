"use client";

import React, { useState } from "react";
import { LuBuilding2 } from "react-icons/lu";
import { FiFileText } from "react-icons/fi";
import { MdFlight, MdHealthAndSafety, MdHolidayVillage } from "react-icons/md";
import { FaKaaba } from "react-icons/fa";
import clsx from "clsx";
import { TabPane, Tabs } from "@/components/ui";
import { Flight } from "@/components/modules/flight";
import { useAuthStore } from "@/store/auth.store";
import { ROLE } from "@/constant";

const ComingSoon: React.FC<{ icon: React.ReactNode; title: string }> = ({
  icon,
  title,
}) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-6 py-10 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
      {icon}
    </span>
    <p className="text-base font-bold text-gray-800">{title} coming soon...</p>
    <p className="text-sm text-gray-400">
      We are working hard to bring you this booking experience.
    </p>
  </div>
);

export default function HomeTabs() {
  const [activeKey, setActiveKey] = useState("1");
  const { user, isLoggedIn } = useAuthStore();
  const isB2B = isLoggedIn && user?.role === ROLE.B2B;

  return (
    <div className="relative w-full bg-white">
      {!isB2B && (
        <div className="relative h-70 w-full overflow-hidden md:h-96">
          <video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            src="/assets/videos/1746430357291.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white/40" />
        </div>
      )}

      {/* Floating panel straddling the video bottom edge */}
      <div
        className={clsx(
          "relative z-10 mx-auto w-full max-w-7xl",
          !isB2B && "md:-mt-32"
        )}
      >
        <div
          className={clsx(
            "relative z-40 rounded-3xl border border-slate-200/80 bg-white p-2 shadow-[0_20px_60px_rgba(15,35,61,0.15)] md:p-3",
            isB2B ? "mt-6" : "-mt-20"
          )}
        >
          <Tabs
            activeKey={activeKey}
            onChange={(key) => setActiveKey(key)}
            className="relative z-10 flex flex-col items-center justify-center"
            containerClassName={"w-full md:max-w-max justify-center"}
          >
            <TabPane key="1" tab="Flight" icon={<MdFlight size={20} />}>
              <Flight />
            </TabPane>

            <TabPane key="2" tab="Hotel" icon={<LuBuilding2 size={20} />}>
              <ComingSoon
                icon={<LuBuilding2 size={26} />}
                title="Hotel Booking"
              />
            </TabPane>

            <TabPane key="3" tab="Visa" icon={<FiFileText size={20} />}>
              <ComingSoon
                icon={<FiFileText size={26} />}
                title="Visa Information"
              />
            </TabPane>

            <TabPane
              key="4"
              tab="Holiday"
              icon={<MdHolidayVillage size={20} />}
            >
              <ComingSoon
                icon={<MdHolidayVillage size={26} />}
                title="Holiday Package"
              />
            </TabPane>

            <TabPane key="5" tab="Umrah" icon={<FaKaaba size={20} />}>
              <ComingSoon icon={<FaKaaba size={26} />} title="Umrah Package" />
            </TabPane>

            <TabPane
              key="6"
              tab="Insurance"
              icon={<MdHealthAndSafety size={20} />}
            >
              <ComingSoon
                icon={<MdHealthAndSafety size={26} />}
                title="Travel Insurance"
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
