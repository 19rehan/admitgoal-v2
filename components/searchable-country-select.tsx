"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Search } from "lucide-react";

interface SearchableCountrySelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  countries: string[];
  placeholder?: string;
}

export function SearchableCountrySelect({
  label,
  value,
  onChange,
  countries,
  placeholder = "Search and select a country...",
}: SearchableCountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = countries.filter((country) =>
    country.toLowerCase().startsWith(search.toLowerCase())
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

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="relative">
        <div
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white cursor-pointer flex items-center justify-between hover:border-purple-500/50 transition-colors"
          onClick={() => {
            setIsOpen(!isOpen);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
        >
          <span className={value ? "text-white" : "text-gray-500"}>
            {value || placeholder}
          </span>
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
                  placeholder="Type to filter..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 outline-none focus:border-purple-500/50"
                  autoFocus
                />
              </div>
            </div>

            {/* Country list */}
            <div className="max-h-60 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((country) => (
                  <div
                    key={country}
                    className={`px-4 py-2.5 cursor-pointer transition-colors ${
                      country === value
                        ? "bg-purple-600/20 text-purple-300"
                        : "text-gray-300 hover:bg-white/5"
                    }`}
                    onClick={() => {
                      onChange(country);
                      setIsOpen(false);
                      setSearch("");
                    }}
                  >
                    {country}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-center">No countries found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}