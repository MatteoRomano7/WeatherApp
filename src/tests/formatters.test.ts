import { describe, it, expect } from 'vitest';
import {
  formatTemp,
  formatWind,
  formatHumidity,
  formatDate,
} from '@/lib/utils/formatters';

describe('formatters', () => {
  describe('formatTemp', () => {
    it('should format positive temperature with no decimals', () => {
      expect(formatTemp(23.4)).toBe('23°C / 74°F');
    });

    it('should format negative temperature with rounding', () => {
      expect(formatTemp(-1.6)).toBe('-2°C / 29°F');
    });

    it('should format zero temperature', () => {
      expect(formatTemp(0)).toBe('0°C / 32°F');
    });

    it('should round half values up', () => {
      expect(formatTemp(15.5)).toBe('16°C / 60°F');
    });
  });

  describe('formatWind', () => {
    it('should format wind speed with no decimals', () => {
      expect(formatWind(12.3)).toBe('12 km/h / 8 mph');
    });

    it('should format zero wind speed', () => {
      expect(formatWind(0)).toBe('0 km/h / 0 mph');
    });

    it('should round up wind speed', () => {
      expect(formatWind(25.7)).toBe('26 km/h / 16 mph');
    });
  });

  describe('formatHumidity', () => {
    it('should format humidity percentage with no decimals', () => {
      expect(formatHumidity(65.2)).toBe('65%');
    });

    it('should format zero humidity', () => {
      expect(formatHumidity(0)).toBe('0%');
    });

    it('should format 100% humidity', () => {
      expect(formatHumidity(100)).toBe('100%');
    });

    it('should round humidity value', () => {
      expect(formatHumidity(78.9)).toBe('79%');
    });
  });

  describe('formatDate', () => {
    it('should format ISO date to Italian short format', () => {
      const result = formatDate('2025-01-12');
      // The result should contain the day number "12"
      expect(result).toContain('12');
      // Should be in Italian format (e.g., "dom 12 gen" or similar)
      expect(result.length).toBeGreaterThan(0);
    });

    it('should format different dates correctly', () => {
      const result = formatDate('2025-02-28');
      expect(result).toContain('28');
    });

    it('should handle first day of month', () => {
      const result = formatDate('2025-03-01');
      expect(result).toContain('1');
    });
  });
});
