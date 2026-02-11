import type { ForecastHour } from '@/lib/domain/types';

/**
 * Formats a temperature value as Celsius and Fahrenheit with no decimals.
 *
 * @param value - Temperature in degrees Celsius
 * @returns Formatted string, e.g. "23°C — 73°F" (thin space + em dash + thin space)
 */
export function formatTemp(value: number): string {
  const celsius = Math.round(value);
  const fahrenheit = Math.round((value * 9) / 5 + 32);
  return `${celsius}\u00b0C\u2009\u2014\u2009${fahrenheit}\u00b0F`;
}

/**
 * Formats a wind speed value in km/h and mph with no decimals.
 *
 * @param value - Wind speed in km/h
 * @returns Formatted string, e.g. "12 km/h — 7 mph" (thin space + em dash + thin space)
 */
export function formatWind(value: number): string {
  const kmh = Math.round(value);
  const mph = Math.round(value * 0.621371);
  return `${kmh} km/h\u2009\u2014\u2009${mph} mph`;
}

/**
 * Formats a humidity percentage value.
 *
 * @param value - Humidity as a percentage (0-100)
 * @returns Formatted string, e.g. "65%"
 */
export function formatHumidity(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Formats an ISO date string into a short English date.
 *
 * Uses Intl.DateTimeFormat with 'en-EN' locale to produce output like "Mon 12 Jan".
 *
 * @param dateISO - An ISO 8601 date string (e.g. "2025-01-12")
 * @returns A human-readable short date, e.g. "Mon 12 Jan"
 */
export function formatDate(dateISO: string): string {
  const date = new Date(dateISO);
  return new Intl.DateTimeFormat('en-EN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);
}

/**
 * Extracts hours and minutes from an ISO datetime string in 24-hour format.
 *
 * @param timeISO - An ISO 8601 datetime string (e.g. "2025-01-12T14:00")
 * @returns Formatted time string in 24h format, e.g. "14:00"
 */
export function formatTime(timeISO: string): string {
  const date = new Date(timeISO);
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

/** The 8 compass directions in clockwise order starting from North. */
const COMPASS_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

/**
 * Converts a wind direction in degrees to a compass direction string.
 *
 * Uses 8 compass points, each covering a 45-degree arc.
 * North spans from 337.5 to 22.5 degrees, NE from 22.5 to 67.5, etc.
 *
 * @param degrees - Wind direction in degrees (0-360)
 * @returns One of 8 compass direction strings: "N", "NE", "E", "SE", "S", "SW", "W", "NW"
 */
export function formatWindDirection(degrees: number): string {
  // Normalize degrees to 0-360 range
  const normalized = ((degrees % 360) + 360) % 360;
  // Shift by half a sector (22.5) so North is centered, then divide by sector size (45)
  const index = Math.round(normalized / 45) % 8;
  return COMPASS_DIRECTIONS[index];
}

/**
 * Formats a precipitation probability value as a percentage.
 *
 * @param value - Precipitation probability (0-100)
 * @returns Formatted string, e.g. "45%"
 */
export function formatPrecipitation(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Groups an array of hourly forecasts by date.
 *
 * Extracts the date portion (first 10 characters, e.g. "2025-01-12") from each
 * hour's `timeISO` field and groups them into a Map keyed by that date string.
 * The Map iteration order follows insertion order, preserving chronological order
 * if the input array is already sorted.
 *
 * @param hours - Array of ForecastHour objects to group
 * @returns A Map where keys are date strings (YYYY-MM-DD) and values are arrays
 *          of ForecastHour objects belonging to that date
 */
export function groupHourlyByDay(hours: ForecastHour[]): Map<string, ForecastHour[]> {
  const map = new Map<string, ForecastHour[]>();

  for (const hour of hours) {
    const dateKey = hour.timeISO.slice(0, 10);
    const existing = map.get(dateKey);
    if (existing) {
      existing.push(hour);
    } else {
      map.set(dateKey, [hour]);
    }
  }

  return map;
}
