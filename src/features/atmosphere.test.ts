import { describe, it, expect } from 'vitest';
import {
  normalizeWeatherCondition,
  parsePreview,
  chicagoIsDay,
  moonShape,
  wmoCodes,
} from './atmosphere';
import { calculateHeroSky } from './heroSky';
import { chicago } from './weather';

describe('weather classification', () => {
  const groups = {
    clear: [0],
    'mostly-clear': [1],
    'partly-cloudy': [2],
    overcast: [3],
    fog: [45, 48],
    drizzle: [51, 53, 55],
    freezing: [56, 57, 66, 67],
    rain: [61, 63, 80],
    'heavy-rain': [65, 81, 82],
    snow: [71, 73, 77, 85],
    'heavy-snow': [75, 86],
    storm: [95],
    hail: [96, 99],
  };
  for (const [preset, codes] of Object.entries(groups))
    it(`maps every ${preset} code`, () => {
      for (const code of codes) expect(normalizeWeatherCondition(code)).toBe(preset);
    });
  it('covers the documented code set and safely handles unknown data', () => {
    expect(
      Object.values(groups)
        .flat()
        .sort((a, b) => a - b),
    ).toEqual(wmoCodes);
    for (const code of [-1, 4, 100, NaN]) expect(normalizeWeatherCondition(code)).toBe('overcast');
  });
  it('uses Chicago time including winter and summer offsets', () => {
    expect(chicagoIsDay(new Date('2026-01-15T12:00:00Z'))).toBe(true);
    expect(chicagoIsDay(new Date('2026-07-15T10:00:00Z'))).toBe(false);
    expect(chicagoIsDay(new Date('2026-07-15T11:00:00Z'))).toBe(true);
  });
});
describe('temporary preview', () => {
  it('requires a known atmosphere preset before honoring overrides', () => {
    expect(parsePreview('?moonPhase=full&theme=dark')).toBeNull();
    expect(parsePreview('?atmosphere=unknown&moonPhase=full')).toBeNull();
    expect(parsePreview('?atmosphere=rain&time=night&theme=dark&moonPhase=quarter')).toEqual({
      preset: 'rain',
      isDay: false,
      theme: 'dark',
      skyDate: null,
      motion: null,
      moonPhase: 90,
    });
    expect(parsePreview('?atmosphere=snow&time=bad&theme=bad&moonPhase=bad')).toEqual({
      preset: 'snow',
      isDay: true,
      theme: null,
      skyDate: null,
      motion: null,
      moonPhase: null,
    });
  });
  it('maps all moon overrides without reading or writing storage', () => {
    for (const [name, angle] of Object.entries({
      new: 0,
      crescent: 45,
      quarter: 90,
      gibbous: 135,
      full: 180,
    }))
      expect(parsePreview(`?atmosphere=clear&moonPhase=${name}`)?.moonPhase).toBe(angle);
  });
});
describe('current Moon geometry and actual constellation projection', () => {
  it('maps waxing and waning phases with the correct illuminated side and area', () => {
    for (const [angle, name, fraction] of [
      [0, 'new', 0],
      [45, 'crescent', 0.1464],
      [90, 'quarter', 0.5],
      [135, 'gibbous', 0.8536],
      [180, 'full', 1],
      [225, 'gibbous', 0.8536],
      [270, 'quarter', 0.5],
      [315, 'crescent', 0.1464],
    ] as const) {
      const shape = moonShape(angle);
      expect(shape.name).toBe(name);
      expect(shape.fraction).toBeCloseTo(fraction, 3);
      expect(shape.waxing).toBe(angle <= 180);
      expect(shape.path).not.toContain('NaN');
    }
    expect(moonShape(45).path).not.toBe(moonShape(315).path);
  });
  it('uses the current phase even when constellations use the coming evening', () => {
    const date = new Date('2024-04-08T18:21:00Z');
    const sky = calculateHeroSky(chicago, date);
    expect(moonShape(sky.phase).name).toBe('new');
    expect(new Date(sky.skyTime).getTime()).toBeGreaterThan(date.getTime());
    expect(sky.lines.some((line) => line.name === 'UMi')).toBe(true);
    expect(sky.stars.every((star) => star.altitude > 0 && Number.isFinite(star.x + star.y))).toBe(
      true,
    );
    expect(sky.stars.length).toBeLessThan(200);
  });
  it('rotates real constellations with time and observer location', () => {
    const first = calculateHeroSky(chicago, new Date('2026-10-01T04:00:00Z'));
    const later = calculateHeroSky(chicago, new Date('2026-10-01T06:00:00Z'));
    expect(first.skyTime).toBe('2026-10-01T04:00:00.000Z');
    expect(first.lines).not.toEqual(later.lines);
    expect(first.lines).not.toEqual(
      calculateHeroSky(
        { latitude: 51.5, longitude: 0, label: 'QA' },
        new Date('2026-10-01T04:00:00Z'),
      ).lines,
    );
  });
});
