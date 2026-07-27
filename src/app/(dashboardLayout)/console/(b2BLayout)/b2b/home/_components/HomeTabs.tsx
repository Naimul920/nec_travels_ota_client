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
    <div className="p-4 mx-4 bg-white rounded-lg shadow-xs md:mt-15 mt-10 mb-10">
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
          <div>Hotel Booking Content...</div>
        </TabPane>

        <TabPane key="3" tab="Visa" icon={<FiFileText size={20} />}>
          <div>Visa Information Content...</div>
        </TabPane>

        <TabPane key="4" tab="Holiday" icon={<MdHolidayVillage size={20} />}>
          <div>Holiday Information Content...</div>
        </TabPane>

        <TabPane key="5" tab="Umrah" icon={<FaKaaba size={20} />}>
          <div>Umrah Information Content...</div>
        </TabPane>

        <TabPane key="6" tab="Insurance" icon={<MdHealthAndSafety size={20} />}>
          <div>Insurance Information Content...</div>
        </TabPane>
      </Tabs>
    </div>
  );
}
