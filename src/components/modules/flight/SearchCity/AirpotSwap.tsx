import React from "react";
import { TfiReload } from "react-icons/tfi";

interface AirpotSwapProps {
  onSwap: () => void;
}

const AirpotSwap: React.FC<AirpotSwapProps> = ({ onSwap }) => {
  return (
    <button
      type="button"
      onClick={onSwap}
      aria-label="Swap airports"
      className="absolute left-1/2 top-1/2 z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-brand/30 bg-white text-brand shadow-sm transition-all duration-300 hover:rotate-180 hover:border-brand hover:bg-emerald-50 active:scale-95 max-sm:top-[calc(50%+2px)]"
    >
      <TfiReload size={16} />
    </button>
  );
};

export default AirpotSwap;
