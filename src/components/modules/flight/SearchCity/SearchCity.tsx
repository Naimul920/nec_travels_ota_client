"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAirportSearch } from "@/hooks/useAirportSearch";
import type { Airport } from "@/actions/airport.action";

interface SearchCityProps {
  value: string;
  onChange: (iata: string, location: string) => void;
  placeholder?: string;
  excludeIata?: string;
  cityName?: string;
  defaultAirport?: Airport;
}

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
  const [query, setQuery] = useState(value);
  const [selected, setSelected] = useState<Airport | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  const [focused, setFocused] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useAirportSearch(
    { name: debouncedQuery, page: 1, limit: 20 },
    debouncedQuery.trim().length > 0,
  );

  const airports: Airport[] = (data?.data ?? []).filter(
    (a) => a.iata !== excludeIata,
  );

  // Resolve the committed airport (kept so a city is always displayed)
  const match = (data?.data ?? []).find((a) => a.iata === value);
  const resolved =
    selected ??
    match ??
    (value === defaultAirport?.iata ? defaultAirport : null);
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

  // Sync internal state when controlled values update externally (swap),
  // but never overwrite a just-selected city with its IATA.
  if (prevValue !== value) {
    setPrevValue(value);
    if (selected?.iata !== value && query !== value) {
      setQuery(value);
      setSelected(null);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9',\- ]/g, "");
    setQuery(filtered);
    setShowSuggestions(true);
  };

  const handleSelect = (airport: Airport) => {
    if (airport.iata === excludeIata) return;

    setQuery(airport.iata);
    setSelected(airport);
    setShowSuggestions(false);
    setFocused(false);
    onChange(airport.iata, airport.city);

    // Prevent refocus loops
    inputRef.current?.blur();
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    setShowSuggestions(true);
    setQuery((resolved?.city || cityName || "").toUpperCase());
    e.currentTarget.select();
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div
        className={`relative flex min-h-[72px] w-full flex-col justify-center rounded-md border bg-white px-3 shadow-sm transition-all duration-200 ${
          focused ? "border-primary shadow-md" : "border-slate-200"
        }`}
      >
        {(focused || value) && (
          <p className="pointer-events-none mb-0.5 select-none text-[10px] font-medium uppercase tracking-wide text-primary">
            {placeholder}
          </p>
        )}

        <input
          ref={inputRef}
          className="w-full truncate border-none bg-transparent py-2 text-sm font-bold uppercase text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-400"
          type="text"
          value={displayValue}
          placeholder={focused ? "" : placeholder}
          autoComplete="off"
          aria-autocomplete="list"
          onFocus={handleFocus}
          onChange={handleInputChange}
        />

        {(focused || value) && resolved && (
          <p className="pointer-events-none line-clamp-1 select-none text-[10px] font-normal uppercase text-gray-400">
            {resolved.iata} ·{" "}
            {resolved.location || resolved.country_location || resolved.airport_name}
          </p>
        )}
      </div>

      {/* Airport Auto-Suggestions Layer */}
      {showSuggestions && focused && query?.length > 0 && (
        <ul className="absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {isLoading ? (
            <li className="flex items-center gap-2 px-4 py-2 text-xs text-gray-400">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
              Searching...
            </li>
          ) : airports.length > 0 ? (
            airports.map((airport) => (
              <li
                key={airport.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(airport)}
                className="flex cursor-pointer items-center justify-between px-3 py-1.5 hover:bg-slate-100"
              >
                <div>
                  <p className="line-clamp-1 text-xs font-semibold text-gray-800">
                    {airport.city}
                  </p>
                  <p className="line-clamp-1 text-[10px] text-gray-400">
                    {airport.location ||
                      airport.country_location ||
                      airport.airport_name}
                  </p>
                </div>
                <span className="line-clamp-1 rounded bg-gray-100 px-2 py-1 font-mono text-[10px] font-bold text-gray-600">
                  {airport.iata}
                </span>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-xs text-gray-400">
              No airport found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchCity;