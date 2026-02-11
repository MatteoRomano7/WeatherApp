const STORAGE_KEY = 'weather_last_search';

/**
 * Saves the last searched city name to localStorage.
 *
 * @param query - The city name to persist
 */
export function saveLastSearch(query: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, query);
  } catch {
    // Silently ignore storage errors (quota exceeded, security restrictions, etc.)
  }
}

/**
 * Loads the last searched city name from localStorage.
 *
 * @returns The saved city name, or null if unavailable or on error (SSR-safe)
 */
export function loadLastSearch(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
