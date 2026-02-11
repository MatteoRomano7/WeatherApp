import { fetchJson } from '@/lib/api/httpClient';
import {
  GeoResult,
  WeatherBundle,
  WeatherCurrent,
  ForecastDay,
} from '@/lib/domain/types';
import { getWeatherDescription } from '@/lib/domain/weatherCodes';

/**
 * Open-Meteo Geocoding API response structure
 */
interface GeocodingResponse {
  results?: Array<{
    name: string;
    country?: string;
    latitude: number;
    longitude: number;
  }>;
}

/**
 * Open-Meteo Forecast API response structure
 */
interface ForecastResponse {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    weather_code?: number;
  };
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    weather_code?: number[];
  };
}

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1';

/**
 * Searches for cities matching the given name using Open-Meteo Geocoding API.
 *
 * @param name - City name to search for
 * @returns Array of matching geographic locations (empty if none found)
 * @throws {AppError} with code 'NETWORK' or 'API' on failure
 */
export async function searchCity(
  name: string,
  signal?: AbortSignal
): Promise<GeoResult[]> {
  const url = `${GEOCODING_BASE_URL}/search?name=${encodeURIComponent(
    name
  )}&count=5&language=en&format=json`;

  const response = await fetchJson<GeocodingResponse>(url, { signal });

  if (!response.results || response.results.length === 0) {
    return [];
  }

  return response.results.map((result) => ({
    name: result.name,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}

/**
 * Fetches current weather and daily forecast for the given location.
 *
 * @param geo - Geographic location with coordinates
 * @returns Weather bundle containing current conditions and daily forecast
 * @throws {AppError} with code 'NETWORK' or 'API' on failure
 */
export async function getWeather(geo: GeoResult): Promise<WeatherBundle> {
  const url =
    `${FORECAST_BASE_URL}/forecast?` +
    `latitude=${geo.latitude}&` +
    `longitude=${geo.longitude}&` +
    `current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&` +
    `daily=temperature_2m_max,temperature_2m_min,weather_code&` +
    `timezone=auto`;

  const response = await fetchJson<ForecastResponse>(url);

  // Parse current weather
  const currentData = response.current;
  if (!currentData) {
    throw {
      code: 'API',
      message: 'Missing current weather data in API response',
    };
  }

  const weatherCode = currentData.weather_code ?? 0;
  const current: WeatherCurrent = {
    temperature: currentData.temperature_2m ?? 0,
    apparentTemperature: currentData.apparent_temperature ?? 0,
    humidity: currentData.relative_humidity_2m ?? 0,
    windSpeed: currentData.wind_speed_10m ?? 0,
    weatherCode,
    description: getWeatherDescription(weatherCode),
  };

  // Parse daily forecast
  const dailyData = response.daily;
  const daily: ForecastDay[] = [];

  if (dailyData?.time && dailyData.time.length > 0) {
    const times = dailyData.time;
    const maxTemps = dailyData.temperature_2m_max ?? [];
    const minTemps = dailyData.temperature_2m_min ?? [];
    const weatherCodes = dailyData.weather_code ?? [];

    for (let i = 0; i < times.length; i++) {
      const code = weatherCodes[i] ?? 0;
      daily.push({
        dateISO: times[i],
        tempMax: maxTemps[i] ?? 0,
        tempMin: minTemps[i] ?? 0,
        weatherCode: code,
        description: getWeatherDescription(code),
      });
    }
  }

  return {
    location: {
      name: geo.name,
      country: geo.country,
      lat: geo.latitude,
      lon: geo.longitude,
    },
    current,
    daily,
  };
}
