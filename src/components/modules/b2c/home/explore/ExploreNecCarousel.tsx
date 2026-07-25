import { IoIosAirplane } from "react-icons/io";
import ExploreCarousel from "@/components/modules/b2c/home/explore/ExploreCarousel";

function ExploreNecCarousel() {
  return (
    <div>
      <div className=" w-full bg-linear-to-t from-primary to-white p-10 shadow-sm max-h-125">
        <div className="flex justify-between max-w-7xl mx-auto ">
          {/* left div */}
          <div className="relative top-12 flex flex-col items-start gap-4 ">
            {/* black background paris */}
            <div className="w-96 h-11 bg-[#0F1836] flex justify-between items-center  px-4">
              <p className="uppercase text-white text-xl  tracking-[1em] font-semibold">
                Paris
              </p>
              <div className="flex gap-4 text-3xl">
                <IoIosAirplane className="-rotate-45 text-primary" />
                <IoIosAirplane className="-rotate-45 text-white" />
              </div>
            </div>

            <div className="text-left w-142 leading-7 p-5 pl-0">
              Discover and Book Unique Experiences in <b>Paris</b> Hosted by
              Local Experts. Find One-of-a-Kind Activities Hosted by Local
              Experts in <b>Paris</b>.
            </div>
            <div>
              <button className="bg-white h-13  text-2xl border-2 px-8">
                Book Now
              </button>
            </div>
          </div>

          {/* right div */}
          <div className="">
            <ExploreCarousel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExploreNecCarousel;
