import {
  Equator,
  Horizon,
  MoonPhase,
  Observer,
  Body,
  Rotation_EQJ_EQD,
  RotateVector,
  VectorFromSphere,
  SphereFromVector,
  Spherical,
  SearchAltitude,
} from 'astronomy-engine';
import catalog from './constellations.json' with { type: 'json' };
import type { SkyLocation } from './weather';

export function calculateHeroSky(location: SkyLocation, now: Date) {
  const observer = new Observer(location.latitude, location.longitude, 0);
  const sun = Equator(Body.Sun, now, observer, true, true);
  const altitude = Horizon(now, observer, sun.ra, sun.dec).altitude;
  // During daylight/twilight, use the next end of civil twilight, plus 30 minutes.
  // At night, show the current sky. Polar locations retain the current time if no event exists.
  const dusk = altitude > -6 ? SearchAltitude(Body.Sun, observer, -1, now, 2, -6)?.date : null;
  const skyTime = dusk ? new Date(dusk.getTime() + 30 * 60 * 1000) : now;
  const rotation = Rotation_EQJ_EQD(skyTime);
  const points = new Map<string, { x: number; y: number; altitude: number }>();
  const project = (coordinate: number[]) => {
    const key = coordinate.join(',');
    if (!points.has(key)) {
      const eqd = SphereFromVector(
        RotateVector(
          rotation,
          VectorFromSphere(new Spherical(coordinate[1], coordinate[0], 1), skyTime),
        ),
      );
      const horizontal = Horizon(skyTime, observer, eqd.lon / 15, eqd.lat, 'normal');
      const radius = ((90 - horizontal.altitude) / 90) * 440;
      const angle = (horizontal.azimuth * Math.PI) / 180;
      points.set(key, {
        x: 500 + Math.sin(angle) * radius,
        y: 310 - Math.cos(angle) * radius,
        altitude: horizontal.altitude,
      });
    }
    return points.get(key)!;
  };
  const lines: { name: string; path: string }[] = [];
  for (const constellation of catalog) {
    const segments: string[] = [];
    for (const line of constellation.lines) {
      for (let i = 1; i < line.length; i++) {
        const a = project(line[i - 1]);
        const b = project(line[i]);
        if (a.altitude > 0 && b.altitude > 0)
          segments.push(`M${a.x.toFixed(2)},${a.y.toFixed(2)}L${b.x.toFixed(2)},${b.y.toFixed(2)}`);
      }
    }
    if (segments.length) lines.push({ name: constellation.name, path: segments.join('') });
  }
  return {
    lines,
    stars: [...points.values()].filter((p) => p.altitude > 0),
    skyTime: skyTime.toISOString(),
    phase: MoonPhase(now),
  };
}
export type HeroSky = ReturnType<typeof calculateHeroSky>;
