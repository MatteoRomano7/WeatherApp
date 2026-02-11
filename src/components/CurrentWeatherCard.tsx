"use client";

import type { WeatherBundle } from '@/lib/domain/types';
import {
  formatTemp,
  formatWind,
  formatHumidity,
} from '@/lib/utils/formatters';
import { getWeatherEmoji } from '@/lib/domain/weatherCodes';

export interface CurrentWeatherCardProps {
  data: WeatherBundle;
}

export function CurrentWeatherCard({ data }: CurrentWeatherCardProps) {
  const { location, current } = data;

  return (
    <section className="glass rounded-3xl overflow-hidden glass-hover">
      <div className="h-[3px] bg-gradient-to-r from-accent-sky/50 via-accent-amber/30 to-transparent" />
      <div className="p-6 sm:p-8">
        <header className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {location.name}
            </h2>
            {location.country && (
              <span className="text-sm text-muted">
                {location.country}
              </span>
            )}
          </div>
          <span className="text-5xl sm:text-6xl leading-none" aria-hidden="true">
            {getWeatherEmoji(current.weatherCode)}
          </span>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 items-end">
          <div>
            <div className="mb-3">
              <dt className="text-[11px] font-semibold text-muted uppercase tracking-[0.15em]">
                Temperature
              </dt>
              <dd className="text-6xl sm:text-7xl lg:text-8xl font-extralight text-foreground tracking-tighter font-mono leading-none mt-1 whitespace-nowrap">
                {formatTemp(current.temperature)}
              </dd>
            </div>
            <div className="flex items-center gap-2 text-muted mb-2">
              <dt className="text-sm">Feels like</dt>
              <dd className="text-base font-semibold text-foreground/80 whitespace-nowrap">
                {formatTemp(current.apparentTemperature)}
              </dd>
            </div>
            <div>
              <dt className="sr-only">Conditions</dt>
              <dd className="text-base text-foreground/60">{current.description}</dd>
            </div>
          </div>

          <div className="flex sm:flex-col gap-3">
            <div className="glass rounded-xl px-4 py-3 text-center min-w-[100px]">
              <dt className="text-[11px] text-muted uppercase tracking-wider mb-1">
                Humidity
              </dt>
              <dd className="text-lg font-semibold text-foreground flex items-center justify-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-accent-sky"
                  aria-hidden="true"
                >
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
                {formatHumidity(current.humidity)}
              </dd>
            </div>
            <div className="glass rounded-xl px-4 py-3 text-center min-w-[100px]">
              <dt className="text-[11px] text-muted uppercase tracking-wider mb-1">
                Wind
              </dt>
              <dd className="text-lg font-semibold text-foreground flex items-center justify-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-accent-sky"
                  aria-hidden="true"
                >
                  <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
                  <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
                  <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
                </svg>
                {formatWind(current.windSpeed)}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
