import { useMemo, useState } from 'react';
import Illustration from '../components/Illustration';
import { useTheme } from './theme';
import { useAtmosphere } from './AtmosphereProvider';
import { labels } from './atmosphere';
import { calculateSky, compass } from './astronomy';
import { chicago, requestLocation } from './weather';

export default function SkyExperience({ base }: { base: string }) {
  const {
    location,
    selectLocation,
    now,
    refresh,
    result: weather,
    weather: currentWeather,
    enabled,
    setEnabled,
    preset,
    preview,
  } = useAtmosphere();
  const { resolved } = useTheme();
  const [locating, setLocating] = useState(false);
  const [notice, setNotice] = useState('');
  const sky = useMemo(() => {
    try {
      return calculateSky(location, now);
    } catch {
      return null;
    }
  }, [location, now]);
  const timezone =
    weather?.weather && weather.location === location
      ? weather.weather.timezone
      : location === chicago
        ? 'America/Chicago'
        : Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  async function localSky() {
    setLocating(true);
    setNotice('');
    try {
      const next = await requestLocation();
      selectLocation(next);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Location unavailable. Showing Chicago.');
      selectLocation(chicago);
    } finally {
      setLocating(false);
    }
  }
  function useChicago() {
    selectLocation(chicago);
    setNotice('');
  }
  return (
    <div className="sky-experience">
      <div className="sky-intro">
        <div>
          <p className="eyebrow">A SMALL WINDOW INTO THE NIGHT</p>
          <p>
            {location.label} <span className="sky-time">· {formatTime(now)}</span>
          </p>
        </div>
        <Illustration
          name={resolved === 'dark' ? 'sleepy-espeon' : 'skitty-hi'}
          base={base}
          size={64}
        />
      </div>
      <div className="location-actions">
        <button type="button" className="quiet-button" disabled={locating} onClick={localSky}>
          {locating ? 'Finding your sky…' : 'Use my local sky'}
        </button>
        {location !== chicago && (
          <button type="button" className="quiet-button" onClick={useChicago}>
            Use Chicago
          </button>
        )}
        <button type="button" className="quiet-button" onClick={refresh}>
          Refresh sky
        </button>
      </div>
      <p className="sky-privacy">
        Location is optional. Coordinates are rounded before the weather request and kept only in
        this tab’s memory.
      </p>
      <p className="sky-status" role="status">
        {notice ||
          (preview
            ? 'Preview mode: weather is simulated.'
            : weather
              ? weather.message
              : 'Checking the weather…')}
      </p>
      <div className="weather-control">
        <div>
          <p>Atmosphere · {weather?.location.label ?? location.label}</p>
          <span>
            {preview
              ? `Preview · ${labels[preset]}`
              : weather
                ? currentWeather
                  ? labels[preset]
                  : 'Time-of-day fallback'
                : 'Static while weather loads'}
          </span>
        </div>
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => setEnabled(event.target.checked)}
          />{' '}
          Show atmosphere
        </label>
      </div>
      <p className="sky-privacy">
        Chicago’s atmosphere appears automatically. You can hide it for this visit. The decorative
        Moon follows the theme and current lunar phase; its corner position is composed for the
        page, not its true sky position.
      </p>
      {sky ? (
        <>
          <div className="moon-summary">
            <span aria-hidden="true">☾</span>
            <div>
              <h3>{sky.phase}</h3>
              <p>{sky.illumination}% of the Moon’s visible disk illuminated</p>
            </div>
          </div>
          <dl className="sky-events">
            {sky.events.map((event) => (
              <div key={event.label}>
                <dt>{event.label}</dt>
                <dd>{event.date ? formatTime(event.date) : 'No event in the next 48 hours'}</dd>
              </div>
            ))}
          </dl>
          <p className="sky-privacy">
            Times: {timezone}. Rise/set estimates assume an unobstructed horizon near sea level.
          </p>
          <h3 className="sky-subheading">Above the horizon now</h3>
          <div className="sky-map-layout">
            <svg viewBox="0 0 240 240" className="sky-map" aria-hidden="true">
              <circle cx="120" cy="120" r="94" />
              <circle cx="120" cy="120" r="47" className="sky-guide" />
              <path d="M26 120H214M120 26V214" className="sky-guide" />
              <text x="120" y="16" textAnchor="middle">
                N
              </text>
              <text x="229" y="125" textAnchor="middle">
                E
              </text>
              <text x="120" y="237" textAnchor="middle">
                S
              </text>
              <text x="10" y="125" textAnchor="middle">
                W
              </text>
              {sky.objects.map((object, index) => {
                const radius = ((90 - object.altitude) / 90) * 94;
                const angle = (object.azimuth * Math.PI) / 180;
                return (
                  <g
                    key={object.name}
                    transform={`translate(${120 + Math.sin(angle) * radius}, ${120 - Math.cos(angle) * radius})`}
                  >
                    <circle r="8" className="sky-object" />
                    <text y="3" textAnchor="middle" className="sky-object-label">
                      {index + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
            <ol className="sky-objects">
              {sky.objects.map((object) => (
                <li key={object.name}>
                  <strong>{object.name}</strong>
                  <span>
                    {Math.round(object.altitude)}° up · {compass(object.azimuth)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          {!sky.objects.length && (
            <p className="feature-message">
              The Moon and the five listed planets are below the horizon right now.
            </p>
          )}
          <p className="sky-privacy">
            Map center is directly overhead; the outer ring is the horizon. Positions are calculated
            for the displayed time, including daytime. Being above the horizon does not guarantee
            visibility through daylight, weather, buildings, or terrain.
          </p>
        </>
      ) : (
        <p className="feature-message" role="status">
          Sky calculations are unavailable. Weather controls and the portfolio are still usable.
        </p>
      )}
      <div className="sky-credits">
        <a href="https://ofrohn.github.io/">Constellation data: D3-Celestial</a>
        <a href="https://open-meteo.com/">Weather by Open-Meteo</a>
        <span>·</span>
        <a href="https://github.com/cosinekitty/astronomy">Calculated with Astronomy Engine</a>
      </div>
    </div>
  );
}
