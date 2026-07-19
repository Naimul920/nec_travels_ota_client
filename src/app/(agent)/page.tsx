import React from "react";
import Image from "next/image";
import HomeTabs from "@/app/(agent)/home/_components/HomeTabs";
import withImage from "../../../public/assets/images/with.png"; 

export default function HomePage() {
  return (
    <>
      {/* header content - Rendered completely on the Server */}
      <div className="flex flex-col justify-center items-center mb-5 md:mt-0 mt-3">
        <p className="md:text-2xl text-xs font-semibold tracking-widest text-gray-800">
          YOUR TRAVEL BE SAFER
        </p>
        <div className="mx-auto md:w-12 w-8 h-auto relative">
          <Image
            src={withImage}
            alt="Logo"
            width={48}
            height={48}
            style={{ width: "100%", height: "auto" }}
            priority
            unoptimized
            draggable={false}
          />
        </div>
        <h1 className="font-bold md:text-8xl text-3xl -mt-2.5 text-shadow-2xs">
          <span className="text-primary">NEC</span>{" "}
          <span className="text-secondary">TRAVELS</span>
        </h1>
      </div>

      {/* Dynamic Client Interactive Subsystem */}
      <HomeTabs />
    </>
  );
}
