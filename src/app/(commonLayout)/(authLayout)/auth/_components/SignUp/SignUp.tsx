"use client";

import Link from "next/link";
import { useState } from "react";
import { FiBriefcase, FiMapPin, FiSend, FiUser } from "react-icons/fi";
import B2BSignUp from "../B2BSignUp/B2BSignUp";
import B2CSignUp from "../B2CSignUp/B2CSignUp";
import { FlightRoute } from "@/components/shared/FlightRoute/FlightRoute";

export type SignUpFlow = "b2c" | "b2b";

const BARCODE_BARS = [
  2, 4, 1, 3, 5, 2, 1, 4, 3, 2, 5, 1, 3, 2, 4, 1, 5, 2, 3, 1, 4, 2,
];

// Simplified continent silhouettes (abstract, not geographically exact)
// rendered as a dotted texture behind the ticket copy.
const WORLD_BLOBS = [
  "M18 96c10-22 34-30 58-24 20 5 32 20 48 18 16-2 26 10 20 26-8 20-34 24-54 20-8-2-14 4-24 2-24-4-44-18-52-38-4-2-2-2 4-4Z",
  "M150 190c14-10 32-8 40 4 10 14 4 30-10 36-16 6-34 0-40-14-4-10 0-20 10-26Z",
  "M60 210c18-6 40 2 46 18 6 16-4 32-22 36-20 4-40-6-46-22-4-14 4-26 22-32Z",
  "M210 60c26-8 56 2 68 24 10 18 4 38-14 46-10 4-18 14-30 12-22-4-36-22-40-42-4-18 2-34 16-40Z",
  "M300 110c22-4 44 8 50 26 6 18-4 34-22 40-8 2-14 10-24 8-20-4-32-20-34-38-2-16 8-30 30-36Z",
  "M120 40c16-6 34 0 40 14 6 14-2 28-18 32-14 4-28-4-32-16-4-12 2-24 10-30Z",
];

