"use client";
import ExclusiveOffer from "@/components/modules/b2c/home/exclusiveOffer/ExclusiveOffer";
import ExploreNec from "@/components/modules/b2c/home/explore/ExploreNec";
import HomeHero from "@/components/modules/b2c/home/hero/Hero";
import PopularDestination from "@/components/modules/b2c/home/popularDestination/PopularDestination";
import FlightBooking from "@/components/modules/flight/FlightBooking/FlightBooking";
import FlightSearch from "@/components/modules/flight/FlightSearch/FlightSearch";
import { useEffect } from "react";
import HomeTabs from "../(dashboardLayout)/console/(b2BLayout)/b2b/home/_components/HomeTabs";

export default function HomePage() {
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      // setSidebarOpen(true);
    }
  }, []);

  return (
    <>
      <div className="max-w-[1600px] mx-auto px-10">
        {/* <HomeHero /> */}
        <HomeTabs/>
        <ExploreNec />
        <ExclusiveOffer />
      </div>
      <PopularDestination />
    </>
  );
}
