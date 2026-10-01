import { normalizeWeatherCondition, labels, wmoCodes, type WeatherPreset } from './atmosphere';
export interface SkyLocation {
  latitude: number;
  longitude: number;
  label: string;
}
export interface Weather {
  code: number;
  isDay: boolean;
  timezone: string;
  fetchedAt: number;
  temperature: number | null;
}
export type Atmosphere = WeatherPreset;
export const chicago: SkyLocation = { latitude: 41.88, longitude: -87.63, label: 'Chicago' };
const ttl = 15 * 60 * 1000;
const cache = new Map<string, Weather>();
const pending = new Map<string, Promise<Weather>>();
let visitorLocation: SkyLocation = chicago;

export function getSkyLocation() {
  return visitorLocation;
}
export function setSkyLocation(value: SkyLocation) {
  visitorLocation = value;
}

export function weatherMood(code: number): Atmosphere {
  return normalizeWeatherCondition(code);
}
export const weatherLabels = labels;

function parseWeather(value: unknown): Weather {
  if (!value || typeof value !== 'object') throw new Error('Invalid weather response');
  const data = value as {
    current?: { weather_code?: unknown; is_day?: unknown; temperature_2m?: unknown };
    timezone?: unknown;
  };
  const code = data.current?.weather_code;
  const isDay = data.current?.is_day;
  const validCodes = wmoCodes;
  if (
    typeof code !== 'number' ||
    !validCodes.includes(code) ||
    (isDay !== 0 && isDay !== 1) ||
    typeof data.timezone !== 'string'
  )
    throw new Error('Incomplete weather response');
  new Intl.DateTimeFormat('en-US', { timeZone: data.timezone });
  return {
    code,
    isDay: isDay === 1,
    timezone: data.timezone,
    fetchedAt: Date.now(),
    temperature:
      typeof data.current?.temperature_2m === 'number' &&
      Number.isFinite(data.current.temperature_2m)
        ? data.current.temperature_2m
        : null,
  };
}

export async function getWeather(location: SkyLocation): Promise<Weather> {
  const key = `${location.latitude},${location.longitude}`;
  const found = cache.get(key);
  if (found && Date.now() - found.fetchedAt < ttl) return found;
  const existing = pending.get(key);
  if (existing) return existing;
  const request = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const params = new URLSearchParams({
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        current: 'weather_code,is_day,temperature_2m',
        temperature_unit: 'fahrenheit',
        timezone: 'auto',
      });
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
        signal: controller.signal,
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
      });
      if (!response.ok) throw new Error(`Weather unavailable (${response.status})`);
      const weather = parseWeather(await response.json());
      cache.set(key, weather);
      return weather;
    } finally {
      clearTimeout(timer);
      pending.delete(key);
    }
  })();
  pending.set(key, request);
  return request;
}

export interface WeatherResult {
  weather: Weather | null;
  location: SkyLocation;
  mood: Atmosphere;
  message: string;
}
export async function loadWeather(location: SkyLocation): Promise<WeatherResult> {
  try {
    const weather = await getWeather(location);
    return { weather, location, mood: weatherMood(weather.code), message: '' };
  } catch {
    if (location !== chicago) {
      try {
        const weather = await getWeather(chicago);
        return {
          weather,
          location: chicago,
          mood: weatherMood(weather.code),
          message:
            'Local weather is unavailable. Showing Chicago weather; sky calculations still use your selected location.',
        };
      } catch {
        /* Fall through to a static, time-based atmosphere. */
      }
    }
    return {
      weather: null,
      location: chicago,
      mood: 'overcast',
      message:
        'Weather is unavailable. The atmosphere uses Chicago time of day; sky calculations still work locally.',
    };
  }
}

export function requestLocation(): Promise<SkyLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is unavailable. Chicago is still available.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude) ||
          Math.abs(latitude) > 90 ||
          Math.abs(longitude) > 180
        ) {
          reject(new Error('Location could not be read. Showing Chicago.'));
          return;
        }
        resolve({
          latitude: Math.round(latitude * 10) / 10,
          longitude: Math.round(longitude * 10) / 10,
          label: 'Your area',
        });
      },
      (error) =>
        reject(
          new Error(
            error.code === 1
              ? 'Location permission was declined. Showing Chicago.'
              : 'Location could not be read. Showing Chicago.',
          ),
        ),
      { enableHighAccuracy: false, maximumAge: ttl, timeout: 8000 },
    );
  });
}