export default function SignUp() {
  const [flow, setFlow] = useState<SignUpFlow>("b2c");

  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl border border-[#12233D]/10 bg-white shadow-xl md:grid-cols-5">
        {/* Left ticket stub */}
        <div className="relative col-span-2 hidden flex-col justify-between overflow-hidden bg-linear-to-l from-[#F0F9F1] via-[#B9EBCF] to-[#6FDB9E] p-10 md:flex">
          {/* Dotted world-map texture */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 400 560"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="worldDots"
                width="7"
                height="7"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1.3" cy="1.3" r="1.3" fill="#12233D" />
              </pattern>
            </defs>
            <g opacity="0.12">
              {WORLD_BLOBS.map((d, i) => (
                <path key={i} d={d} fill="url(#worldDots)" />
              ))}
            </g>
          </svg>

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-2">
            <FiSend className="rotate-45 text-brand" size={18} />
            <p className="font-plex-mono text-xs tracking-[0.25em] text-[#12233D]">
              NEC TRAVELS
            </p>
          </div>

          {/* Route + copy + ticket illustration */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <FiMapPin className="text-brand" size={12} />
                  <p className="font-grotesk text-lg font-medium text-[#12233D]">
                    DAC
                  </p>
                </div>
                <p className="font-plex-mono text-[10px] tracking-widest text-[#5B6B7A]">
                  DHAKA
                </p>
              </div>

              <FlightRoute />

              <div className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <p className="font-grotesk text-lg font-medium text-[#12233D]">
                    JED
                  </p>
                  <FiMapPin className="text-brand" size={12} />
                </div>
                <p className="font-plex-mono text-[10px] tracking-widest text-[#5B6B7A]">
                  JEDDAH
                </p>
              </div>
            </div>

            {flow === "b2c" ? (
              <p className="font-grotesk text-2xl font-medium leading-snug text-[#12233D]">
                Join our network,
                <br />
                <span className="text-brand">start safe travel</span> today.
              </p>
            ) : (
              <p className="font-grotesk text-2xl font-medium leading-snug text-[#12233D]">
                Join our network,
                <br />
                <span className="text-brand">start earning</span> today.
              </p>
            )}

            {/* Boarding pass illustration */}
            <div className="relative pt-2">
              <div className="relative -rotate-3 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-[#12233D]/5 transition-transform duration-300 hover:-rotate-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <FiSend className="rotate-45 text-brand" size={14} />
                    <p className="font-plex-mono text-[10px] font-bold tracking-[0.2em] text-[#12233D]">
                      NEC TRAVELS
                    </p>
                  </div>
                  <p className="font-plex-mono text-[9px] tracking-widest text-[#9FB4C7]">
                    E-TICKET
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-dashed border-[#12233D]/15 pt-3">
                  <div>
                    <p className="font-plex-mono text-[9px] tracking-widest text-[#9FB4C7]">
                      FROM
                    </p>
                    <p className="font-grotesk text-base font-semibold text-[#12233D]">
                      DAC
                    </p>
                    <p className="font-plex-mono text-[8px] tracking-widest text-[#9FB4C7]">
                      DHAKA
                    </p>
                  </div>
                  <FiSend className="mx-2 shrink-0 text-brand" size={16} />
                  <div className="text-right">
                    <p className="font-plex-mono text-[9px] tracking-widest text-[#9FB4C7]">
                      TO
                    </p>
                    <p className="font-grotesk text-base font-semibold text-[#12233D]">
                      JED
                    </p>
                    <p className="font-plex-mono text-[8px] tracking-widest text-[#9FB4C7]">
                      JEDDAH
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barcode footer */}
          <div className="relative z-10">
            <div className="flex h-8 items-end gap-[2px]">
              {BARCODE_BARS.map((w, i) => (
                <div
                  key={i}
                  className="bg-[#12233D]/70"
                  style={{ width: `${w}px`, height: "100%" }}
                />
              ))}
            </div>
            <p className="mt-2 font-plex-mono text-[10px] tracking-[0.2em] text-[#12233D]">
              NEW MEMBER · PASS NO. 001
            </p>
          </div>
        </div>

        {/* Perforated seam */}
        <div className="pointer-events-none absolute inset-y-0 left-2/5 hidden -translate-x-1/2 border-l-2 border-dashed border-[#12233D]/15 md:block">
          <div className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-[#F7F4EC]" />
          <div className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-[#F7F4EC]" />
        </div>

        {/* Right form panel */}
        <div className="col-span-1 p-6 sm:p-8 md:col-span-3">
          <div className="mx-auto w-full max-w-lg space-y-5">
            <div>
              <div className="mb-3 flex items-center gap-2 md:hidden">
                <FiSend className="rotate-45 text-brand" size={18} />
                <p className="font-plex-mono text-xs tracking-[0.25em] text-[#12233D]">
                  NEC TRAVELS
                </p>
              </div>

              <h2 className="font-grotesk text-xl font-medium text-[#12233D]">
                Create account
              </h2>

              <p className="mt-1 text-[13px] text-[#5B6B7A]">
                Choose your account type to get started.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Account type"
              className="flex items-center gap-2 rounded-2xl border border-[#12233D]/10 bg-white p-1.5"
            >
              <button
                type="button"
                role="tab"
                aria-selected={flow === "b2c"}
                onClick={() => setFlow("b2c")}
                className={`flex flex-1 items-center gap-2 rounded-xl px-3 py-2 text-left transition-all ${
                  flow === "b2c"
                    ? "bg-brand text-white shadow-md"
                    : "bg-transparent text-[#5B6B7A] hover:bg-[#F7F4EC]"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    flow === "b2c"
                      ? "bg-white/20"
                      : "bg-[#F7F4EC] text-[#9FB4C7]"
                  }`}
                >
                  <FiUser size={16} />
                </div>
                <div>
                  <p
                    className={`text-xs font-bold ${
                      flow === "b2c" ? "text-white" : "text-[#12233D]"
                    }`}
                  >
                    Customer Account
                  </p>
                  <p
                    className={`text-[10px] ${
                      flow === "b2c" ? "text-white/80" : "text-[#9FB4C7]"
                    }`}
                  >
                    Individual travelers
                  </p>
                </div>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={flow === "b2b"}
                onClick={() => setFlow("b2b")}
                className={`flex flex-1 items-center gap-2 rounded-xl px-3 py-2 text-left transition-all ${
                  flow === "b2b"
                    ? "bg-brand text-white shadow-md"
                    : "bg-transparent text-[#5B6B7A] hover:bg-[#F7F4EC]"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    flow === "b2b"
                      ? "bg-white/20"
                      : "bg-[#F7F4EC] text-[#9FB4C7]"
                  }`}
                >
                  <FiBriefcase size={16} />
                </div>
                <div>
                  <p
                    className={`text-xs font-bold ${
                      flow === "b2b" ? "text-white" : "text-[#12233D]"
                    }`}
                  >
                    Business Account
                  </p>
                  <p
                    className={`text-[10px] ${
                      flow === "b2b" ? "text-white/80" : "text-[#9FB4C7]"
                    }`}
                  >
                    Travel Agency
                  </p>
                </div>
              </button>
            </div>

            {flow === "b2c" ? <B2CSignUp /> : <B2BSignUp />}

            <p className="text-center text-sm text-[#5B6B7A]">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="font-semibold text-brand hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
