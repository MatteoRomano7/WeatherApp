/**
 * Formats a temperature value as Celsius and Fahrenheit with no decimals.
 *
 * @param value - Temperature in degrees Celsius
 * @returns Formatted string, e.g. "23\u00b0C / 73\u00b0F"
 */
export function formatTemp(value: number): string {
  const celsius = Math.round(value);
  const fahrenheit = Math.round((value * 9) / 5 + 32);
  return `${celsius}\u00b0C / ${fahrenheit}\u00b0F`;
}

/**
 * Formats a wind speed value in km/h and mph with no decimals.
 *
 * @param value - Wind speed in km/h
 * @returns Formatted string, e.g. "12 km/h / 7 mph"
 */
export function formatWind(value: number): string {
  const kmh = Math.round(value);
  const mph = Math.round(value * 0.621371);
  return `${kmh} km/h / ${mph} mph`;
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
 * Formats an ISO date string into a short Italian date.
 *
 * Uses Intl.DateTimeFormat with 'it-IT' locale to produce output like "lun 12 gen".
 *
 * @param dateISO - An ISO 8601 date string (e.g. "2025-01-12")
 * @returns A human-readable short Italian date, e.g. "lun 12 gen"
 */
export function formatDate(dateISO: string): string {
  const date = new Date(dateISO);
  return new Intl.DateTimeFormat('en-EN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);
}
