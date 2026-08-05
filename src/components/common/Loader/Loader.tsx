"use client";

import React from "react";

const Loader = () => {
  return (
    <div 
      role="status"
      aria-live="polite"
      aria-label="Loading application"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary overflow-hidden"
    >
      {/* Background Ambient Glow Effects */}
      <div 
        aria-hidden="true" 
        className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" 
      />
      <div 
        aria-hidden="true" 
        className="absolute w-44 h-44 bg-secondary/10 rounded-full blur-2xl animate-ping opacity-50" 
      />

      {/* Spinner Graphic */}
      <div className="relative flex items-center justify-center">
        {/* Outer Spinning Ring */}
        <div className="w-20 h-20 border-4 border-white/20 border-t-secondary rounded-full animate-spin" />
        
        {/* Inner Pulsing Core */}
        <div className="absolute w-4 h-4 bg-secondary rounded-full animate-ping opacity-75" />
        <div className="absolute w-3 h-3 bg-secondary rounded-full shadow-lg shadow-secondary/50" />
      </div>

      {/* Branding & Typography */}
      <div className="flex flex-col items-center mt-6 text-center select-none">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
          Your Travel Be Safer
        </p>
        
        {/* Removed my-1 and added leading-none to tighten the font box */}
        <p className="font-stalemate text-white/90 text-3xl leading-none mt-1">
          With
        </p>
        
        {/* Added -mt-2.5 to pull NEC TRAVELS up closer to 'With' */}
        <h1 className="font-extrabold text-3xl tracking-wide -mt-2.5">
          <span className="text-white drop-shadow-sm">NEC</span>{" "}
          <span className="text-secondary drop-shadow-sm">TRAVELS</span>
        </h1>
      </div>
      
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;