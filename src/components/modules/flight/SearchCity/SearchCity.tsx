"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAirportSearch } from "@/hooks/useAirportSearch";
import type { Airport } from "@/actions/airport.action";
import { FiMapPin, FiSearch } from "react-icons/fi";
import { MdFlightTakeoff } from "react-icons/md";

interface SearchCityProps {
  value: string;
  onChange: (iata: string, location: string) => void;
  placeholder?: string;
  excludeIata?: string;
  cityName?: string;
  defaultAirport?: Airport;
}

const AIRPORT_CACHE_KEY = "nec_recent_airports";

const getCachedAirport = (iata: string): Airport | null => {
  if (!iata || typeof window === "undefined") return null;

  try {
    const cached = JSON.parse(
      window.localStorage.getItem(AIRPORT_CACHE_KEY) || "{}",
    ) as Record<string, Airport>;
    return cached[iata] ?? null;
  } catch {
    return null;
  }
};

const cacheAirport = (airport: Airport) => {
  try {
    const cached = JSON.parse(
      window.localStorage.getItem(AIRPORT_CACHE_KEY) || "{}",
    ) as Record<string, Airport>;
    window.localStorage.setItem(
      AIRPORT_CACHE_KEY,
      JSON.stringify({ ...cached, [airport.iata]: airport }),
    );
  } catch {
    // Storage may be unavailable in private mode. Selection still works.
  }
};

// Complete defaults let the first render show useful airport details without
// making an API request.
export const DEFAULT_AIRPORT_DAC: Airport = {
  id: "418efd58-b708-4d29-94af-95bb478f1171",
  iata: "DAC",
  city: "Dhaka",
  location: "Shahjalal International, Bangladesh",
  country_name: "Bangladesh",
  country_location: "Dhaka, Bangladesh",
  airport_name: "Shahjalal International Airport",
};

// Default destination for first-time visitors (no saved last search).
export const DEFAULT_AIRPORT_CXB: Airport = {
  id: "dfb2207b-b6be-43ea-8d7c-82eedfe2d280",
  iata: "CXB",
  city: "Cox's Bazar",
  location: "Cox's Bazar, Bangladesh",
  country_name: "Bangladesh",
  country_location: "Cox's Bazar, Bangladesh",
  airport_name: "Cox's Bazar Airport",
};

