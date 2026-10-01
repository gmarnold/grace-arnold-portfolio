import { useEffect, useState } from 'react';
import { useAtmosphere } from '../features/AtmosphereProvider';
import { labels, moonShape } from '../features/atmosphere';
import { useTheme } from '../features/theme';
import type { HeroSky } from '../features/heroSky';

export default function HeroAtmosphere() {
  const { location, now, preset, isDay, enabled, preview, ready } = useAtmosphere();
  const { resolved } = useTheme();
  const [sky, setSky] = useState<HeroSky | null>(null);
  useEffect(() => {
    let current = true;
    // Separate chunk: content and weather remain usable if astronomy cannot load.
    import('../features/heroSky')
      .then(({ calculateHeroSky }) => {
        const next = calculateHeroSky(location, now);
        if (current) setSky(next);
      })
      .catch(() => {
        if (current) setSky(null);
      });
    return () => {
      current = false;
    };
  }, [location, now]);
  const angle = preview?.moonPhase ?? sky?.phase;
  const moon = angle == null ? null : moonShape(angle);
  return (
    <div
      className="hero-atmosphere"
      aria-hidden="true"
      hidden={!enabled}
      data-preset={ready ? preset : 'overcast'}
      data-time={ready ? (isDay ? 'day' : 'night') : 'day'}
      data-resolved-theme={resolved}
      data-preview={Boolean(preview)}
    >
      <div className="sky-gradient" />
      {sky && (
        <svg className="constellation-layer" viewBox="0 0 1000 700" data-sky-time={sky.skyTime}>
          {sky.lines.map((line) => (
            <path key={line.name} d={line.path} data-constellation={line.name} />
          ))}
          {sky.stars.map((star, i) => (
            <circle key={i} cx={star.x} cy={star.y} r={i % 5 === 0 ? 2.8 : 1.6} />
          ))}
        </svg>
      )}
      <div
        hidden={!ready}
        className="celestial-body"
        data-body={resolved === 'dark' ? 'moon' : 'sun'}
      >
        {resolved === 'light' ? (
          <svg viewBox="0 0 100 100" className="hero-sun">
            <circle cx="50" cy="50" r="36" />
            <circle className="sun-ring" cx="50" cy="50" r="45" />
          </svg>
        ) : (
          moon && (
            <svg
              viewBox="0 0 100 100"
              className="hero-moon"
              data-phase={moon.name}
              data-angle={angle}
              data-waxing={moon.waxing}
            >
              <circle className="moon-shadow" cx="50" cy="50" r="46" />
              {moon.name !== 'new' &&
                (moon.name === 'full' ? (
                  <circle className="moon-light" cx="50" cy="50" r="46" />
                ) : (
                  <path className="moon-light" d={moon.path} />
                ))}
              <circle className="moon-outline" cx="50" cy="50" r="46" />
            </svg>
          )
        )}
      </div>
      <div className="cloud-layer">
        <span />
        <span />
        <span />
      </div>
      <div className="precipitation-layer" />
      <div className="sky-readability" />
    </div>
  );
}

export function WeatherStatus() {
  const { weather, weatherLocation, preset, preview, result, ready } = useAtmosphere();
  const observation = weather
    ? new Intl.DateTimeFormat('en-US', {
        timeZone: weather.timezone,
        hour: 'numeric',
        minute: '2-digit',
      }).format(weather.fetchedAt)
    : '';
  return (
    <div className="hero-weather" style={{ visibility: ready ? 'visible' : 'hidden' }}>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => window.dispatchEvent(new Event('portfolio:sky'))}
      >
        {preview ? 'Preview' : weatherLocation.label} ·{' '}
        {preview || weather ? labels[preset] : result ? 'Weather unavailable' : 'Checking weather'}
        {weather?.temperature != null && !preview ? ` · ${Math.round(weather.temperature)}°F` : ''}
        <span aria-hidden="true"> ↗</span>
      </button>
      <span>
        {preview
          ? 'Simulated atmosphere · not live weather'
          : weather
            ? `Checked ${observation} · reused for up to 15 min`
            : 'Chicago time-of-day atmosphere'}
      </span>
    </div>
  );
}
