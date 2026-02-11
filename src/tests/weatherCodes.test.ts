import { describe, it, expect } from 'vitest';
import { getWeatherDescription } from '@/lib/domain/weatherCodes';

describe('weatherCodes', () => {
  describe('getWeatherDescription', () => {
    it('should return "Clear sky" for code 0', () => {
      expect(getWeatherDescription(0)).toBe('Clear sky');
    });

    it('should return "Light rain" for code 61', () => {
      expect(getWeatherDescription(61)).toBe('Light rain');
    });

    it('should return "Thunderstorm" for code 95', () => {
      expect(getWeatherDescription(95)).toBe('Thunderstorm');
    });

    it('should return "Light snow" for code 71', () => {
      expect(getWeatherDescription(71)).toBe('Light snow');
    });

    it('should return "Fog" for code 45', () => {
      expect(getWeatherDescription(45)).toBe('Fog');
    });

    it('should return "Unknown conditions" for unknown code', () => {
      expect(getWeatherDescription(999)).toBe('Unknown conditions');
    });

    it('should return "Unknown conditions" for negative code', () => {
      expect(getWeatherDescription(-1)).toBe('Unknown conditions');
    });
  });
});
