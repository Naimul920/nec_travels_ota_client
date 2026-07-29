"use client";
import ExclusiveOffer from "@/components/modules/b2c/home/exclusiveOffer/ExclusiveOffer";
import ExploreNec from "@/components/modules/b2c/home/explore/ExploreNec";
import PopularDestination from "@/components/modules/b2c/home/popularDestination/PopularDestination";
import { useEffect } from "react";
import HomeTabs from "./HomeTabs";
// import HomeTabs from "../../components/common/Home/HomeTabs";

export default function Home() {
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      // setSidebarOpen(true);
    }
  }, []);

  return (
    <>
      <div className="max-w-[1600px] mx-auto px-5 sm:px-10">
        
        {/* <HomeHero /> */}
        <HomeTabs/>
        <ExploreNec />
        <ExclusiveOffer />
      </div>
      <PopularDestination />
    </>
  );
}
