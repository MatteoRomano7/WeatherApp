"use client";

import { useState, FormEvent } from 'react';

export interface SearchBarProps {
  onSearch: (city: string) => void;
  initialQuery?: string;
}

export function SearchBar({ onSearch, initialQuery = '' }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(initialQuery);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label
        htmlFor="city-search"
        className="block text-[11px] font-semibold mb-2.5 text-muted uppercase tracking-[0.15em]"
      >
        Search city
      </label>
      <div className="glass rounded-2xl p-1.5 flex items-center gap-1 transition-all duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-sky/40 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background">
        <div className="flex items-center flex-1 gap-3 pl-4">
          <svg
            className="w-[18px] h-[18px] text-muted shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            id="city-search"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Rome, Milan, New York..."
            className="w-full py-3 bg-transparent text-foreground placeholder:text-muted/50 focus:outline-none text-[15px]"
          />
        </div>
        <button
          type="submit"
          className="shrink-0 px-6 py-3 bg-accent-sky/15 text-accent-sky font-semibold rounded-xl hover:bg-accent-sky/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-sky focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200 text-sm"
        >
          Search
        </button>
      </div>
    </form>
  );
}
