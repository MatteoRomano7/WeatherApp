"use client";

import type { ForecastDay } from '@/lib/domain/types';
import { formatTemp, formatDate } from '@/lib/utils/formatters';
import { getWeatherEmoji } from '@/lib/domain/weatherCodes';

export interface ForecastDailyProps {
  days: ForecastDay[];
}

export function ForecastDaily({ days }: ForecastDailyProps) {
  if (days.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-4 tracking-tight">
        7-day forecast
      </h2>

      <ul className="flex gap-2 overflow-x-auto pb-3 forecast-scroll snap-x snap-mandatory lg:grid lg:grid-cols-7 lg:pb-0 lg:overflow-visible">
        {days.map((day, i) => (
          <li
            key={day.dateISO}
            className="glass glass-hover rounded-2xl p-3 sm:p-4 flex flex-col items-center gap-2 min-w-[108px] snap-start shrink-0 lg:shrink lg:min-w-0 animate-fade-in-up"
            style={{ animationDelay: `${0.3 + i * 0.06}s` }}
          >
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
              {formatDate(day.dateISO)}
            </span>
            <span className="text-3xl" aria-hidden="true">
              {getWeatherEmoji(day.weatherCode)}
            </span>
            <div className="flex flex-col items-center gap-0.5">
              <dd className="text-base font-bold text-accent-amber">
                {formatTemp(day.tempMax)}
              </dd>
              <dd className="text-sm text-muted">
                {formatTemp(day.tempMin)}
              </dd>
            </div>
            <p className="text-[10px] text-foreground/40 text-center leading-tight line-clamp-2">
              {day.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
