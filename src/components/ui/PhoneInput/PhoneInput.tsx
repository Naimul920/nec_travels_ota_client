"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  type CountryCode,
} from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";
import * as Flags from "country-flag-icons/react/3x2";
import type { FlagComponent } from "country-flag-icons/react/3x2";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { useGeoStore, getGeoCountryCode } from "@/store/geo.store";

const flagMap = Flags as unknown as Record<string, FlagComponent | undefined>;

const Flag: React.FC<{ code: string; className?: string }> = ({
  code,
  className,
}) => {
  const Component = flagMap[code.toUpperCase()];
  if (!Component) return null;
  return <Component className={className} />;
};

const DIAL_TO_COUNTRY: Record<string, CountryCode> = (() => {
  const map: Record<string, CountryCode> = {};
  for (const code of getCountries()) {
    try {
      const dial = String(getCountryCallingCode(code));
      if (!map[dial]) map[dial] = code;
    } catch {}
  }
  return map;
})();

interface CountryOption {
  code: CountryCode;
  dial: string;
  name: string;
}

const COUNTRIES: CountryOption[] = (() => {
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  return getCountries()
    .map((code) => {
      let name: string = code;
      try {
        name = regionNames.of(code) || code;
      } catch {
        name = code;
      }
      return { code, dial: `+${getCountryCallingCode(code)}`, name };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
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
  value = "",
  onChange,
  onBlur,
  placeholder,
  disabled,
  name,
}) => {
  const [isTouched, setIsTouched] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const prefixRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Default country from client-side geo detection (api.necfly.com/geo)
  const geoCountryCode = useGeoStore((s) => getGeoCountryCode(s.geo));
  const defaultCountry = useMemo<CountryCode>(() => {
    return /^[A-Za-z]{2}$/.test(geoCountryCode)
      ? (geoCountryCode.toUpperCase() as CountryCode)
      : "BD";
  }, [geoCountryCode]);

  // Detect country from the dial code present in an auto-filled value, e.g. "+9665..."
  const valueCountry = useMemo<CountryCode | null>(() => {
    const match = value?.match(/^\+(\d+)/);
    if (!match) return null;
    return DIAL_TO_COUNTRY[match[1]] || null;
  }, [value]);

  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(defaultCountry);
  const [userSelectedCountry, setUserSelectedCountry] = useState(false);

  // Sync the selected country with the detected geoip country and/or the
  // dial code already present in an auto-filled value (until the user
  // explicitly picks a country from the dropdown).
  useEffect(() => {
    if (userSelectedCountry) return;
    setSelectedCountry(valueCountry || defaultCountry);
  }, [valueCountry, defaultCountry, userSelectedCountry]);

  // Get fixed non-editable dial code
  const dialCode = useMemo(() => {
    try {
      return `+${getCountryCallingCode(selectedCountry)}`;
    } catch {
      return "+880";
    }
  }, [selectedCountry]);

  // Extract national digits if value contains the dial code prefix
  const nationalNumber = useMemo(() => {
    if (!value) return "";
    if (value.startsWith(dialCode)) {
      return value.slice(dialCode.length).trim();
    }
    return value.replace(/^\+\d+\s*/, "");
  }, [value, dialCode]);

  // Check validity using libphonenumber-js
  const isValid = useMemo(() => {
    if (!value || value === dialCode) return !required;

    const example = examples[selectedCountry];
    const maxDigits =
      typeof example === "string" ? example.replace(/\D/g, "").length : 15;
    const nationalDigits = nationalNumber.replace(/\D/g, "").length;

    // Dial code is shown separately, so cap the entered digits at the
    // country's national number length (e.g. +880 + 10 digits for BD).
    if (nationalDigits > maxDigits) return false;

    try {
      return isValidPhoneNumber(value, selectedCountry);
    } catch {
      return false;
    }
  }, [value, dialCode, selectedCountry, required, nationalNumber]);

  // Selected country name + example mobile number (dynamic placeholder/error)
  const selectedCountryInfo = useMemo(() => {
    const name =
      COUNTRIES.find((c) => c.code === selectedCountry)?.name || selectedCountry;
    const example = examples[selectedCountry];
    return {
      name,
      example: typeof example === "string" ? example : "",
    };
  }, [selectedCountry]);

  // Dynamic placeholder based on the selected country's example number
  const resolvedPlaceholder =
    placeholder || selectedCountryInfo.example || "Phone number";

  // Dynamic, country-aware validation message
  const invalidMessage = useMemo(() => {
    if (!(isTouched && !isValid)) return "";
    if (!value) return "Phone number is required";
    const exampleMsg = selectedCountryInfo.example
      ? `, e.g. ${selectedCountryInfo.example}`
      : "";
    return `Enter a valid ${selectedCountryInfo.name} mobile number${exampleMsg}`;
  }, [isTouched, isValid, value, selectedCountryInfo]);

  // Combined error state (external Formik error OR internal invalid phone error)
  const hasError = Boolean(error || (isTouched && !isValid));
  const activeErrorMessage = invalidMessage || errorMessage || "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dial.includes(q)
    );
  }, [query]);

  useEffect(() => setMounted(true), []);

  const computePos = () => {
    const rect = prefixRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ top: rect.bottom + 6, left: rect.left, width: 240 });
  };

  const openDropdown = () => {
    computePos();
    setQuery("");
    setOpen(true);
  };

  const closeDropdown = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    if (!open) return;
    const onPosition = () => computePos();
    window.addEventListener("resize", onPosition);
    window.addEventListener("scroll", onPosition, true);
    return () => {
      window.removeEventListener("resize", onPosition);
      window.removeEventListener("scroll", onPosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        rootRef.current?.contains(e.target as Node) ||
        popupRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      closeDropdown();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open]);

  const selectCountry = (code: CountryCode) => {
    setUserSelectedCountry(true);
    setSelectedCountry(code);
    closeDropdown();
    // Re-emit full number with the new dial code if digits already entered
    const digits = nationalNumber.replace(/\D/g, "");
    if (digits) {
      const newDial = `+${getCountryCallingCode(code)}`;
      onChange?.(`${newDial}${digits}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value.replace(/\D/g, ""); // Keep digits only
    const fullNumber = rawInput ? `${dialCode}${rawInput}` : "";
    onChange?.(fullNumber);
  };

  const handleBlur = () => {
    setIsTouched(true);
    onBlur?.();
  };

  return (
    <div ref={rootRef} className={clsx("w-full", className)}>
      {label && (
        <label className="mb-1 block text-[11px] font-medium text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <div
        className={clsx(
          "flex w-full items-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200",
          "hover:border-gray-300 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15",
          hasError &&
            "border-red-400 hover:border-red-400 focus-within:border-red-400 focus-within:ring-red-400/15",
          disabled && "cursor-not-allowed bg-gray-50 opacity-60"
        )}
      >
        {/* Selectable Country Flag & Dial Code Prefix */}
        <button
          ref={prefixRef}
          type="button"
          disabled={disabled}
          onClick={() => (open ? closeDropdown() : openDropdown())}
          className="flex select-none items-center gap-2 border-r border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed"
          title="Select country code"
        >
          <Flag code={selectedCountry} className="h-4 w-6 shrink-0 rounded-[2px]" />
          <span>{dialCode}</span>
          <FaChevronDown
            className={clsx(
              "h-2.5 w-2.5 shrink-0 text-gray-400 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>

        {/* Editable Phone Input */}
        <input
          type="tel"
          name={name}
          value={nationalNumber}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={resolvedPlaceholder}
          disabled={disabled}
          className="flex-1 bg-transparent px-3 py-1.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
        />
      </div>

      {mounted &&
        open &&
        pos &&
        createPortal(
          <div
            ref={popupRef}
            role="listbox"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
            className="fixed z-[1000] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
          >
            <div className="border-b border-gray-100 p-2">
              <div className="flex items-center gap-2 rounded-lg border-2 border-gray-200 px-2.5 focus-within:border-primary">
                <FaSearch className="h-3.5 w-3.5 text-gray-400" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search country..."
                  className="h-9 w-full bg-transparent text-sm text-gray-800 outline-none"
                />
              </div>
            </div>
            <ul className="max-h-72 overflow-y-auto py-1">
              {filtered.map((c) => (
                <li key={c.code} role="option" aria-selected={c.code === selectedCountry}>
                  <button
                    type="button"
                    onClick={() => selectCountry(c.code)}
                    className={clsx(
                      "flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm transition-colors",
                      c.code === selectedCountry
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <Flag code={c.code} className="h-4 w-6 shrink-0 rounded-[2px]" />
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="text-xs text-gray-400">{c.dial}</span>
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-3.5 py-3 text-sm text-gray-400">
                  No countries found
                </li>
              )}
            </ul>
          </div>,
          document.body
        )}

      {hasError && activeErrorMessage && (
        <p className="mt-1 text-sm text-red-500">{activeErrorMessage}</p>
      )}
    </div>
  );
};

export default PhoneInputField;