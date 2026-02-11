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
  search: (city: string) => void;
  retry: () => void;
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
 */
async function executeFetch(
  trimmed: string,
  controller: AbortController,
  setStatus: (s: Status) => void,
  setData: (d: WeatherBundle | null) => void,
  setError: (e: AppError | null) => void,
): Promise<void> {
  try {
    const results = await searchCity(trimmed);

    if (controller.signal.aborted) return;

    if (results.length === 0) {
      setStatus('error');
      setError({ code: 'CITY_NOT_FOUND', message: 'Città non trovata.' });
      setData(null);
      return;
    }

    const bundle = await getWeather(results[0]);

    if (controller.signal.aborted) return;

    setData(bundle);
    setStatus('success');
    setError(null);
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
 * @returns An object containing current state and actions to drive the search
 */
export function useWeather(): UseWeatherReturn {
  const [query, setQuery] = useState(getInitialQuery);
  const [status, setStatus] = useState<Status>(() =>
    getInitialQuery() ? 'loading' : 'idle'
  );
  const [data, setData] = useState<WeatherBundle | null>(null);
  const [error, setError] = useState<AppError | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback((city: string) => {
    const trimmed = city.trim();

    // Validation
    if (trimmed.length < 2) {
      setQuery(trimmed);
      setStatus('error');
      setError({ code: 'VALIDATION', message: 'Inserisci almeno 2 caratteri.' });
      setData(null);
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

    executeFetch(trimmed, controller, setStatus, setData, setError);
  }, []);

  const retry = useCallback(() => {
    if (query.length > 0) {
      search(query);
    }
  }, [query, search]);

  // On mount: if there was a saved search, kick off the fetch.
  // State is already initialized to 'loading' and the correct query via lazy initializers.
  useEffect(() => {
    const initialQuery = getInitialQuery();
    if (!initialQuery) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    executeFetch(initialQuery, controller, setStatus, setData, setError);

    return () => {
      controller.abort();
    };
  }, []);

  return { query, status, data, error, search, retry };
}
