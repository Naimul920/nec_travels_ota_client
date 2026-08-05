"use client";

import React, { useState } from "react";
import { LuBuilding2 } from "react-icons/lu";
import { FiFileText } from "react-icons/fi";
import { MdFlight, MdHealthAndSafety, MdHolidayVillage } from "react-icons/md";
import { FaKaaba } from "react-icons/fa";
import { TabPane, Tabs } from "@/components/ui";
import { Flight } from "@/components/modules/flight";

export default function HomeTabs() {
  const [activeKey, setActiveKey] = useState("1");

  return (
    <div className="hero-bg">
        <div className="mb-5 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-semibold tracking-[0.3em] text-gray-800 sm:text-sm md:text-xl lg:text-2xl">
            YOUR TRAVEL BE SAFER
          </p>

          <span className="mt-1 font-stalemate text-5xl text-gray-900 sm:text-7xl md:text-9xl">
            With
          </span>

          <h1 className="-mt-2 text-4xl font-bold text-shadow-2xs sm:text-6xl md:-mt-4 md:text-8xl">
            <span className="text-primary">NEC</span>{" "}
            <span className="text-secondary">TRAVELS</span>
          </h1>
        </div>
        <div className="relative mt-10 rounded-2xl  border py-5  border-white/60 bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_10px_40px_rgba(15,35,61,0.15)] backdrop-blur-xs md:mt-16">
          <Tabs
            activeKey={activeKey}
            onChange={(key) => setActiveKey(key)}
            className="relative  z-10 flex px-5 flex-col items-center justify-center -mt-13"
            containerClassName="max-w-full md:max-w-max"
          >
            <TabPane key="1" tab="Flight" icon={<MdFlight size={20} />}>
              <Flight />
            </TabPane>

            <TabPane key="2" tab="Hotel" icon={<LuBuilding2 size={20} />}>
              <div className="">Hotel Booking coming soon...</div>
            </TabPane>

            <TabPane key="3" tab="Visa" icon={<FiFileText size={20} />}>
              <div className="">
                Visa Information coming soon...
              </div>
            </TabPane>

            <TabPane
              key="4"
              tab="Holiday"
              icon={<MdHolidayVillage size={20} />}
            >
              <div className="">
                Holiday Information coming soon...
              </div>
            </TabPane>

            <TabPane key="5" tab="Umrah" icon={<FaKaaba size={20} />}>
              <div className="">
                Umrah Information coming soon...
              </div>
            </TabPane>

            <TabPane
              key="6"
              tab="Insurance"
              icon={<MdHealthAndSafety size={20} />}
            >
              <div className="">
                Insurance Information coming soon...
              </div>
            </TabPane>
          </Tabs>
        </div>
    </div>
  );
}
