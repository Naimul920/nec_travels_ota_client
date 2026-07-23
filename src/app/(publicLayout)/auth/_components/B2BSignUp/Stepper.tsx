"use client";

import {
  FiBriefcase,
  FiCheck,
  FiFileText,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { TOTAL_STEPS } from "./types";

const STEPS = [
  { id: 1, title: "Account", icon: FiUser },
  { id: 2, title: "Company", icon: FiBriefcase },
  { id: 3, title: "Documents", icon: FiFileText },
  { id: 4, title: "Review", icon: FiShield },
];

export default function Stepper({ currentStep }: { currentStep: number }) {
  const progressPercent = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="mb-10" aria-label={`Step ${currentStep} of ${TOTAL_STEPS}`}>
      <div className="relative flex justify-between">
        {/* Background track offset by 22px (half of w-11) on both ends */}
        <div className="absolute left-5.5 right-5.5 top-5 h-0.5 rounded-full bg-slate-200" />

        {/* Active progress bar contained within the same track width */}
        <div className="absolute left-5.5 right-5.5 top-5 h-0.5 pointer-events-none">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {STEPS.map((step) => {
          const Icon = step.icon;
          const active = currentStep === step.id;
          const completed = currentStep > step.id;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                aria-current={active ? "step" : undefined}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300 ${
                  completed
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : active
                      ? "border-emerald-600 bg-emerald-600 text-white ring-4 ring-emerald-600/15"
                      : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                {completed ? <FiCheck /> : <Icon />}
              </div>

              <span
                className={`mt-2 text-xs font-semibold ${
                  active || completed ? "text-emerald-700" : "text-slate-400"
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
