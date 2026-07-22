import React from "react";
import Image from "next/image";
import HomeHeroPic from "@/assets/homeHero.webp";

export default function HeroContent() {
  return (
    <>
      {/* Hero Background Image */}
      <Image
        src={HomeHeroPic}
        alt="Travel Exploration Backdrop"
        fill
        priority
        className="object-cover rounded-xl"
      />

      {/* Figma Overlay 1: #3ABFF029 */}
      <div className="absolute inset-0 bg-[#3ABFF0]/[0.16] z-10 rounded-xl" />
      {/* Figma Overlay 2: #00000099 */}
      <div className="absolute inset-0 bg-black/60 z-20 rounded-xl" />

      {/* Hero Typography Text Layer */}
      <div className="absolute inset-0 z-30 flex flex-col items-center pt-20 text-center text-white font-belanosima ">
        <h1 className=" font-bold text-[64px] leading-tight tracking-wide drop-shadow-md font-belanosima">
          <span className="text-[#00A550]">Wonder</span> Freely
        </h1>
        <h1 className=" font-bold text-[64px] leading-tight tracking-wide drop-shadow-md mt-1">
          Explore <span className="text-[#00A550]">Endlessly</span>
        </h1>
      </div>
    </>
  );
}
