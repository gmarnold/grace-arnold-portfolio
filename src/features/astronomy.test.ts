import { describe, expect, it } from 'vitest';
import { calculateSky } from './astronomy';
import { chicago } from './weather';
import { calculateHeroSky } from './heroSky';
import { Body, Equator, Horizon, Observer } from 'astronomy-engine';

describe('local sky calculations', () => {
  it('uses the hero evening during daytime and the current time at night', () => {
    for (const date of ['2026-10-01T18:00:00Z', '2026-10-01T04:00:00Z']) {
      const now = new Date(date);
      const hero = calculateHeroSky(chicago, now);
      const sky = calculateSky(chicago, now, hero);
      expect(sky.tonight.time).toBe(hero.skyTime);
      expect(sky.tonight.constellations.map((c) => c.id)).toEqual(hero.lines.map((l) => l.name));
      const observer = new Observer(chicago.latitude, chicago.longitude, 0);
      const time = new Date(hero.skyTime);
      for (const planet of sky.tonight.planets) {
        const eq = Equator(planet.name as Body, time, observer, true, true);
        expect(planet.altitude).toBeCloseTo(
          Horizon(time, observer, eq.ra, eq.dec, 'normal').altitude,
        );
        expect(planet.altitude).toBeGreaterThan(0);
        expect(planet.name).not.toBe('Moon');
      }
      if (date.includes('18:00')) expect(time.getTime()).toBeGreaterThan(now.getTime());
      else expect(time).toEqual(now);
    }
  });
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
