import type { WeatherPreset } from './atmosphere';

type Kind = 'rain' | 'snow' | 'ice' | 'hail';
type Range = readonly [number, number];
type Profile = { count: number; duration: Range; length: Range; drift: Range; kind: Kind };
export const precipitationProfiles: Partial<Record<WeatherPreset, Profile>> = {
  drizzle: { count: 22, duration: [3, 5], length: [3, 8], drift: [-15, 12], kind: 'rain' },
  rain: { count: 42, duration: [1.2, 2.5], length: [10, 24], drift: [-35, 15], kind: 'rain' },
  'heavy-rain': {
    count: 68,
    duration: [0.7, 1.9],
    length: [16, 34],
    drift: [-50, 20],
    kind: 'rain',
  },
  snow: { count: 30, duration: [9, 19], length: [2, 5], drift: [-65, 65], kind: 'snow' },
  'heavy-snow': { count: 56, duration: [6, 16], length: [2, 7], drift: [-100, 100], kind: 'snow' },
  freezing: { count: 40, duration: [1.3, 3], length: [3, 13], drift: [-30, 22], kind: 'ice' },
  hail: { count: 44, duration: [0.8, 1.8], length: [3, 6], drift: [-45, 30], kind: 'hail' },
  storm: { count: 64, duration: [0.6, 1.7], length: [18, 36], drift: [-180, -65], kind: 'rain' },
};

// Local PRNG: independent of render order, clocks, and Math.random (including SSR).
export function generateParticles(preset: WeatherPreset, seed = 7319) {
  const profile = precipitationProfiles[preset];
  if (!profile) return [];
  let state = seed >>> 0;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const between = ([min, max]: Range) => min + random() * (max - min);
  return Array.from({ length: profile.count }, (_, index) => {
    const duration = between(profile.duration);
    const kind = profile.kind === 'ice' && index % 3 === 0 ? 'rain' : profile.kind;
    return {
      kind,
      depth: index % 3,
      x: between([2, 98]),
      y: between([-8, 92]),
      duration,
      delay: -random() * duration,
      length: between(profile.length),
      width: kind === 'rain' ? between([0.6, preset === 'drizzle' ? 1 : 1.6]) : between([2, 5]),
      opacity: between(preset === 'drizzle' ? [0.12, 0.3] : [0.25, 0.65]),
      drift: between(profile.drift),
      sway: between([8, 35]),
      angle: between(preset === 'storm' ? [8, 25] : [-6, 6]),
      rotation: between([-70, 70]),
    };
  });
}
