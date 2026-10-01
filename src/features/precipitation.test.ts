import { describe, expect, it } from 'vitest';
import { generateParticles, precipitationProfiles } from './precipitation';
import { constellationIntensity, parsePreview, presets } from './atmosphere';

describe('deterministic precipitation', () => {
  for (const preset of presets)
    it(`valid, varied ${preset} particles stay within their profile`, () => {
      const particles = generateParticles(preset);
      expect(particles).toEqual(generateParticles(preset));
      const profile = precipitationProfiles[preset];
      if (!profile) {
        expect(particles).toEqual([]);
        return;
      }
      expect(particles).toHaveLength(profile.count);
      expect(particles).not.toEqual(generateParticles(preset, 42));
      for (const key of [
        'duration',
        'delay',
        'length',
        'width',
        'opacity',
        'x',
        'y',
        'drift',
        'angle',
        'rotation',
        'sway',
      ] as const) {
        expect(new Set(particles.map((p) => p[key])).size).toBeGreaterThan(1);
        expect(particles.every((p) => Number.isFinite(p[key]))).toBe(true);
      }
      for (const p of particles) {
        expect(p.duration).toBeGreaterThanOrEqual(profile.duration[0]);
        expect(p.duration).toBeLessThanOrEqual(profile.duration[1]);
        expect(p.length).toBeGreaterThanOrEqual(profile.length[0]);
        expect(p.length).toBeLessThanOrEqual(profile.length[1]);
        expect(p.drift).toBeGreaterThanOrEqual(profile.drift[0]);
        expect(p.drift).toBeLessThanOrEqual(profile.drift[1]);
        expect(p.delay).toBeGreaterThanOrEqual(-p.duration);
        expect(p.delay).toBeLessThanOrEqual(0);
        expect(p.x).toBeGreaterThanOrEqual(2);
        expect(p.x).toBeLessThanOrEqual(98);
        expect(p.opacity).toBeGreaterThan(0);
        expect(p.opacity).toBeLessThan(1);
      }
    });
  it('uses distinct rain, snow, wind and mixed ice behavior with bounded density', () => {
    expect(generateParticles('freezing').map((p) => p.kind)).toContain('ice');
    expect(generateParticles('freezing').map((p) => p.kind)).toContain('rain');
    expect(generateParticles('storm').every((p) => p.drift < -60)).toBe(true);
    expect(generateParticles('snow').every((p) => p.duration >= 9 && p.kind === 'snow')).toBe(true);
    expect(generateParticles('hail').every((p) => p.duration < 2 && p.kind === 'hail')).toBe(true);
    expect(generateParticles('heavy-snow').length).toBeGreaterThan(
      generateParticles('snow').length,
    );
    expect(Math.max(...presets.map((p) => generateParticles(p).length))).toBeLessThanOrEqual(68);
  });
});

describe('constellation visual floor', () => {
  it('preserves a 74% floor for every weather and waxing/waning phase', () => {
    for (const preset of presets)
      for (let phase = 0; phase < 360; phase += 5) {
        const intensity = constellationIntensity(phase, preset);
        expect(intensity).toBeGreaterThanOrEqual(0.74);
        expect(intensity).toBeLessThanOrEqual(1);
      }
    expect(constellationIntensity(0, 'clear')).toBe(1);
    expect(constellationIntensity(180, 'clear')).toBeCloseTo(0.82);
    expect(constellationIntensity(180, 'storm')).toBeCloseTo(0.74);
    expect(constellationIntensity(45, 'overcast')).toBeGreaterThan(
      constellationIntensity(135, 'overcast'),
    );
    expect(constellationIntensity(NaN, 'fog')).toBeGreaterThanOrEqual(0.74);
  });
  it('supports a reproducible sky date and frozen/slowed particles only in previews', () => {
    expect(parsePreview('?skyDate=2026-10-01T04:00:00Z&motion=freeze')).toBeNull();
    expect(
      parsePreview('?atmosphere=snow&skyDate=2026-10-01T04:00:00Z&motion=freeze'),
    ).toMatchObject({
      skyDate: '2026-10-01T04:00:00.000Z',
      motion: 'freeze',
    });
    expect(parsePreview('?atmosphere=rain&skyDate=invalid&motion=invalid')).toMatchObject({
      skyDate: null,
      motion: null,
    });
  });
});
