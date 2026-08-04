import { FaPlane } from "react-icons/fa";

/** Signature element: a dashed flight-route rule with a plane gliding along it. */
export function FlightRoute() {
  return (
    <div
      aria-hidden="true"
      className="relative h-6 w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 border-t border-dashed border-white/30" />
      <FaPlane
        className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white motion-safe:animate-[fly_16s_linear_infinite]"
        style={{ left: "-5%" }}
      />
      <style>{`
        @keyframes fly {
          from { left: -5%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          to { left: 105%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}