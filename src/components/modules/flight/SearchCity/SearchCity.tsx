"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui";
import { useAirport } from "search-airport-code";
import { TfiReload } from "react-icons/tfi";

interface Airport {
  _id: string;
  location: string;
  airport_name: string;
  iata: string;
}

interface SearchCityProps {
  label: string;
  value: string;
  onChange: (iata: string, location: string) => void;
  placeholder?: string;
  handelSwap?: () => void;
}

const SearchCity: React.FC<SearchCityProps> = ({
  label,
  value,
  onChange,
  placeholder,
  handelSwap,
}) => {
  const [query, setQuery] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [swap, setSwap] = useState(false);

  const { data = [], isLoading } = useAirport(query) as {
    data: Airport[];
    isLoading: boolean;
  };

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal state when controlled values update externally
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Click outside handling to dim structural selection popups securely
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const airports = data ?? [];

  const handleSelect = (airport: Airport) => {
    setQuery(airport.iata);
    onChange(airport.iata, airport.location);
    setShowSuggestions(false);

    // Prevent refocus loops
    inputRef.current?.blur();
  };

  const handelFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative ring-1 ring-primary rounded-lg p-3 bg-white">
        <p className="text-gray-500 md:text-xs text-[10px] font-bold uppercase mb-1 select-none">
          {label}
        </p>

        <Input
          ref={inputRef}
          className="border-none uppercase shadow-none! p-0! text-2xl! font-extrabold text-black h-8! bg-transparent focus-visible:ring-0"
          type="text"
          value={query}
          placeholder={placeholder}
          onFocus={(e) => {
            if (query?.length > 0) {
              setShowSuggestions(true);
            }
            handelFocus(e);
          }}
          onChange={(e) => {
            const filtered = e.target.value
              .toUpperCase()
              .replace(/[^A-Z0-9']/g, "");
            setQuery(filtered);
            setShowSuggestions(true);
          }}
        />

        <p className="md:text-xs text-[10px] text-gray-500 line-clamp-1 mt-1">
          {(!showSuggestions &&
            airports.find((a) => a.iata === query)?.location) ||
            "Select Airport"}
        </p>

        {handelSwap && (
          <div
            className="absolute md:-right-5 md:top-1/2 top-3 right-1/2 md:-translate-y-1/2 translate-y-18 bg-white border border-primary p-1.5 rounded-full z-10 cursor-pointer transition-colors"
            onClick={() => {
              handelSwap();
              setSwap(!swap);
            }}
          >
            <TfiReload
              className={`text-gray-600 text-xs transition-transform duration-500 ${
                swap ? "rotate-0" : "-rotate-180"
              }`}
            />
          </div>
        )}
      </div>

      {/* Airport Auto-Suggestions Layer */}
      {showSuggestions && query?.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto py-1">
          {isLoading ? (
            <li className="px-4 py-2 text-sm text-gray-400 italic">
              Searching...
            </li>
          ) : airports.length > 0 ? (
            airports.map((airport) => (
              <li
                key={airport._id}
                onMouseDown={(e) => e.preventDefault()} // Stops focus shifts breaking mouse click captures
                onClick={() => handleSelect(airport)}
                className="px-4 py-1.5 hover:bg-slate-100 cursor-pointer flex justify-between items-center"
              >
                <div>
                  <p className="text-xs font-semibold line-clamp-1">
                    {airport.location}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-1">
                    {airport.airport_name}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded line-clamp-1">
                  {airport.iata}
                </span>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-sm text-gray-400">
              No airport found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchCity;
