export const presets = [
  'clear',
  'mostly-clear',
  'partly-cloudy',
  'overcast',
  'fog',
  'drizzle',
  'rain',
  'heavy-rain',
  'snow',
  'heavy-snow',
  'storm',
  'freezing',
  'hail',
] as const;
export type WeatherPreset = (typeof presets)[number];
export const labels: Record<WeatherPreset, string> = {
  clear: 'Clear',
  'mostly-clear': 'Mainly clear',
  'partly-cloudy': 'Partly cloudy',
  overcast: 'Overcast',
  fog: 'Fog',
  drizzle: 'Drizzle',
  rain: 'Rain',
  'heavy-rain': 'Heavy rain / showers',
  snow: 'Snow',
  'heavy-snow': 'Heavy snow',
  storm: 'Thunderstorm',
  freezing: 'Freezing precipitation',
  hail: 'Thunderstorm with hail',
};
const codes: Record<number, WeatherPreset> = {
  0: 'clear',
  1: 'mostly-clear',
  2: 'partly-cloudy',
  3: 'overcast',
  45: 'fog',
  48: 'fog',
  51: 'drizzle',
  53: 'drizzle',
  55: 'drizzle',
  56: 'freezing',
  57: 'freezing',
  61: 'rain',
  63: 'rain',
  65: 'heavy-rain',
  66: 'freezing',
  67: 'freezing',
  71: 'snow',
  73: 'snow',
  75: 'heavy-snow',
  77: 'snow',
  80: 'rain',
  81: 'heavy-rain',
  82: 'heavy-rain',
  85: 'snow',
  86: 'heavy-snow',
  95: 'storm',
  96: 'hail',
  99: 'hail',
};
export const wmoCodes = Object.keys(codes).map(Number);
export function normalizeWeatherCondition(code: number): WeatherPreset {
  return codes[code] ?? 'overcast';
}
export const moonOverrides = { new: 0, crescent: 45, quarter: 90, gibbous: 135, full: 180 };
export function constellationIntensity(angle: number | null | undefined, preset: WeatherPreset) {
  const illumination = angle == null || !Number.isFinite(angle) ? 0.5 : moonShape(angle).fraction;
  const veil = ['overcast', 'fog', 'storm', 'hail', 'heavy-rain', 'heavy-snow'].includes(preset)
    ? 0.08
    : preset === 'clear'
      ? 0
      : 0.04;
  return Math.max(0.74, 1 - illumination * 0.18 - veil);
}
export function parsePreview(search: string) {
  const params = new URLSearchParams(search);
  const preset = params.get('atmosphere');
  if (!presets.includes(preset as WeatherPreset)) return null;
  const time = params.get('time');
  const theme = params.get('theme');
  const moon = params.get('moonPhase');
  const date = params.get('skyDate');
  return {
    preset: preset as WeatherPreset,
    isDay: time !== 'night',
    theme: theme === 'dark' || theme === 'light' ? theme : null,
    skyDate: date && Number.isFinite(Date.parse(date)) ? new Date(date).toISOString() : null,
    motion:
      params.get('motion') === 'freeze'
        ? 'freeze'
        : params.get('motion') === 'slow'
          ? 'slow'
          : null,
    moonPhase:
      moon && Object.hasOwn(moonOverrides, moon)
        ? moonOverrides[moon as keyof typeof moonOverrides]
        : null,
  };
}
export function chicagoIsDay(now: Date) {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      hour: 'numeric',
      hourCycle: 'h23',
    }).format(now),
  );
  return hour >= 6 && hour < 18;
}
export function moonShape(angle: number) {
  const phase = ((angle % 360) + 360) % 360;
  const fraction = (1 - Math.cos((phase * Math.PI) / 180)) / 2;
  const name =
    fraction < 0.02
      ? 'new'
      : fraction < 0.48
        ? 'crescent'
        : fraction <= 0.52
          ? 'quarter'
          : fraction < 0.98
            ? 'gibbous'
            : 'full';
  // Northern-hemisphere convention: waxing lit on the right, waning on the left.
  const waxing = phase <= 180;
  const terminator = Math.abs(Math.cos((phase * Math.PI) / 180)) * 46;
  const outerSweep = waxing ? 1 : 0;
  const innerSweep = fraction < 0.5 ? 1 - outerSweep : outerSweep;
  const path = `M 50 4 A 46 46 0 0 ${outerSweep} 50 96 A ${Math.max(0.001, terminator)} 46 0 0 ${innerSweep} 50 4 Z`;
  return { name, fraction, waxing, path };
}
