import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/app/page';

describe('Integration Tests - Home Component', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock global fetch
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);

    // Mock localStorage to prevent auto-search on mount
    const localStorageMock = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should successfully search for a city and display weather data', async () => {
    // Mock geocoding response
    const geocodingResponse = {
      results: [
        {
          name: 'Roma',
          country: 'Italy',
          latitude: 41.89,
          longitude: 12.51,
        },
      ],
    };

    // Mock weather response
    const weatherResponse = {
      current: {
        temperature_2m: 22,
        apparent_temperature: 21,
        relative_humidity_2m: 55,
        wind_speed_10m: 10,
        weather_code: 0,
      },
      daily: {
        time: ['2025-01-12', '2025-01-13'],
        temperature_2m_max: [24, 22],
        temperature_2m_min: [15, 13],
        weather_code: [0, 61],
      },
      hourly: {
        time: ['2025-01-12T00:00', '2025-01-12T01:00', '2025-01-13T00:00', '2025-01-13T01:00'],
        temperature_2m: [18, 17, 16, 15],
        weather_code: [0, 0, 61, 61],
        wind_speed_10m: [5, 6, 10, 12],
        wind_direction_10m: [180, 190, 270, 280],
        relative_humidity_2m: [60, 62, 70, 72],
        precipitation_probability: [0, 0, 40, 50],
      },
    };

    // Setup fetch mock to return different responses based on URL
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('geocoding-api.open-meteo.com')) {
        return Promise.resolve({
          ok: true,
          json: async () => geocodingResponse,
        });
      }
      if (url.includes('api.open-meteo.com')) {
        return Promise.resolve({
          ok: true,
          json: async () => weatherResponse,
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    // Render the Home component
    render(<Home />);

    // Verify initial idle state
    expect(screen.getByText('Enter a city to see the weather.')).toBeInTheDocument();

    // Find input and button
    const input = screen.getByLabelText('Search city');
    const button = screen.getByRole('button', { name: /search/i });

    // Type "Roma" in the input
    fireEvent.change(input, { target: { value: 'Roma' } });
    expect(input).toHaveValue('Roma');

    // Click the search button
    fireEvent.click(button);

    // Wait for loading state to disappear and results to appear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Verify geocoding API was called
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('geocoding-api.open-meteo.com'),
      expect.any(Object)
    );

    // Verify weather API was called
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('api.open-meteo.com'),
      expect.any(Object)
    );

    // Verify CurrentWeatherCard is displayed with correct data
    await waitFor(() => {
      expect(screen.getByText('Roma')).toBeInTheDocument();
    });

    expect(screen.getByText('Italy')).toBeInTheDocument();

    // Check that temperatures are displayed (em dash separator)
    const allTemps = screen.getAllByText(/22°C.*72°F/);
    expect(allTemps.length).toBeGreaterThan(0);

    expect(screen.getByText(/21°C.*70°F/)).toBeInTheDocument(); // Apparent temperature
    expect(screen.getByText('55%')).toBeInTheDocument(); // Humidity
    expect(screen.getByText(/10 km\/h.*6 mph/)).toBeInTheDocument(); // Wind

    // Weather description appears multiple times (current + forecast)
    const weatherDescriptions = screen.getAllByText('Clear sky');
    expect(weatherDescriptions.length).toBeGreaterThan(0);

    // Verify ForecastDaily is displayed
    expect(screen.getByText(/7-day forecast/i)).toBeInTheDocument();
  });

  it('should display error when city is not found', async () => {
    // Mock geocoding response with no results
    const geocodingResponse = {
      results: [],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => geocodingResponse,
    });

    render(<Home />);

    // Find input and button
    const input = screen.getByLabelText('Search city');
    const button = screen.getByRole('button', { name: /search/i });

    // Type a non-existent city
    fireEvent.change(input, { target: { value: 'Zzzznotacity' } });
    fireEvent.click(button);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Verify error message
    expect(screen.getByText('Città non trovata.')).toBeInTheDocument();

    // Verify error banner is displayed
    expect(screen.getByText('Error')).toBeInTheDocument();

    // Verify retry button is present
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();

    // Verify geocoding API was called
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('geocoding-api.open-meteo.com'),
      expect.any(Object)
    );

    // Verify weather API was NOT called (only one fetch call)
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should display error on network failure', async () => {
    // Mock fetch to throw network error
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<Home />);

    // Find input and button
    const input = screen.getByLabelText('Search city');
    const button = screen.getByRole('button', { name: /search/i });

    // Type a city name
    fireEvent.change(input, { target: { value: 'Roma' } });
    fireEvent.click(button);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Verify error message is displayed
    expect(screen.getByText('Error')).toBeInTheDocument();
    // The error message will be "Network error" as thrown by httpClient
    expect(screen.getByText('Network error')).toBeInTheDocument();

    // Verify retry button is present
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('should display validation error for input less than 2 characters', async () => {
    render(<Home />);

    const input = screen.getByLabelText('Search city');
    const button = screen.getByRole('button', { name: /search/i });

    // Type single character
    fireEvent.change(input, { target: { value: 'R' } });
    fireEvent.click(button);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Verify validation error message
    expect(screen.getByText('Inserisci almeno 2 caratteri.')).toBeInTheDocument();

    // Verify fetch was NOT called
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should handle retry button click', async () => {
    // First call returns error
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<Home />);

    const input = screen.getByLabelText('Search city');
    const searchButton = screen.getByRole('button', { name: /search/i });

    // Trigger initial search that fails
    fireEvent.change(input, { target: { value: 'Roma' } });
    fireEvent.click(searchButton);

    // Wait for error
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Setup successful response for retry
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('geocoding-api.open-meteo.com')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            results: [
              {
                name: 'Roma',
                country: 'Italy',
                latitude: 41.89,
                longitude: 12.51,
              },
            ],
          }),
        });
      }
      if (url.includes('api.open-meteo.com')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            current: {
              temperature_2m: 22,
              apparent_temperature: 21,
              relative_humidity_2m: 55,
              wind_speed_10m: 10,
              weather_code: 0,
            },
            daily: {
              time: ['2025-01-12'],
              temperature_2m_max: [24],
              temperature_2m_min: [15],
              weather_code: [0],
            },
            hourly: {
              time: ['2025-01-12T00:00', '2025-01-12T01:00'],
              temperature_2m: [18, 17],
              weather_code: [0, 0],
              wind_speed_10m: [5, 6],
              wind_direction_10m: [180, 190],
              relative_humidity_2m: [60, 62],
              precipitation_probability: [0, 0],
            },
          }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);

    // Wait for success
    await waitFor(() => {
      expect(screen.getByText('Roma')).toBeInTheDocument();
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
