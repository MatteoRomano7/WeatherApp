import { describe, it, expect } from 'vitest';
import {
  formatTemp,
  formatWind,
  formatHumidity,
  formatDate,
  formatTime,
  formatWindDirection,
  formatPrecipitation,
  groupHourlyByDay,
} from '@/lib/utils/formatters';
import type { ForecastHour } from '@/lib/domain/types';

describe('formatters', () => {
  describe('formatTemp', () => {
    it('should format positive temperature with no decimals', () => {
      expect(formatTemp(23.4)).toBe('23\u00b0C\u2009\u2014\u200974\u00b0F');
    });

    it('should format negative temperature with rounding', () => {
      expect(formatTemp(-1.6)).toBe('-2\u00b0C\u2009\u2014\u200929\u00b0F');
    });

    it('should format zero temperature', () => {
      expect(formatTemp(0)).toBe('0\u00b0C\u2009\u2014\u200932\u00b0F');
    });

    it('should round half values up', () => {
      expect(formatTemp(15.5)).toBe('16\u00b0C\u2009\u2014\u200960\u00b0F');
    });
  });

  describe('formatWind', () => {
    it('should format wind speed with no decimals', () => {
      expect(formatWind(12.3)).toBe('12 km/h\u2009\u2014\u20098 mph');
    });

    it('should format zero wind speed', () => {
      expect(formatWind(0)).toBe('0 km/h\u2009\u2014\u20090 mph');
    });

    it('should round up wind speed', () => {
      expect(formatWind(25.7)).toBe('26 km/h\u2009\u2014\u200916 mph');
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

  describe('formatTime', () => {
    it('should format afternoon time in 24h format', () => {
      expect(formatTime('2025-01-12T14:00')).toBe('14:00');
    });

    it('should format midnight', () => {
      expect(formatTime('2025-01-12T00:00')).toBe('00:00');
    });

    it('should format morning time', () => {
      expect(formatTime('2025-01-12T09:00')).toBe('09:00');
    });

    it('should format noon', () => {
      expect(formatTime('2025-01-12T12:00')).toBe('12:00');
    });
  });

  describe('formatWindDirection', () => {
    it('should return N for 0 degrees', () => {
      expect(formatWindDirection(0)).toBe('N');
    });

    it('should return N for 360 degrees', () => {
      expect(formatWindDirection(360)).toBe('N');
    });

    it('should return NE for 45 degrees', () => {
      expect(formatWindDirection(45)).toBe('NE');
    });

    it('should return E for 90 degrees', () => {
      expect(formatWindDirection(90)).toBe('E');
    });

    it('should return SE for 135 degrees', () => {
      expect(formatWindDirection(135)).toBe('SE');
    });

    it('should return S for 180 degrees', () => {
      expect(formatWindDirection(180)).toBe('S');
    });

    it('should return SW for 225 degrees', () => {
      expect(formatWindDirection(225)).toBe('SW');
    });

    it('should return W for 270 degrees', () => {
      expect(formatWindDirection(270)).toBe('W');
    });

    it('should return NW for 315 degrees', () => {
      expect(formatWindDirection(315)).toBe('NW');
    });

    it('should return N for 350 degrees (within North sector)', () => {
      expect(formatWindDirection(350)).toBe('N');
    });

    it('should handle negative degrees', () => {
      expect(formatWindDirection(-90)).toBe('W');
    });
  });

  describe('formatPrecipitation', () => {
    it('should format precipitation as percentage', () => {
      expect(formatPrecipitation(42)).toBe('42%');
    });

    it('should format zero precipitation', () => {
      expect(formatPrecipitation(0)).toBe('0%');
    });

    it('should round fractional values', () => {
      expect(formatPrecipitation(33.7)).toBe('34%');
    });

    it('should format 100% precipitation', () => {
      expect(formatPrecipitation(100)).toBe('100%');
    });
  });

  describe('groupHourlyByDay', () => {
    const makeHour = (timeISO: string): ForecastHour => ({
      timeISO,
      temperature: 20,
      weatherCode: 0,
      description: 'Clear sky',
      windSpeed: 10,
      windDirection: 180,
      humidity: 50,
      precipitationProbability: 0,
    });

    it('should group hours by date', () => {
      const hours = [
        makeHour('2025-01-12T00:00'),
        makeHour('2025-01-12T06:00'),
        makeHour('2025-01-12T12:00'),
        makeHour('2025-01-13T00:00'),
        makeHour('2025-01-13T06:00'),
      ];

      const result = groupHourlyByDay(hours);
      expect(result.size).toBe(2);
      expect(result.get('2025-01-12')?.length).toBe(3);
      expect(result.get('2025-01-13')?.length).toBe(2);
    });

    it('should return empty map for empty input', () => {
      const result = groupHourlyByDay([]);
      expect(result.size).toBe(0);
    });

    it('should handle single day', () => {
      const hours = [
        makeHour('2025-01-12T00:00'),
        makeHour('2025-01-12T01:00'),
      ];

      const result = groupHourlyByDay(hours);
      expect(result.size).toBe(1);
      expect(result.get('2025-01-12')?.length).toBe(2);
    });

    it('should preserve chronological order within each day', () => {
      const hours = [
        makeHour('2025-01-12T06:00'),
        makeHour('2025-01-12T12:00'),
        makeHour('2025-01-12T18:00'),
      ];

      const result = groupHourlyByDay(hours);
      const dayHours = result.get('2025-01-12')!;
      expect(dayHours[0].timeISO).toBe('2025-01-12T06:00');
      expect(dayHours[1].timeISO).toBe('2025-01-12T12:00');
      expect(dayHours[2].timeISO).toBe('2025-01-12T18:00');
    });
  });
});
