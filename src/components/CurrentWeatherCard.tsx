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
              <dd className="text-7xl sm:text-8xl font-extralight text-foreground tracking-tighter font-mono leading-none mt-1">
                {formatTemp(current.temperature)}
              </dd>
            </div>
            <div className="flex items-center gap-2 text-muted mb-2">
              <dt className="text-sm">Feels like</dt>
              <dd className="text-base font-semibold text-foreground/80">
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
              <dd className="text-lg font-semibold text-foreground">
                {formatHumidity(current.humidity)}
              </dd>
            </div>
            <div className="glass rounded-xl px-4 py-3 text-center min-w-[100px]">
              <dt className="text-[11px] text-muted uppercase tracking-wider mb-1">
                Wind
              </dt>
              <dd className="text-lg font-semibold text-foreground">
                {formatWind(current.windSpeed)}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
