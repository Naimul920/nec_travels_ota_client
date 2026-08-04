"use client";

import * as React from "react";
import { useMemo } from "react";
import clsx from "clsx";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import * as Flags from "country-flag-icons/react/3x2";
import type { FlagComponent } from "country-flag-icons/react/3x2";

const DIAL_TO_COUNTRY: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const code of getCountries()) {
    try {
      const dial = String(getCountryCallingCode(code));
      if (!map[dial]) map[dial] = code;
    } catch {}
  }
  return map;
})();

const flagMap = Flags as unknown as Record<string, FlagComponent | undefined>;

interface CountryFlagProps {
  dial?: string;
  countryCode?: string;
  className?: string;
}

const CountryFlag: React.FC<CountryFlagProps> = ({
  dial,
  countryCode,
  className,
}) => {
  const code = useMemo(() => {
    if (countryCode && countryCode.length === 2) return countryCode.toUpperCase();
    const resolved = DIAL_TO_COUNTRY[dial?.replace(/^\+/, "") || ""];
    return resolved?.toUpperCase() || "";
  }, [dial, countryCode]);

  const Component = flagMap[code];
  if (!Component) return null;

  return <Component className={clsx("shrink-0", className)} />;
};

export default CountryFlag;