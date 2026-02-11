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
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">
          7-day forecast
        </h2>
        <span className="text-[11px] text-muted uppercase tracking-[0.2em]">
          Daily outlook
        </span>
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-[110px_1fr_auto] gap-4 px-4 sm:px-6 py-3 text-[11px] text-muted uppercase tracking-widest border-b border-white/10">
          <span>Day</span>
          <span>Conditions</span>
          <span className="text-right">High / Low</span>
        </div>
        <ul className="divide-y divide-white/10">
          {days.map((day, i) => (
            <li
              key={day.dateISO}
              className="flex flex-col gap-3 px-4 sm:px-6 py-4 sm:grid sm:grid-cols-[110px_1fr_auto] sm:items-center animate-fade-in-up"
              style={{ animationDelay: `${0.2 + i * 0.05}s` }}
            >
              <div className="flex items-center justify-between sm:block">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  {formatDate(day.dateISO)}
                </span>
                <span className="text-xs text-muted sm:hidden whitespace-nowrap">
                  High {formatTemp(day.tempMax)} · Low {formatTemp(day.tempMin)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {getWeatherEmoji(day.weatherCode)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {day.description}
                  </p>
                  <p className="text-xs text-muted">
                    Typical conditions for the day
                  </p>
                </div>
              </div>
              <div className="text-right whitespace-nowrap hidden sm:block">
                <span className="text-sm font-semibold text-accent-amber">
                  High {formatTemp(day.tempMax)}
                </span>
                <span className="text-foreground/40 mx-2">·</span>
                <span className="text-sm text-muted">
                  Low {formatTemp(day.tempMin)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
