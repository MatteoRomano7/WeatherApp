"use client";

import type { ForecastHour } from '@/lib/domain/types';
import {
  formatTime,
  formatWindDirection,
  formatPrecipitation,
} from '@/lib/utils/formatters';
import { getWeatherEmoji } from '@/lib/domain/weatherCodes';

export interface HourlyDetailProps {
  hours: ForecastHour[];
}

export function HourlyDetail({ hours }: HourlyDetailProps) {
  if (hours.length === 0) {
    return null;
  }

  return (
    <div className="animate-expand-down mt-2 px-4 sm:px-6 pb-4">
      <div className="flex gap-2 overflow-x-auto pb-2 forecast-scroll">
        {hours.map((hour) => (
          <div
            key={hour.timeISO}
            className="glass rounded-2xl px-3 py-3 min-w-[100px] flex flex-col items-center gap-1.5 text-center"
          >
            <time className="text-xs font-semibold text-muted uppercase tracking-wider">
              {formatTime(hour.timeISO)}
            </time>
            <span className="text-2xl" aria-hidden="true">
              {getWeatherEmoji(hour.weatherCode)}
            </span>
            <span className="text-sm font-semibold text-foreground">
              {Math.round(hour.temperature)}°C
            </span>
            <div className="flex items-center gap-1 text-xs text-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
                <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
                <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
              </svg>
              <span>
                {Math.round(hour.windSpeed)} km/h {formatWindDirection(hour.windDirection)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
              <span>{hour.humidity}%</span>
            </div>
            {hour.precipitationProbability > 0 && (
              <div className="text-xs text-accent-sky font-medium">
                {formatPrecipitation(hour.precipitationProbability)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
