"use client";

import * as React from "react";
import { useMemo } from "react";
import clsx from "clsx";
import PhoneInput, { type Country, type Value } from "react-phone-number-input";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import { useCurrencyStore } from "@/store/currency.store";

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

interface PhoneInputProps {
  className?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
}

const PhoneInputField: React.FC<PhoneInputProps> = ({
  className,
  label,
  error,
  errorMessage,
  required,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  name,
}) => {
  const phoneCode = useCurrencyStore((s) => s.phoneCode);
  const countryCode = useCurrencyStore((s) => s.geo?.countryCode);

  const defaultCountry = useMemo(() => {
    const byDial = DIAL_TO_COUNTRY[phoneCode?.replace(/^\+/, "") || ""];
    const byGeo =
      countryCode && /^[A-Za-z]{2}$/.test(countryCode)
        ? countryCode.toUpperCase()
        : "";
    return (byDial || byGeo || "BD") as Country;
  }, [phoneCode, countryCode]);

  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <div className={clsx("phone-input-wrap", error && "phone-input-error")}>
        <PhoneInput
          name={name}
          international
          defaultCountry={defaultCountry}
          value={(value as Value) || undefined}
          onChange={(v) => onChange?.(v || "")}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default PhoneInputField;
