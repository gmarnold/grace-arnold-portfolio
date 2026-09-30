import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const payload = { current: { weather_code: 61, is_day: 1 }, timezone: 'America/Chicago' };
beforeEach(() => vi.resetModules());
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('optional weather', () => {
  it('shares in-flight requests and reuses successful data for 15 minutes', async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => payload });
    vi.stubGlobal('fetch', fetcher);
    const { getWeather, chicago } = await import('./weather');
    await Promise.all([getWeather(chicago), getWeather(chicago)]);
    await getWeather(chicago);
    expect(fetcher).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(15 * 60 * 1000 + 1);
    await getWeather(chicago);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it('falls back from visitor weather to Chicago without losing the chosen sky location', async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ ok: true, json: async () => payload });
    vi.stubGlobal('fetch', fetcher);
    const { loadWeather, chicago, setSkyLocation, getSkyLocation } = await import('./weather');
    const location = { latitude: 38.6, longitude: -90.2, label: 'Your area' };
    setSkyLocation(location);
    const result = await loadWeather(location);
    expect(result.location).toBe(chicago);
    expect(result.mood).toBe('rain');
    expect(result.message).toContain('Local weather is unavailable');
    expect(getSkyLocation()).toBe(location);
  });
  it('falls back to time of day for malformed API data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ current: {} }) }),
    );
    const { loadWeather, chicago } = await import('./weather');
    const result = await loadWeather(chicago);
    expect(result.weather).toBeNull();
    expect(result.message).toContain('time of day');
  });
  it('aborts a stalled weather request and returns a non-blocking fallback', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url, options: RequestInit) =>
          new Promise((_resolve, reject) => {
            options.signal?.addEventListener('abort', () => reject(new Error('timeout')));
          }),
      ),
    );
    const { loadWeather, chicago } = await import('./weather');
    const request = loadWeather(chicago);
    await vi.advanceTimersByTimeAsync(5001);
    expect((await request).weather).toBeNull();
  });
  it('uses a static night mood and distinguishes rain, snow, and storms', async () => {
    const { weatherMood } = await import('./weather');
    expect(weatherMood(0, false)).toBe('clear-night');
    expect(weatherMood(3, false)).toBe('cloudy-night');
    expect(weatherMood(65, true)).toBe('rain');
    expect(weatherMood(75, true)).toBe('snow');
    expect(weatherMood(99, true)).toBe('storm');
  });
  it('reports unsupported geolocation and permission denial without requesting on import', async () => {
    vi.stubGlobal('navigator', {});
    const { requestLocation } = await import('./weather');
    await expect(requestLocation()).rejects.toThrow('unavailable');
    const request = vi.fn((_success, failure) => failure({ code: 1 }));
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition: request } });
    expect(request).not.toHaveBeenCalled();
    await expect(requestLocation()).rejects.toThrow('declined');
  });
  it('rounds permitted coordinates and does not write location to storage', async () => {
    const storage = vi.spyOn(Storage.prototype, 'setItem');
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: (success: PositionCallback) =>
          success({ coords: { latitude: 38.627, longitude: -90.1994 } } as GeolocationPosition),
      },
    });
    const { requestLocation } = await import('./weather');
    expect(await requestLocation()).toEqual({
      latitude: 38.6,
      longitude: -90.2,
      label: 'Your area',
    });
    expect(storage).not.toHaveBeenCalled();
    storage.mockRestore();
  });
});
