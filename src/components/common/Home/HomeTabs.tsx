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
    <div className="hero-bg text-amber-100 ">
      <div className="mb-5 mt-3 flex flex-col items-center justify-center md:mt-0 pt-10">
        <p className="text-xs font-semibold tracking-[0.3em] text-gray-800 md:text-2xl">
          YOUR TRAVEL BE SAFER
        </p>

        <span className="mt-2 font-stalemate text-6xl text-gray-900 sm:text-8xl md:text-9xl">
          With
        </span>

        <h1 className="-mt-4 text-3xl font-bold text-shadow-2xs md:text-8xl">
          <span className="text-primary">NEC</span>{" "}
          <span className="text-secondary">TRAVELS</span>
        </h1>
      </div>
      <div className=" bg-white rounded-lg shadow-xs md:mt-15 mt-10 mb-10">
        <Tabs
          activeKey={activeKey}
          onChange={(key) => setActiveKey(key)}
          className="flex flex-col items-center justify-center -mt-11"
          containerClassName="max-w-full md:max-w-max"
        >
          <TabPane key="1" tab="Flight" icon={<MdFlight size={20} />}>
            <Flight />
          </TabPane>

          <TabPane key="2" tab="Hotel" icon={<LuBuilding2 size={20} />}>
            <div className="text-amber-700" >Hotel Booking coming soon...</div>
          </TabPane>

          <TabPane key="3" tab="Visa" icon={<FiFileText size={20} />}>
            <div className="text-amber-700" >Visa Information coming soon...</div>
          </TabPane>

          <TabPane key="4" tab="Holiday" icon={<MdHolidayVillage size={20} />}>
            <div className="text-amber-700" >Holiday Information coming soon...</div>
          </TabPane>

          <TabPane key="5" tab="Umrah" icon={<FaKaaba size={20} />}>
            <div className="text-amber-700">Umrah Information coming soon...</div>
          </TabPane>

          <TabPane
            key="6"
            tab="Insurance"
            icon={<MdHealthAndSafety size={20} />}
          >
            <div className="text-amber-700">Insurance Information coming soon...</div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
