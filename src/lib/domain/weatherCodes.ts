const weatherCodeMap: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mostly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Fog with frost',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Heavy drizzle',
  56: 'Light freezing drizzle',
  57: 'Heavy freezing drizzle',
  61: 'Light rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Light snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Light rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Light snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with light hail',
  99: 'Thunderstorm with heavy hail',
};

export function getWeatherDescription(code: number): string {
  return weatherCodeMap[code] ?? 'Unknown conditions';
}

const weatherEmojiMap: Record<number, string> = {
  0: '\u2600\uFE0F',
  1: '\uD83C\uDF24\uFE0F',
  2: '\u26C5',
  3: '\u2601\uFE0F',
  45: '\uD83C\uDF2B\uFE0F',
  48: '\uD83C\uDF2B\uFE0F',
  51: '\uD83C\uDF26\uFE0F',
  53: '\uD83C\uDF26\uFE0F',
  55: '\uD83C\uDF27\uFE0F',
  56: '\uD83C\uDF27\uFE0F',
  57: '\uD83C\uDF27\uFE0F',
  61: '\uD83C\uDF27\uFE0F',
  63: '\uD83C\uDF27\uFE0F',
  65: '\uD83C\uDF27\uFE0F',
  66: '\uD83E\uDDCA',
  67: '\uD83E\uDDCA',
  71: '\u2744\uFE0F',
  73: '\u2744\uFE0F',
  75: '\u2744\uFE0F',
  77: '\u2744\uFE0F',
  80: '\uD83C\uDF26\uFE0F',
  81: '\uD83C\uDF27\uFE0F',
  82: '\u26C8\uFE0F',
  85: '\uD83C\uDF28\uFE0F',
  86: '\uD83C\uDF28\uFE0F',
  95: '\u26C8\uFE0F',
  96: '\u26C8\uFE0F',
  99: '\u26C8\uFE0F',
};

export function getWeatherEmoji(code: number): string {
  return weatherEmojiMap[code] ?? '\uD83C\uDF21\uFE0F';
}
