import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useInteractive } from './theme';
import { chicagoIsDay, normalizeWeatherCondition, parsePreview } from './atmosphere';
import type { HeroSky } from './heroSky';
import {
  chicago,
  getSkyLocation,
  loadWeather,
  setSkyLocation,
  type SkyLocation,
  type WeatherResult,
} from './weather';

function useAtmosphereState() {
  const [location, updateLocation] = useState(getSkyLocation);
  const [now, setNow] = useState(() => new Date());
  const [result, setResult] = useState<WeatherResult | null>(null);
  const [enabled, setEnabled] = useState(true);
  const ready = useInteractive();
  const preview = useMemo(() => (ready ? parsePreview(window.location.search) : null), [ready]);
  const skyNow = useMemo(
    () => (preview?.skyDate ? new Date(preview.skyDate) : now),
    [preview, now],
  );
  const [skyResult, setSkyResult] = useState<{
    location: SkyLocation;
    now: Date;
    sky: HeroSky;
  } | null>(null);
  useEffect(() => {
    if (!ready) return;
    let current = true;
    import('./heroSky')
      .then(({ calculateHeroSky }) => {
        const sky = calculateHeroSky(location, skyNow);
        if (current) setSkyResult({ location, now: skyNow, sky });
      })
      .catch(() => {
        if (current) setSkyResult(null);
      });
    return () => {
      current = false;
    };
  }, [location, skyNow, ready]);
  const heroSky =
    skyResult?.location === location && skyResult.now === skyNow ? skyResult.sky : null;
  useEffect(() => {
    if (!ready || preview) return;
    let current = true;
    loadWeather(location).then((value) => {
      if (current) setResult(value);
    });
    return () => {
      current = false;
    };
  }, [location, now, preview, ready]);
  useEffect(() => {
    const refresh = () => {
      if (!document.hidden) setNow(new Date());
    };
    const delay = result?.weather
      ? Math.max(1000, result.weather.fetchedAt + 15 * 60 * 1000 - Date.now() + 10)
      : 15 * 60 * 1000;
    const timer = window.setTimeout(refresh, delay);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [result, now]);
  const selectLocation = (next: SkyLocation) => {
    setSkyLocation(next);
    updateLocation(next);
    setResult(null);
    setNow(new Date());
  };
  // Expired observations are never presented as current while refreshing.
  const fresh = result?.weather && now.getTime() - result.weather.fetchedAt < 15 * 60 * 1000;
  const weather = fresh ? result.weather : null;
  const preset =
    preview?.preset ?? (weather ? normalizeWeatherCondition(weather.code) : 'overcast');
  const isDay = preview?.isDay ?? weather?.isDay ?? chicagoIsDay(now);
  return {
    location,
    selectLocation,
    now: skyNow,
    heroSky,
    refresh: () => setNow(new Date()),
    result,
    weather,
    preset,
    isDay,
    enabled,
    setEnabled,
    preview,
    ready,
    weatherLocation: weather ? result!.location : chicago,
  };
}
type State = ReturnType<typeof useAtmosphereState>;
const AtmosphereContext = createContext<State | null>(null);
export function AtmosphereProvider({ children }: { children: ReactNode }) {
  const state = useAtmosphereState();
  return <AtmosphereContext.Provider value={state}>{children}</AtmosphereContext.Provider>;
}
// Context and its hook intentionally share this small provider module.
// eslint-disable-next-line react-refresh/only-export-components
export function useAtmosphere() {
  const state = useContext(AtmosphereContext);
  if (!state) throw new Error('AtmosphereProvider is required');
  return state;
}
