"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { FaSearch, FaTimes, FaSpinner } from "react-icons/fa";
import { getMyPassengersAction } from "@/actions/booking.action";
import type { SavedPassenger } from "@/actions/booking.action";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect: (passenger: SavedPassenger) => void;
  onClear?: () => void;
  userId?: string | null;
  className?: string;
}

const SavedPassengerSearch: React.FC<Props> = ({
  value,
  onChange,
  onSelect,
  onClear,
  userId,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<SavedPassenger[]>([]);
  const [highlight, setHighlight] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [debounced, setDebounced] = useState(value);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value.trim()), 350);
    return () => clearTimeout(id);
  }, [value]);

  const computePos = () => {
    const rect = inputRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
  };

  // Fetch results when the debounced term changes or dropdown opens
  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    getMyPassengersAction(debounced, userId)
      .then((res) => {
        if (!active) return;
        setOptions(res.data || []);
        setHighlight(0);
      })
      .catch(() => {
        if (!active) return;
        setOptions([]);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [open, debounced, userId]);

  const openDropdown = () => {
    computePos();
    setOpen(true);
  };

  const closeDropdown = () => {
    setOpen(false);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        openDropdown();
        return;
      }
      setHighlight((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && options[highlight]) {
        handleSelect(options[highlight]);
      } else if (!open) {
        openDropdown();
      }
    } else if (e.key === "Escape") {
      closeDropdown();
    }
  };

  const handleSelect = (p: SavedPassenger) => {
    onSelect(p);
    onChange(`${p.first_name} ${p.last_name}`.trim());
    closeDropdown();
  };

  const handleClear = () => {
    onChange("");
    onClear?.();
    setOptions([]);
    setDebounced("");
    inputRef.current?.focus();
  };

  const displayName = (p: SavedPassenger) =>
    [p.title, p.first_name, p.last_name].filter(Boolean).join(" ");

  const popupMaxHeight = pos
    ? Math.min(288, Math.max(180, window.innerHeight - pos.top - 16))
    : 288;

  return (
    <div ref={rootRef} className={clsx("relative w-full", className)}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={openDropdown}
        onKeyDown={handleKeyDown}
        placeholder="Search Passenger First Name.."
        autoComplete="off"
        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 pr-8 text-xs text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 transition hover:text-red-500"
        >
          <FaTimes />
        </button>
      ) : (
        <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
      )}

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
            {loading ? (
              <div className="flex items-center gap-2 px-4 py-4 text-sm text-gray-400">
                <FaSpinner className="animate-spin text-gray-400" />
                Searching passengers...
              </div>
            ) : options.length === 0 ? (
              <div className="px-4 py-4 text-sm text-gray-400">
                {debounced ? "No passengers found" : "Type to search passengers"}
              </div>
            ) : (
              <ul
                className="overflow-y-auto py-1"
                style={{ maxHeight: popupMaxHeight }}
              >
                {options.map((p, i) => (
                  <li key={p.id} role="option" aria-selected={i === highlight}>
                    <button
                      type="button"
                      onMouseEnter={() => setHighlight(i)}
                      onClick={() => handleSelect(p)}
                      className={clsx(
                        "flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm transition-colors",
                        i === highlight ? "bg-blue-50" : ""
                      )}
                    >
                      <span className="flex-1 truncate font-medium text-gray-800">
                        {displayName(p)}
                      </span>
                      {p.email && (
                        <span className="truncate text-xs text-gray-400">
                          {p.email}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

export default SavedPassengerSearch;