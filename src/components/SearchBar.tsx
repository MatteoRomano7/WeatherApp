"use client";

import { useState, useEffect, useRef, useCallback, FormEvent, KeyboardEvent } from 'react';
import { searchCity } from '@/lib/api/openMeteo';
import type { GeoResult } from '@/lib/domain/types';

export interface SearchBarProps {
  onSearch: (city: string) => void;
  initialQuery?: string;
}

export function SearchBar({ onSearch, initialQuery = '' }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestionAbortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const showDropdown = isFocused && inputValue.trim().length >= 2;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuggestions([]);
    setIsFocused(false);
    setActiveIndex(-1);
    onSearch(inputValue);
  };

  const handleSuggestionSelect = useCallback((suggestion: GeoResult) => {
    const label = suggestion.country
      ? `${suggestion.name}, ${suggestion.country}`
      : suggestion.name;
    setInputValue(label);
    setSuggestions([]);
    setIsFocused(false);
    setActiveIndex(-1);
    onSearch(label);
  }, [onSearch]);

  useEffect(() => {
    const trimmed = inputValue.trim();

    if (!isFocused || trimmed.length < 2) {
      suggestionAbortRef.current?.abort();
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      setHasSearched(false);
      setActiveIndex(-1);
      return;
    }

    const controller = new AbortController();
    suggestionAbortRef.current?.abort();
    suggestionAbortRef.current = controller;

    const timeoutId = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      setHasSearched(false);
      setActiveIndex(-1);
      try {
        const results = await searchCity(trimmed, controller.signal);
        if (!controller.signal.aborted) {
          setSuggestions(results);
          setHasSearched(true);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setHasSearched(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSuggestions(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [inputValue, isFocused]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const items = listRef.current.querySelectorAll('li');
    items[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSuggestionSelect(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setIsFocused(false);
      setActiveIndex(-1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label
        htmlFor="city-search"
        className="block text-[11px] font-semibold mb-2.5 text-muted uppercase tracking-[0.15em]"
      >
        Search city
      </label>
      <div ref={containerRef}>
        <div
          className="rounded-2xl p-1.5 flex items-center gap-1 transition-all duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-sky/40 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background"
          style={{
            background: '#0c1230',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
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
              onChange={(e) => { setInputValue(e.target.value); setIsFocused(true); }}
              onFocus={() => setIsFocused(true)}
              onBlur={(event) => {
                const nextTarget = event.relatedTarget as Node | null;
                if (nextTarget && containerRef.current?.contains(nextTarget)) {
                  return;
                }
                setIsFocused(false);
                setActiveIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Rome, Milan, New York..."
              className="w-full py-3 bg-transparent text-foreground placeholder:text-muted/50 focus:outline-none text-[15px]"
              role="combobox"
              aria-expanded={showDropdown && suggestions.length > 0}
              aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
              aria-controls="suggestions-list"
              aria-autocomplete="list"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 px-6 py-3 bg-accent-sky/15 text-accent-sky font-semibold rounded-xl hover:bg-accent-sky/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-sky focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200 text-sm"
          >
            Search
          </button>
        </div>

        {showDropdown && (
          <div
            className="mt-1.5 rounded-2xl overflow-hidden dropdown-reveal"
            style={{
              background: '#090e24',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 24px 80px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 0, 0, 0.3)',
            }}
          >
            {isLoadingSuggestions && (
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="w-4 h-4 rounded-full border-2 border-muted/20 border-t-accent-sky animate-spin shrink-0" />
                <span className="text-[13px] text-muted">Searching cities...</span>
              </div>
            )}

            {!isLoadingSuggestions && hasSearched && suggestions.length === 0 && (
              <div className="flex items-center gap-3 px-5 py-4">
                <svg className="w-4 h-4 text-muted/40 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <span className="text-[13px] text-muted/60">No cities found</span>
              </div>
            )}

            {!isLoadingSuggestions && suggestions.length > 0 && (
              <ul
                id="suggestions-list"
                ref={listRef}
                role="listbox"
                className="p-1.5 max-h-[280px] overflow-auto dropdown-scroll"
              >
                {suggestions.map((suggestion, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <li
                      key={`${suggestion.name}-${suggestion.latitude}-${suggestion.longitude}`}
                      id={`suggestion-${index}`}
                      role="option"
                      aria-selected={isActive}
                    >
                      <button
                        type="button"
                        tabIndex={-1}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleSuggestionSelect(suggestion)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`w-full px-3.5 py-3 flex items-center gap-3 text-left transition-all duration-150 rounded-xl focus-visible:outline-none group ${
                          isActive ? 'bg-accent-sky/[0.10]' : ''
                        }`}
                      >
                        <svg
                          className={`w-4 h-4 shrink-0 transition-colors duration-150 ${
                            isActive ? 'text-accent-sky' : 'text-muted/50 group-hover:text-accent-sky'
                          }`}
                          fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <span
                            className={`text-[14px] font-semibold transition-colors duration-150 ${
                              isActive ? 'text-accent-sky' : 'text-foreground group-hover:text-accent-sky'
                            }`}
                          >
                            {suggestion.name}
                          </span>
                          {suggestion.country && (
                            <span className="text-[12px] text-muted/70 ml-2">
                              {suggestion.country}
                            </span>
                          )}
                        </div>
                        <svg
                          className={`w-3.5 h-3.5 shrink-0 transition-all duration-150 ${
                            isActive ? 'text-muted/50 translate-x-0.5' : 'text-muted/20 group-hover:text-muted/50 group-hover:translate-x-0.5'
                          }`}
                          fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
