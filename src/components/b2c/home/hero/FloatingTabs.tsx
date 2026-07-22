"use client";

import React from "react";
import { LuBuilding2 } from "react-icons/lu";
import { FiFileText } from "react-icons/fi";
import { MdFlight, MdHealthAndSafety, MdHolidayVillage } from "react-icons/md";
import { FaKaaba } from "react-icons/fa";

import TabPane from "@/components/b2c/home/hero/Tabpan";
import Tabs from "@/components/b2c/home/hero/Tabs";
import { Flight } from "@/components/flight";

interface HomeTabsProps {
  activeKey: string | null;
  onTabChange: (key: string) => void;
}

export default function HomeTabs({ activeKey, onTabChange }: HomeTabsProps) {
  return (
    <Tabs
      activeKey={activeKey}
      onChange={onTabChange}
      className="w-full"
      containerClassName="justify-center mx-auto max-w-max"
    >
      <TabPane key="1" tab="Flight" icon={<MdFlight size={20} />}>
        <Flight route="b2c" />
      </TabPane>

      <TabPane
        disabled={true}
        key="2"
        tab="Hotel"
        icon={<LuBuilding2 size={20} />}
      >
        <div className="p-4 text-gray-600">Hotel Booking Content...</div>
      </TabPane>

      <TabPane
        disabled={true}
        key="3"
        tab="Visa"
        icon={<FiFileText size={20} />}
      >
        <div className="p-4 text-gray-600">Visa Information Content...</div>
      </TabPane>

      <TabPane
        disabled={true}
        key="4"
        tab="Holiday"
        icon={<MdHolidayVillage size={20} />}
      >
        <div className="p-4 text-gray-600">Holiday Information Content...</div>
      </TabPane>

      <TabPane disabled={true} key="5" tab="Umrah" icon={<FaKaaba size={20} />}>
        <div className="p-4 text-gray-600">Umrah Information Content...</div>
      </TabPane>

      <TabPane
        disabled={true}
        key="6"
        tab="Insurance"
        icon={<MdHealthAndSafety size={20} />}
      >
        <div className="p-4 text-gray-600">
          Insurance Information Content...
        </div>
      </TabPane>
    </Tabs>
  );
}
