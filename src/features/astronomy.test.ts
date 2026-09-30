import { describe, expect, it } from 'vitest';
import { calculateSky } from './astronomy';
import { chicago } from './weather';

describe('local sky calculations', () => {
  it('identifies the new moon at the April 2024 solar eclipse', () => {
    const sky = calculateSky(chicago, new Date('2024-04-08T18:21:00Z'));
    expect(sky.phase).toBe('New moon');
    expect(sky.illumination).toBeLessThanOrEqual(1);
  });
  it('returns future Chicago events and only above-horizon objects', () => {
    const now = new Date('2026-09-30T18:00:00Z');
    const sky = calculateSky(chicago, now);
    expect(sky.events.every((event) => event.date && event.date > now)).toBe(true);
    expect(
      sky.objects.every(
        (object) =>
          object.altitude > 0 &&
          object.altitude <= 90 &&
          object.azimuth >= 0 &&
          object.azimuth < 360,
      ),
    ).toBe(true);
  });
  it('handles polar locations without inventing a sunset', () => {
    const sky = calculateSky(
      { latitude: 89, longitude: 0, label: 'Arctic' },
      new Date('2026-06-21T12:00:00Z'),
    );
    expect(sky.events.find((event) => event.label === 'Next sunset')?.date).toBeNull();
  });
});
