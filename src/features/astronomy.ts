import {
  Body,
  Equator,
  Horizon,
  Illumination,
  MoonPhase,
  Observer,
  SearchRiseSet,
} from 'astronomy-engine';
import type { SkyLocation } from './weather';

const phaseNames = [
  'New moon',
  'Waxing crescent',
  'First quarter',
  'Waxing gibbous',
  'Full moon',
  'Waning gibbous',
  'Last quarter',
  'Waning crescent',
];
const bodies = [Body.Moon, Body.Mercury, Body.Venus, Body.Mars, Body.Jupiter, Body.Saturn];

export function calculateSky(location: SkyLocation, now: Date) {
  const observer = new Observer(location.latitude, location.longitude, 0);
  const phase = MoonPhase(now);
  const objects = bodies
    .map((body) => {
      const equator = Equator(body, now, observer, true, true);
      const horizon = Horizon(now, observer, equator.ra, equator.dec, 'normal');
      return { name: String(body), altitude: horizon.altitude, azimuth: horizon.azimuth };
    })
    .filter((body) => body.altitude > 0)
    .sort((a, b) => b.altitude - a.altitude);
  return {
    phase: phaseNames[Math.floor((phase + 22.5) / 45) % 8],
    illumination: Math.round(Illumination(Body.Moon, now).phase_fraction * 100),
    objects,
    events: [
      { label: 'Next sunrise', date: SearchRiseSet(Body.Sun, observer, 1, now, 2)?.date ?? null },
      { label: 'Next sunset', date: SearchRiseSet(Body.Sun, observer, -1, now, 2)?.date ?? null },
      { label: 'Next moonrise', date: SearchRiseSet(Body.Moon, observer, 1, now, 2)?.date ?? null },
      { label: 'Next moonset', date: SearchRiseSet(Body.Moon, observer, -1, now, 2)?.date ?? null },
    ],
  };
}
export type Sky = ReturnType<typeof calculateSky>;

export function compass(azimuth: number) {
  return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(azimuth / 45) % 8];
}
