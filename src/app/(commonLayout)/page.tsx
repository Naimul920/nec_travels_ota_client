// import ExclusiveOffer from "@/components/b2c/home/exclusiveOffer/ExclusiveOffer";
// import ExploreNec from "@/components/b2c/home/explore/ExploreNec";
// import HomeHero from "@/components/b2c/home/hero/Hero";
// import PopularDestination from "@/components/b2c/home/popularDestination/PopularDestination";

import ExclusiveOffer from "@/components/b2c/home/exclusiveOffer/ExclusiveOffer";
import ExploreNec from "@/components/b2c/home/explore/ExploreNec";
import HomeHero from "@/components/b2c/home/hero/Hero";
import PopularDestination from "@/components/b2c/home/popularDestination/PopularDestination";


function PublicPage() {
  return (
    <div>
      <HomeHero />
      <ExploreNec />
      <ExclusiveOffer />
      <PopularDestination />
    </div>
  );
}

export default PublicPage;
