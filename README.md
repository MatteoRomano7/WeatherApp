# Weather App

Global weather app: search a city and get current conditions plus a 7-day forecast.

Built with Next.js 16, TypeScript, Tailwind CSS v4, Open-Meteo API (no API key).

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Vitest + React Testing Library
- Open-Meteo API

## Getting Started

1) Install dependencies

```bash
npm install
```

2) Start the dev server

```bash
npm run dev
```

3) Open `http://localhost:3000`

## Environment

No environment variables are required. The app uses the Open-Meteo API without an API key.

## Deployment

1) Build the app

```bash
npm run build
```

2) Run the production server

```bash
npm start
```

If you deploy to a hosting provider (e.g., Vercel), follow its Next.js deployment guide.

## Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Run production build
npm start

# Lint
npm run lint

# Test (Vitest + React Testing Library)
npm test
```

## Structure

```
src/
  app/
    layout.tsx          # Root layout
    page.tsx            # Main page (component composition)
    globals.css         # CSS variables and Tailwind
  components/
    SearchBar.tsx       # City input + submit
    CurrentWeatherCard.tsx  # Current weather
    ForecastDaily.tsx   # 7-day forecast
    ErrorBanner.tsx     # Error banner
    LoadingState.tsx    # Loading state
  lib/
    api/
      httpClient.ts     # Fetch wrapper with timeout + AbortController
      openMeteo.ts      # Open-Meteo client (geocoding + forecast)
    domain/
      types.ts          # Domain types (GeoResult, WeatherBundle, etc.)
      errors.ts         # AppError + AppErrorCode
      weatherCodes.ts   # WMO code mapping to description
    hooks/
      useWeather.ts     # Main hook: search, retry, status, data, error
    utils/
      formatters.ts     # Formatting for temp, wind, humidity, dates
      storage.ts        # localStorage persistence for last search
  tests/
    setup.ts            # Vitest + jest-dom setup
    formatters.test.ts  # Unit test: formatters
    weatherCodes.test.ts # Unit test: weather codes
    storage.test.ts     # Unit test: storage
    integration.test.tsx # Integration test (success, not found, network error)
```

## Features

- City search using Open-Meteo geocoding
- Current weather: temperature, feels like, humidity, wind, description
- 7-day daily forecast (max/min + description)
- Last search persisted in localStorage
- Error handling: validation, city not found, network/API errors
- Responsive UI (mobile 360px + desktop)
- Dark theme
- Accessibility: labels, focus ring, aria-live
