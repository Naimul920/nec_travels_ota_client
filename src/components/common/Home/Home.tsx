import ExclusiveOffer from "@/components/modules/b2c/home/exclusiveOffer/ExclusiveOffer";
import ExploreNec from "@/components/modules/b2c/home/explore/ExploreNec";
import PopularDestination from "@/components/modules/b2c/home/popularDestination/PopularDestination";
import HomeTabs from "./HomeTabs";

export default function Home() {
  return (
    <div className="overflow-x-clip bg-white">
      <HomeTabs />
      <ExploreNec />
      <ExclusiveOffer />
      <PopularDestination />
    </div>
  );
}
