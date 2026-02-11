"use client";

import type { ForecastDay, ForecastHour } from '@/lib/domain/types';
import { formatTemp, formatDate } from '@/lib/utils/formatters';
import { getWeatherEmoji } from '@/lib/domain/weatherCodes';
import { HourlyDetail } from '@/components/HourlyDetail';

export interface ForecastDailyProps {
  days: ForecastDay[];
  hourlyByDay?: Map<string, ForecastHour[]>;
  selectedDay?: string | null;
  onSelectDay?: (dateISO: string) => void;
}

export function ForecastDaily({ days, hourlyByDay, selectedDay, onSelectDay }: ForecastDailyProps) {
  if (days.length === 0) {
    return null;
  }

  const isInteractive = !!onSelectDay;

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
        <div className="hidden sm:grid grid-cols-[110px_1fr_auto_24px] gap-4 px-4 sm:px-6 py-3 text-[11px] text-muted uppercase tracking-widest border-b border-white/10">
          <span>Day</span>
          <span>Conditions</span>
          <span className="text-right">High / Low</span>
          <span />
        </div>
        <ul className="divide-y divide-white/10">
          {days.map((day, i) => {
            const isExpanded = selectedDay === day.dateISO;
            return (
              <li
                key={day.dateISO}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.2 + i * 0.05}s` }}
              >
                <button
                  onClick={() => onSelectDay?.(day.dateISO)}
                  aria-expanded={isExpanded}
                  disabled={!isInteractive}
                  className={`w-full text-left flex flex-col gap-3 px-4 sm:px-6 py-4 sm:grid sm:grid-cols-[110px_1fr_auto_24px] sm:items-center transition-colors ${
                    isInteractive ? 'cursor-pointer hover:bg-white/[0.02]' : ''
                  } ${isExpanded ? 'bg-white/[0.03] border-l-2 border-accent-sky' : ''}`}
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
                  {isInteractive && (
                    <span
                      className={`transition-transform duration-200 text-muted hidden sm:block ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                        aria-hidden="true"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  )}
                </button>
                {isExpanded && hourlyByDay && (
                  <HourlyDetail hours={hourlyByDay.get(day.dateISO) ?? []} />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
