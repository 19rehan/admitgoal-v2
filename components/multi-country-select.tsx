"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Search } from "lucide-react";

interface MultiCountrySelectProps {
  label: string;
  selected: string[];
  onChange: (selected: string[]) => void;
  countries: string[];
  placeholder?: string;
  maxSelections?: number;
}

export function MultiCountrySelect({
  label,
  selected,
  onChange,
  countries,
  placeholder = "Search and add countries...",
  maxSelections = 10,
}: MultiCountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = countries.filter(
    (country) =>
      country.toLowerCase().startsWith(search.toLowerCase()) &&
      !selected.includes(country)
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addCountry = (country: string) => {
    if (selected.length < maxSelections) {
      onChange([...selected, country]);
      setSearch("");
    }
  };

  const removeCountry = (country: string) => {
    onChange(selected.filter((c) => c !== country));
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-300">
        {label}
        <span className="text-gray-500 ml-2">({selected.length}/{maxSelections})</span>
      </label>

      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map((country) => (
            <span
              key={country}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-lg text-sm text-purple-300"
            >
              {country}
              <X
                className="w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors"
                onClick={() => removeCountry(country)}
              />
            </span>
          ))}
        </div>
      )}

      {/* Dropdown trigger */}
      <div className="relative">
        <div
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white cursor-pointer flex items-center justify-between hover:border-purple-500/50 transition-colors"
          onClick={() => {
            setIsOpen(!isOpen);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
        >
          <span className="text-gray-500">{placeholder}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-2 w-full bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            {/* Search input */}
            <div className="p-3 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type to filter (e.g. 'P' for Pakistan)..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 outline-none focus:border-purple-500/50"
                  autoFocus
                />
              </div>
            </div>

            {/* Country list */}
            <div className="max-h-60 overflow-y-auto">
              {selected.length >= maxSelections ? (
                <div className="px-4 py-3 text-amber-400 text-center text-sm">
                  Maximum {maxSelections} countries reached
                </div>
              ) : filtered.length > 0 ? (
                filtered.map((country) => (
                  <div
                    key={country}
                    className="px-4 py-2.5 cursor-pointer text-gray-300 hover:bg-white/5 transition-colors"
                    onClick={() => addCountry(country)}
                  >
                    {country}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-center">
                  {search ? "No countries found" : "All countries selected"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}