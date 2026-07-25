"use client";

import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import { FiBriefcase, FiUser } from "react-icons/fi";
import { IconType } from "react-icons";
import B2BSignUp from "../B2BSignUp/B2BSignUp";
import B2CSignUp from "../B2CSignUp/B2CSignUp";

export type SignUpFlow = "b2c" | "b2b";

interface FlowOption {
  id: SignUpFlow;
  icon: IconType;
  title: string;
  subtitle: string;
}

const FLOW_OPTIONS: FlowOption[] = [
  {
    id: "b2c",
    icon: FiUser,
    title: "Customer account",
    subtitle: "Individual travelers",
  },
  {
    id: "b2b",
    icon: FiBriefcase,
    title: "Corporate account",
    subtitle: "Teams & businesses",
  },
];

function FlowSwitchButton({
  option,
  active,
  onSelect,
}: {
  option: FlowOption;
  active: boolean;
  onSelect: () => void;
}) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onSelect}
      className={clsx(
        "flex flex-1 items-center gap-3 rounded-xl p-3 text-left transition-all",
        active
          ? "bg-brand text-white shadow-md"
          : "bg-transparent text-slate-500 hover:bg-slate-50",
      )}
    >
      <div
        className={clsx(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          active ? "bg-white/20" : "bg-slate-100 text-slate-400",
        )}
      >
        <Icon size={18} />
      </div>

      <div>
        <p
          className={clsx(
            "text-sm font-bold",
            active ? "text-white" : "text-slate-700",
          )}
        >
          {option.title}
        </p>
        <p
          className={clsx(
            "text-xs",
            active ? "text-white/80" : "text-slate-400",
          )}
        >
          {option.subtitle}
        </p>
      </div>
    </button>
  );
}

export default function SignUp() {
  const [flow, setFlow] = useState<SignUpFlow>("b2c");

  return (
    <div className="mx-auto my-10 max-w-3xl rounded-2xl border border-slate-100 bg-white p-6 sm:p-8">
      <div
        role="tablist"
        aria-label="Account type"
        className="mb-8 flex items-center gap-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-lg"
      >
        {FLOW_OPTIONS.map((option) => (
          <FlowSwitchButton
            key={option.id}
            option={option}
            active={flow === option.id}
            onSelect={() => setFlow(option.id)}
          />
        ))}
      </div>

      {flow === "b2c" ? <B2CSignUp /> : <B2BSignUp />}

      {/* Login Link */}
      <div className="mt-8  pt-6 text-center">
        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-semibold text-brand transition-colors hover:text-brand/80"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
