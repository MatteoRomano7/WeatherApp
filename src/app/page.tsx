"use client";

import { useMemo } from 'react';
import { useWeather } from '@/lib/hooks/useWeather';
import { SearchBar } from '@/components/SearchBar';
import { CurrentWeatherCard } from '@/components/CurrentWeatherCard';
import { ForecastDaily } from '@/components/ForecastDaily';
import { ErrorBanner } from '@/components/ErrorBanner';
import { LoadingState } from '@/components/LoadingState';
import { groupHourlyByDay } from '@/lib/utils/formatters';

type WeatherEffect =
  | 'default'
  | 'clear'
  | 'cloudy'
  | 'fog'
  | 'rain'
  | 'snow'
  | 'thunder';

function getWeatherEffect(code?: number): WeatherEffect {
  if (code === undefined) return 'default';

  if (code === 0) return 'clear';
  if (code >= 1 && code <= 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95 && code <= 99) return 'thunder';

  return 'default';
}

export default function Home() {
  const { query, status, data, error, selectedDay, search, retry, selectDay } = useWeather();
  const hourlyByDay = useMemo(
    () => (data?.hourly ? groupHourlyByDay(data.hourly) : undefined),
    [data],
  );
  const weatherEffect =
    status === 'success' && data
      ? getWeatherEffect(data.current.weatherCode)
      : 'default';

  return (
    <>
      <div
        className={`weather-effect weather-effect--${weatherEffect}`}
        aria-hidden="true"
      />
      <main className="relative z-10 min-h-screen px-4 py-8 sm:px-8 sm:py-12 max-w-4xl mx-auto">
        <header className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl" aria-hidden="true">{'\uD83C\uDF24\uFE0F'}</span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Weather
            </h1>
          </div>
          <p className="text-muted text-sm ml-12">
            Real-time worldwide weather forecasts
          </p>
        </header>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <SearchBar onSearch={search} initialQuery={query} />
        </div>

        <div className="mt-8">
          {status === 'idle' && (
            <div className="animate-fade-in text-center py-20">
              <span className="text-6xl block mb-4" aria-hidden="true">{'\uD83C\uDF0D'}</span>
              <p className="text-muted text-lg">
                Enter a city to see the weather.
              </p>
            </div>
          )}

          {status === 'loading' && <LoadingState />}

          {status === 'error' && error && (
            <ErrorBanner error={error} onRetry={retry} />
          )}

          {status === 'success' && data && (
            <div className="space-y-8">
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <CurrentWeatherCard data={data} />
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                <ForecastDaily
                  days={data.daily}
                  hourlyByDay={hourlyByDay}
                  selectedDay={selectedDay}
                  onSelectDay={selectDay}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
