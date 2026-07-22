import ExclusiveOffer from "@/components/b2c/home/exclusiveOffer/ExclusiveOffer";
import ExploreNec from "@/components/b2c/home/explore/ExploreNec";
import HomeHero from "@/components/b2c/home/hero/Hero";
import PopularDestination from "@/components/b2c/home/popularDestination/PopularDestination";
import React from "react";

function page() {
  return (
    <div>
      <HomeHero />
      <ExploreNec />
      <ExclusiveOffer />
      <PopularDestination />
    </div>
  );
}

export default page;
