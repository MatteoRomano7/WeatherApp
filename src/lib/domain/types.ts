export interface GeoResult {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export interface WeatherCurrent {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  description: string;
}

export interface ForecastDay {
  dateISO: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  description: string;
}

export interface ForecastHour {
  timeISO: string;
  temperature: number;
  weatherCode: number;
  description: string;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  precipitationProbability: number;
}

export interface WeatherBundle {
  location: {
    name: string;
    country?: string;
    lat: number;
    lon: number;
  };
  current: WeatherCurrent;
  daily: ForecastDay[];
  hourly: ForecastHour[];
}
