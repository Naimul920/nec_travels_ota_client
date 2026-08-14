"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAirportSearch } from "@/hooks/useAirportSearch";
import type { Airport } from "@/actions/airport.action";

interface SearchCityProps {
  label: string;
  value: string;
  onChange: (iata: string, location: string) => void;
  placeholder?: string;
  excludeIata?: string;
}

const SearchCity: React.FC<SearchCityProps> = ({
  label,
  value,
  onChange,
  placeholder,
  excludeIata,
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
  const resolved = selected ?? match;
  const displayValue = focused && showSuggestions ? query : resolved?.city ?? "";
  const isLoadingInitial = isLoading && !resolved;

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
    setQuery("");
    setShowSuggestions(true);
    e.currentTarget.select();
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative flex min-h-[74px] flex-col rounded-lg border border-primary/40 bg-white p-2.5 shadow-sm transition-colors focus-within:border-primary">
        <p className="mb-0.5 select-none text-[10px] font-bold uppercase tracking-wider text-gray-500">
          {label}
        </p>

        {isLoadingInitial ? (
          <div className="flex flex-col gap-1.5 py-0.5">
            <span className="h-4 w-3/4 animate-shimmer rounded [background-image:linear-gradient(90deg,#e2e8f0_0%,#f1f5f9_50%,#e2e8f0_100%)] [background-size:200%_100%]" />
            <span className="h-3 w-1/2 animate-shimmer rounded [background-image:linear-gradient(90deg,#e2e8f0_0%,#f1f5f9_50%,#e2e8f0_100%)] [background-size:200%_100%]" />
          </div>
        ) : (
          <input
            ref={inputRef}
            className="w-full truncate border-none bg-transparent p-0 text-sm font-bold uppercase text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-400"
            type="text"
            value={displayValue}
            placeholder={placeholder}
            autoComplete="off"
            aria-autocomplete="list"
            onFocus={handleFocus}
            onChange={handleInputChange}
          />
        )}

        {!isLoadingInitial && (
          <p className="mt-0.5 line-clamp-1 select-none text-[10px] text-gray-500">
            {resolved ? (
              <>
                <span className="font-bold text-primary">{resolved.iata}</span>
                <span className="text-gray-400"> · {resolved.name}</span>
              </>
            ) : (
              "Select City"
            )}
          </p>
        )}
      </div>

      {/* Airport Auto-Suggestions Layer */}
      {showSuggestions && focused && query?.length > 0 && (
        <ul className="absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {isLoading ? (
            <li className="px-4 py-2 text-xs text-gray-400 italic">
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
                    {airport.name}
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