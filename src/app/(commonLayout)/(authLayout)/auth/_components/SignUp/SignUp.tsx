"use client";

import Link from "next/link";
import { useState } from "react";
import { FiBriefcase, FiSend, FiUser } from "react-icons/fi";
import B2BSignUp from "../B2BSignUp/B2BSignUp";
import B2CSignUp from "../B2CSignUp/B2CSignUp";

export type SignUpFlow = "b2c" | "b2b";

const BARCODE_BARS = [
  2, 4, 1, 3, 5, 2, 1, 4, 3, 2, 5, 1, 3, 2, 4, 1, 5, 2, 3, 1, 4, 2,
];

export default function SignUp() {
  const [flow, setFlow] = useState<SignUpFlow>("b2c");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-[#F7F4EC] px-4 py-10 font-[family-name:var(--font-inter)]">
      <div className="relative grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl border border-[#12233D]/10 bg-white shadow-2xl md:grid-cols-5">
        {/* Left ticket stub */}
        <div className="relative col-span-2 hidden flex-col justify-between overflow-hidden bg-[#12233D] p-10 md:flex">
          <div className="relative z-10 flex items-center gap-2">
            <FiSend className="rotate-45 text-[#E2703A]" size={18} />
            <p className="font-[family-name:var(--font-plex-mono)] text-xs tracking-[0.25em] text-[#9FB4C7]">
              NEC TRAVELS
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-left">
                <p className="font-[family-name:var(--font-grotesk)] text-lg font-medium text-[#F7F4EC]">
                  DAC
                </p>
                <p className="font-[family-name:var(--font-plex-mono)] text-[10px] tracking-widest text-[#9FB4C7]">
                  DHAKA
                </p>
              </div>

              <div className="relative flex-1">
                <div className="border-t border-dashed border-[#9FB4C7]/50" />
                <FiSend
                  className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 text-[#E2703A]"
                  size={14}
                />
              </div>

              <div className="text-right">
                <p className="font-[family-name:var(--font-grotesk)] text-lg font-medium text-[#F7F4EC]">
                  JED
                </p>
                <p className="font-[family-name:var(--font-plex-mono)] text-[10px] tracking-widest text-[#9FB4C7]">
                  JEDDAH
                </p>
              </div>
            </div>
            {flow == "b2c" ? (
              <p className="font-[family-name:var(--font-grotesk)] text-2xl font-medium leading-snug text-[#F7F4EC]">
                Join our network,
                <br />
                start safe travel today.
              </p>
            ) : (
              <p className="font-[family-name:var(--font-grotesk)] text-2xl font-medium leading-snug text-[#F7F4EC]">
                Join our network,
                <br />
                start earning today.
              </p>
            )}
          </div>

          <div className="relative z-10">
            <div className="flex h-8 items-end gap-[2px]">
              {BARCODE_BARS.map((w, i) => (
                <div
                  key={i}
                  className="bg-[#9FB4C7]/70"
                  style={{ width: `${w}px`, height: "100%" }}
                />
              ))}
            </div>
            <p className="mt-2 font-[family-name:var(--font-plex-mono)] text-[10px] tracking-[0.2em] text-[#9FB4C7]">
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
        <div className="col-span-1 p-8 sm:p-12 md:col-span-3">
          <div className="mx-auto w-full max-w-lg space-y-8">
            <div>
              <div className="mb-6 flex items-center gap-2 md:hidden">
                <FiSend className="rotate-45 text-[#E2703A]" size={18} />
                <p className="font-[family-name:var(--font-plex-mono)] text-xs tracking-[0.25em] text-[#12233D]">
                  NEC TRAVELS
                </p>
              </div>

              <h2 className="font-[family-name:var(--font-grotesk)] text-3xl font-medium text-[#12233D]">
                Create account
              </h2>

              <p className="mt-2 text-sm text-[#5B6B7A]">
                Choose your account type to get started.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Account type"
              className="flex items-center gap-3 rounded-2xl border border-[#12233D]/10 bg-white p-2"
            >
              <button
                type="button"
                role="tab"
                aria-selected={flow === "b2c"}
                onClick={() => setFlow("b2c")}
                className={`flex flex-1 items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                  flow === "b2c"
                    ? "bg-[#E2703A] text-white shadow-md"
                    : "bg-transparent text-[#5B6B7A] hover:bg-[#F7F4EC]"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    flow === "b2c"
                      ? "bg-white/20"
                      : "bg-[#F7F4EC] text-[#9FB4C7]"
                  }`}
                >
                  <FiUser size={20} />
                </div>
                <div>
                  <p
                    className={`text-sm font-bold ${
                      flow === "b2c" ? "text-white" : "text-[#12233D]"
                    }`}
                  >
                    Customer Account
                  </p>
                  <p
                    className={`text-xs ${
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
                className={`flex flex-1 items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                  flow === "b2b"
                    ? "bg-[#E2703A] text-white shadow-md"
                    : "bg-transparent text-[#5B6B7A] hover:bg-[#F7F4EC]"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    flow === "b2b"
                      ? "bg-white/20"
                      : "bg-[#F7F4EC] text-[#9FB4C7]"
                  }`}
                >
                  <FiBriefcase size={20} />
                </div>
                <div>
                  <p
                    className={`text-sm font-bold ${
                      flow === "b2b" ? "text-white" : "text-[#12233D]"
                    }`}
                  >
                    Business Account
                  </p>
                  <p
                    className={`text-xs ${
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
                className="font-semibold text-[#E2703A] hover:underline"
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
