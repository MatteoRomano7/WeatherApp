'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { searchCity, getWeather } from '@/lib/api/openMeteo';
import { saveLastSearch, loadLastSearch } from '@/lib/utils/storage';
import type { WeatherBundle } from '@/lib/domain/types';
import type { AppError } from '@/lib/domain/errors';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface UseWeatherReturn {
  query: string;
  status: Status;
  data: WeatherBundle | null;
  error: AppError | null;
  selectedDay: string | null;
  search: (city: string) => void;
  retry: () => void;
  selectDay: (dateISO: string) => void;
}

/**
 * Type guard to check whether an unknown value conforms to the AppError shape.
 */
function isAppError(value: unknown): value is AppError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value
  );
}

/**
 * Reads the saved search from localStorage and returns initial state values.
 * Returns the saved city (trimmed) if valid, or empty string otherwise.
 */
function getInitialQuery(): string {
  const saved = loadLastSearch();
  if (saved && saved.trim().length >= 2) {
    return saved.trim();
  }
  return '';
}

/**
 * Executes the geocoding + weather fetch pipeline, updating state as it goes.
 * This is extracted as a standalone async function so it can be called from
 * both `search` and the mount effect without lint issues.
 *
 * @param trimmed - The trimmed city name to search for
 * @param controller - AbortController for cancelling in-flight requests
 * @param setStatus - State setter for the status field
 * @param setData - State setter for the weather data
 * @param setError - State setter for the error field
 * @param setSelectedDay - State setter to reset the selected day on completion
 */
async function executeFetch(
  trimmed: string,
  controller: AbortController,
  setStatus: (s: Status) => void,
  setData: (d: WeatherBundle | null) => void,
  setError: (e: AppError | null) => void,
  setSelectedDay: (d: string | null) => void,
): Promise<void> {
  try {
    const results = await searchCity(trimmed);

    if (controller.signal.aborted) return;

    if (results.length === 0) {
      setStatus('error');
      setError({ code: 'CITY_NOT_FOUND', message: 'Città non trovata.' });
      setData(null);
      setSelectedDay(null);
      return;
    }

    const bundle = await getWeather(results[0]);

    if (controller.signal.aborted) return;

    setData(bundle);
    setStatus('success');
    setError(null);
    setSelectedDay(null);
    saveLastSearch(trimmed);
  } catch (caught: unknown) {
    if (controller.signal.aborted) return;

    if (isAppError(caught)) {
      setStatus('error');
      setError(caught);
    } else {
      setStatus('error');
      setError({ code: 'NETWORK', message: 'Errore di rete imprevisto.' });
    }
    setData(null);
    setSelectedDay(null);
  }
}

/**
 * Primary hook for weather search functionality.
 *
 * Manages the full lifecycle of a weather search: validation, geocoding,
 * weather data fetching, error handling, and localStorage persistence.
 *
 * Cancels in-flight requests when a new search starts via AbortController.
 * On mount, restores and re-fetches the last searched city from localStorage.
 *
 * Includes a `selectedDay` state for tracking which forecast day the user
 * has selected for detail view, with toggle behavior via `selectDay`.
 *
 * @returns An object containing current state and actions to drive the search
 */
export function useWeather(): UseWeatherReturn {
  const [query, setQuery] = useState(getInitialQuery);
  const [status, setStatus] = useState<Status>(() =>
    getInitialQuery() ? 'loading' : 'idle'
  );
  const [data, setData] = useState<WeatherBundle | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback((city: string) => {
    const trimmed = city.trim();

    // Validation
    if (trimmed.length < 2) {
      setQuery(trimmed);
      setStatus('error');
      setError({ code: 'VALIDATION', message: 'Inserisci almeno 2 caratteri.' });
      setData(null);
      setSelectedDay(null);
      return;
    }

    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setQuery(trimmed);
    setStatus('loading');
    setError(null);

    executeFetch(trimmed, controller, setStatus, setData, setError, setSelectedDay);
  }, []);

  const retry = useCallback(() => {
    if (query.length > 0) {
      search(query);
    }
  }, [query, search]);

  /**
   * Toggles the selected forecast day. If the given date is already selected,
   * it deselects it (sets to null). Otherwise, selects the new date.
   *
   * @param dateISO - The ISO date string (e.g. "2025-01-12") to select or deselect
   */
  const selectDay = useCallback((dateISO: string) => {
    setSelectedDay((current) => current === dateISO ? null : dateISO);
  }, []);

  // On mount: if there was a saved search, kick off the fetch.
  // State is already initialized to 'loading' and the correct query via lazy initializers.
  useEffect(() => {
    const initialQuery = getInitialQuery();
    if (!initialQuery) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    executeFetch(initialQuery, controller, setStatus, setData, setError, setSelectedDay);

    return () => {
      controller.abort();
    };
  }, []);

  return { query, status, data, error, selectedDay, search, retry, selectDay };
}
