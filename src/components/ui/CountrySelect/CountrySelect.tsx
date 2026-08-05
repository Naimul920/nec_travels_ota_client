"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import * as Flags from "country-flag-icons/react/3x2";
import type { FlagComponent } from "country-flag-icons/react/3x2";
import { MdOutlineLanguage } from "react-icons/md";
import { FaChevronDown, FaSearch } from "react-icons/fa";

interface CountryOption {
  code: string;
  name: string;
}

const flagMap = Flags as unknown as Record<string, FlagComponent | undefined>;

const Flag: React.FC<{ code: string; className?: string }> = ({
  code,
  className,
}) => {
  const Component = flagMap[code.toUpperCase()];
  if (!Component) return null;
  return <Component className={className} />;
};

function buildCountryList(): CountryOption[] {
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  
  // Get ISO 3166-1 alpha-2 codes supported by country-flag-icons
  return Object.keys(Flags)
    .filter((code) => code.length === 2 && code === code.toUpperCase())
    .map((code) => {
      let name = code;
      try {
        name = regionNames.of(code) || code;
      } catch {
        name = code;
      }
      return { code, name };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

interface CountrySelectProps {
  className?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  value?: string;
  onChange?: (code: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  name?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  className,
  label,
  error,
  errorMessage,
  required,
  value,
  onChange,
  onBlur,
  placeholder = "Select country",
  name,
}) => {
  const allOptions = useMemo(buildCountryList, []);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(
    null
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = allOptions.find((c) => c.code === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allOptions;
    return allOptions.filter((c) => c.name.toLowerCase().includes(q));
  }, [allOptions, query]);

  useEffect(() => setMounted(true), []);

  const computePos = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
  };

  const openDropdown = () => {
    computePos();
    setQuery("");
    setHighlight(0);
    setOpen(true);
  };

  const closeDropdown = () => {
    setOpen(false);
    setQuery("");
    onBlur?.();
  };

  useEffect(() => {
    if (!open) return;
    const handleResizeOrScroll = () => computePos();
    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, true);
    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll, true);
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
      setHighlight(0);
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open]);

  const selectOption = (code: string) => {
    onChange?.(code);
    closeDropdown();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        openDropdown();
        return;
      }
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && filtered[highlight]) {
        selectOption(filtered[highlight].code);
      } else if (!open) {
        openDropdown();
      }
    } else if (e.key === "Escape") {
      closeDropdown();
    }
  };

  const popupMaxHeight = pos
    ? Math.min(288, Math.max(180, window.innerHeight - pos.top - 16))
    : 288;

  return (
    <div ref={rootRef} className={clsx("w-full", className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <button
        ref={buttonRef}
        type="button"
        name={name}
        onClick={() => (open ? closeDropdown() : openDropdown())}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={clsx(
          "flex h-12 w-full cursor-pointer items-center gap-2.5 rounded-lg border-2 border-gray-200 bg-white px-3.5 text-sm text-gray-800 shadow-sm outline-none transition-all duration-200",
          "hover:border-gray-300",
          "focus:border-primary focus:ring-4 focus:ring-primary/15",
          error &&
            "border-red-400 hover:border-red-400 focus:border-red-400 focus:ring-red-400/15"
        )}
      >
        {selected ? (
          <>
            <Flag code={selected.code} className="h-4 w-6 shrink-0 rounded-[2px]" />
            <span className="flex-1 truncate text-left text-gray-800 font-medium">
              {selected.name}
            </span>
          </>
        ) : (
          <>
            <MdOutlineLanguage className="shrink-0 text-gray-400 text-lg" />
            <span className="flex-1 truncate text-left text-gray-400">
              {placeholder}
            </span>
          </>
        )}
        <FaChevronDown
          className={clsx(
            "h-3 w-3 shrink-0 text-gray-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

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
                  onKeyDown={handleKeyDown}
                  placeholder="Search country..."
                  className="h-9 w-full bg-transparent text-sm text-gray-800 outline-none"
                />
              </div>
            </div>
            <ul
              className="overflow-y-auto py-1"
              style={{ maxHeight: popupMaxHeight }}
            >
              {filtered.map((c, i) => (
                <li key={c.code} role="option" aria-selected={c.code === value}>
                  <button
                    type="button"
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => selectOption(c.code)}
                    className={clsx(
                      "flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm transition-colors",
                      i === highlight ? "bg-primary/10" : "",
                      c.code === value
                        ? "font-semibold text-primary"
                        : "text-gray-700"
                    )}
                  >
                    <Flag
                      code={c.code}
                      className="h-4 w-6 shrink-0 rounded-[2px]"
                    />
                    <span className="flex-1 truncate">{c.name}</span>
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

      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default CountrySelect;