const SearchCity: React.FC<SearchCityProps> = ({
  value,
  onChange,
  placeholder,
  excludeIata,
  cityName,
  defaultAirport,
}) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Airport | null>(() =>
    value === defaultAirport?.iata ? defaultAirport : null,
  );
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [hasUserTyped, setHasUserTyped] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousValueRef = useRef(value);
  const listboxId = `airport-options-${placeholder?.toLowerCase().replace(/\s+/g, "-") || "city"}`;

  const { data, isLoading } = useAirportSearch(
    { name: debouncedQuery, page: 1, limit: 20 },
    hasUserTyped && debouncedQuery.trim().length > 0,
  );

  const airports: Airport[] = (data?.data ?? []).filter(
    (a) => a.iata !== excludeIata,
  );

  // Resolve the committed airport (kept so a city is always displayed)
  const resolved = selected ?? (value === defaultAirport?.iata ? defaultAirport : null);
  const displayValue = focused && showSuggestions
    ? query
    : resolved?.city || cityName || "";

  // Click outside handling to close suggestion popups and restore the city
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce the query before triggering the server-side search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Sync controlled changes such as swapping airports without setting state
  // during render.
  useEffect(() => {
    if (previousValueRef.current === value) return;
    previousValueRef.current = value;
    if (selected?.iata !== value) {
      setQuery("");
      setHasUserTyped(false);
      setSelected(
        value === defaultAirport?.iata
          ? defaultAirport
          : getCachedAirport(value),
      );
    }
  }, [value, selected?.iata, defaultAirport]);

  // Restore the complete airport saved from an earlier selection. The parent
  // already restores its IATA/city from the last flight search.
  useEffect(() => {
    if (!value || selected?.iata === value) return;
    setSelected(
      value === defaultAirport?.iata ? defaultAirport : getCachedAirport(value),
    );
  }, [value, selected?.iata, defaultAirport]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9',\- ]/g, "");
    setQuery(filtered);
    setHasUserTyped(true);
    setShowSuggestions(true);
    setActiveIndex(-1);

    // Once the user edits the selected text, it is no longer a committed
    // airport. This prevents the old IATA from returning after Backspace.
    if (value || selected) {
      setSelected(null);
      previousValueRef.current = "";
      onChange("", "");
    }
  };

  const handleSelect = (airport: Airport) => {
    if (airport.iata === excludeIata) return;

    setQuery(airport.iata);
    setSelected(airport);
    setHasUserTyped(false);
    setShowSuggestions(false);
    setFocused(false);
    previousValueRef.current = airport.iata;
    onChange(airport.iata, airport.city);
    cacheAirport(airport);

    // Prevent refocus loops
    inputRef.current?.blur();
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    setShowSuggestions(true);
    setQuery((resolved?.city || cityName || "").toUpperCase());
    setHasUserTyped(false);
    window.requestAnimationFrame(() => e.currentTarget.select());
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setShowSuggestions(false);
      inputRef.current?.blur();
      return;
    }

    if (!showSuggestions || airports.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % airports.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? airports.length - 1 : index - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      handleSelect(airports[activeIndex]);
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div
        className={`relative flex min-h-20 w-full cursor-text flex-col justify-center rounded-xl border bg-white px-4 transition-all duration-200 ${
          focused ? "border-brand ring-4 ring-brand/10" : "border-slate-200 hover:border-slate-300"
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        <p className="pointer-events-none mb-1 select-none text-[10px] font-bold uppercase tracking-[0.12em] text-brand">
          {placeholder}
        </p>

        <input
          ref={inputRef}
          className="w-full truncate border-none bg-transparent py-0 text-base font-bold uppercase text-[#12233D] outline-none placeholder:font-normal placeholder:normal-case placeholder:text-slate-400"
          type="text"
          value={displayValue}
          placeholder={focused ? "" : "Select City"}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showSuggestions && focused}
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
          onFocus={handleFocus}
          onClick={(event) => event.currentTarget.select()}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <p className="pointer-events-none mt-1 line-clamp-1 select-none text-[10px] font-medium uppercase text-slate-400">
          {resolved ? (
            <>
              {resolved.iata} ·{" "}
              {resolved.location ||
                resolved.country_location ||
                resolved.airport_name}
            </>
          ) : (
            "Select City"
          )}
        </p>
      </div>

      {/* Airport Auto-Suggestions Layer */}
      {showSuggestions && focused && query?.length > 0 && (
        <ul id={listboxId} role="listbox" className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
          {isLoading ? (
            <li className="flex items-center gap-3 px-3 py-4 text-sm text-slate-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-brand" />
              Searching airports…
            </li>
          ) : airports.length > 0 ? (
            airports.map((airport, index) => (
              <li
                id={`${listboxId}-${index}`}
                key={airport.id}
                role="option"
                aria-selected={activeIndex === index}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(airport)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition ${activeIndex === index ? "bg-emerald-50" : "hover:bg-slate-50"}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-brand">
                  <MdFlightTakeoff aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-[#12233D]">{airport.city}</p>
                    {airport.country_name && <span className="hidden truncate text-xs text-slate-400 sm:inline">{airport.country_name}</span>}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{airport.airport_name || airport.location || airport.country_location}</p>
                  <p className="mt-1 flex items-center gap-1 truncate text-[10px] text-slate-400"><FiMapPin aria-hidden="true" />{airport.location || airport.country_location || airport.country_name}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-[#12233D] px-2.5 py-1.5 font-mono text-xs font-bold text-white">
                  {airport.iata}
                </span>
              </li>
            ))
          ) : (
            <li className="flex flex-col items-center px-4 py-7 text-center">
              <FiSearch aria-hidden="true" className="text-xl text-slate-300" />
              <p className="mt-2 text-sm font-semibold text-slate-600">No airport found</p>
              <p className="mt-1 text-xs text-slate-400">Try a city, airport name, or IATA code.</p>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchCity;
