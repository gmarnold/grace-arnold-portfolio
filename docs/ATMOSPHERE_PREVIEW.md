# Atmosphere preview

I use temporary query parameters to review every visual state without relying on the current Chicago weather. A valid `atmosphere` value enables preview mode and bypasses the weather API. The visible status says **Preview**. No preview value or theme change made in preview mode is saved.

My deployed base URL is `https://gmarnold.github.io/grace-arnold-portfolio/`; my production preview uses `http://127.0.0.1:4173/grace-arnold-portfolio/`. Append the same query strings to either base. The deployed URLs work after this revision is published.

| Preset        | Direct Sun / day / light preview                                                                                  | Expected treatment                       |
| ------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| clear         | [Clear](https://gmarnold.github.io/grace-arnold-portfolio/?atmosphere=clear&time=day&theme=light)                 | Soft warm Sun, open sky                  |
| mostly-clear  | [Mainly clear](https://gmarnold.github.io/grace-arnold-portfolio/?atmosphere=mostly-clear&time=day&theme=light)   | Thin, sparse clouds                      |
| partly-cloudy | [Partly cloudy](https://gmarnold.github.io/grace-arnold-portfolio/?atmosphere=partly-cloudy&time=day&theme=light) | Visible cloud banks, open sky between    |
| overcast      | [Overcast](https://gmarnold.github.io/grace-arnold-portfolio/?atmosphere=overcast&time=day&theme=light)           | Layered clouds, muted constellations     |
| fog           | [Fog](https://gmarnold.github.io/grace-arnold-portfolio/?atmosphere=fog&time=day&theme=light)                     | Broad soft haze                          |
| drizzle       | [Drizzle](https://gmarnold.github.io/grace-arnold-portfolio/?atmosphere=drizzle&time=day&theme=light)             | Clouds and sparse fine streaks           |
| rain          | [Rain](https://gmarnold.github.io/grace-arnold-portfolio/?atmosphere=rain&time=day&theme=light)                   | Clouds and moderate rain                 |
| heavy-rain    | [Heavy rain](https://gmarnold.github.io/grace-arnold-portfolio/?atmosphere=heavy-rain&time=day&theme=light)       | Denser rainfall and cloud cover          |
| snow          | [Snow](https://gmarnold.github.io/grace-arnold-portfolio/?atmosphere=snow&time=day&theme=light)                   | Sparse drifting flakes                   |
| heavy-snow    | [Heavy snow](https://gmarnold.github.io/grace-arnold-portfolio/?atmosphere=heavy-snow&time=day&theme=light)       | Denser flakes                            |
| storm         | [Storm](https://gmarnold.github.io/grace-arnold-portfolio/?atmosphere=storm&time=day&theme=light)                 | Darker clouds and heavy rain; no flashes |
| freezing      | [Freezing](https://gmarnold.github.io/grace-arnold-portfolio/?atmosphere=freezing&time=day&theme=light)           | Cool, heavier icy streaks                |
| hail          | [Hail](https://gmarnold.github.io/grace-arnold-portfolio/?atmosphere=hail&time=day&theme=light)                   | Storm clouds and faster ice pellets      |

For **Moon / night / dark**, replace `time=day&theme=light` with `time=night&theme=dark` in any link. For example:

- [Rain at night](https://gmarnold.github.io/grace-arnold-portfolio/?atmosphere=rain&time=night&theme=dark)
- [Snow at night](https://gmarnold.github.io/grace-arnold-portfolio/?atmosphere=snow&time=night&theme=dark)
- [Clear night with crescent Moon](https://gmarnold.github.io/grace-arnold-portfolio/?atmosphere=clear&time=night&theme=dark&moonPhase=crescent)

I intentionally keep time and theme independent: `time` controls daylight/star treatment; the resolved theme selects Sun or Moon. I can also inspect `time=day&theme=dark` or `time=night&theme=light`. Without `theme`, my saved/OS preference applies, and the existing System control follows OS changes while open. Preview defaults to daytime when `time` is absent or invalid.

## Moon phases

I can append `&moonPhase=new`, `crescent`, `quarter`, `gibbous`, or `full` to any valid atmosphere preview. For example, [a quarter Moon through clouds](https://gmarnold.github.io/grace-arnold-portfolio/?atmosphere=partly-cloudy&time=night&theme=dark&moonPhase=quarter). These QA overrides use waxing phases. The real Moon supports both waxing and waning. An override by itself, an invalid phase, or an unknown atmosphere value never replaces the real calculation.

I remove the query string to return to real Chicago weather and current lunar phase. Preview overrides never persist.

## How the real scene works

I use Open-Meteo's current WMO weather code, daylight flag, and temperature in Fahrenheit. I centralize the full supported WMO mapping in `src/features/atmosphere.ts`: 0/1/2/3 select clear through overcast; 45/48 fog; 51/53/55 drizzle; 56/57/66/67 freezing precipitation; 61/63/80 rain; 65/81/82 heavy rain; 71/73/77/85 snow; 75/86 heavy snow; 95 storm; 96/99 hail. Unknown codes normalize safely to overcast; unrecognized API data is rejected and described as unavailable rather than current weather.

I cache successful requests for 15 minutes, deduplicate concurrent requests, and abort after five seconds. Failed local weather falls back to Chicago. If that fails, I use a neutral Chicago time-of-day treatment (06:00–18:00 for the fallback day period), omit temperature, and label weather unavailable. Expired data is not reused as current after a failed refresh. No permission prompt runs on page load.

I project real J2000 constellation star coordinates from a small licensed D3-Celestial subset. Astronomy Engine rotates them to the equator of date, then calculates altitude/azimuth for the observer. I omit below-horizon segments and use a north-up azimuthal projection. During daylight/twilight, I show the upcoming evening, 30 minutes after the Sun reaches −6° altitude. At night I show the current sky. The display is a selected, stylized field with a vertical fade, not a complete observing chart; star sizes are illustrative. I calculate Moon phase for the current instant regardless of the constellation time. Lunar phase is effectively shared across locations; Chicago supplies the observing date/time and default sky orientation. The Moon's corner position and upright waxing/waning orientation are composed for the page, not its true altitude or parallactic angle.

I update sky data every 15 minutes while the page is visible and when returning to the tab. The existing Astronomy Engine is reused; the only new data is the local constellation subset, not a new dependency. Core content remains prerendered and usable without JavaScript. If the astronomy chunk fails, the gradient/weather remain available and I omit an unverified Moon rather than invent its phase.

## Celestial legibility and particle QA

Use these exact local production URLs after `npm run build` and `npm run preview`. The fixed `skyDate` makes astronomical projection reproducible. `time` controls atmosphere styling only; it does not change the astronomy clock. `moonPhase` changes the decorative Moon and constellation intensity only; the panel always reports the calculated phase for the displayed date.

- Clear / new moon: <http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=clear&theme=dark&time=night&moonPhase=new&skyDate=2026-10-01T04:00:00Z&motion=freeze>
- Clear / full moon: <http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=clear&theme=dark&time=night&moonPhase=full&skyDate=2026-10-01T04:00:00Z&motion=freeze>
- Overcast / crescent: <http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=overcast&theme=dark&time=night&moonPhase=crescent&skyDate=2026-10-01T04:00:00Z&motion=freeze>
- Overcast / gibbous: <http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=overcast&theme=dark&time=night&moonPhase=gibbous&skyDate=2026-10-01T04:00:00Z&motion=freeze>
- Storm / full moon: <http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=storm&theme=dark&time=night&moonPhase=full&skyDate=2026-10-01T04:00:00Z&motion=freeze>
- Light / cloudy: <http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=partly-cloudy&theme=light&time=day&skyDate=2026-10-01T18:00:00Z&motion=freeze>

Inspect the individual precipitation presets in motion:

| Effect                | Local production URL                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------- |
| Drizzle               | <http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=drizzle&theme=dark&time=night>    |
| Rain                  | <http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=rain&theme=dark&time=night>       |
| Heavy rain            | <http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=heavy-rain&theme=dark&time=night> |
| Snow                  | <http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=snow&theme=dark&time=night>       |
| Heavy snow            | <http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=heavy-snow&theme=dark&time=night> |
| Sleet / freezing rain | <http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=freezing&theme=dark&time=night>   |
| Hail                  | <http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=hail&theme=dark&time=night>       |
| Storm                 | <http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=storm&theme=dark&time=night>      |

Append `&motion=freeze` to pause clouds and particles at deterministic animation offsets, or `&motion=slow` for one-quarter speed. These controls require a valid atmosphere preview, never persist, and never override reduced motion. Invalid dates and controls are ignored. Remove the query to restore live conditions.

The constellation intensity is `max(0.74, 1 − 0.18 × lunar illumination − weather veil)`. The veil is 0 for clear, 0.04 for light weather, and 0.08 for overcast/fog/heavy precipitation/storm. Clear new/full moons therefore yield 100%/82%; storm plus full moon yields 74%. Dark artwork uses pale lavender, 1.25px lines, and a static 2px shadow. Light mode applies a 65% multiplier with a darker ink and no glow. The scene order is gradient → clouds → Sun/Moon → constellations → particles → text-protection overlay. A single constellation SVG is rendered; no duplicated astronomy or full-page glow layer is needed.

Particle generation uses a fixed local integer seed and independently varied positions, negative delays, duration, opacity, dimensions, angle, rotation, and drift. Preset-specific ranges distinguish fine drizzle, fast rain, drifting snow, mixed rain/ice, quick hail, and wind-driven storms. Three interleaved groups provide depth variation without a second scene. Counts range from 22 to 68, animations use transforms, and particles remain contained in the clipped hero. No animation-frame React updates run. Reduced motion leaves the particles at their static distributed starting positions.

The provider loads the hero astronomy once per location/time update and shares the result with the panel. The panel lists planets above the horizon at the hero's current-night/coming-evening time and major catalogued constellations with above-horizon segments, alongside the current Moon phase and existing rise/set/current-position details. Above-horizon position does not promise observational visibility. If astronomy fails, the gradient/weather remain, but the panel omits astronomical facts.

Unit checks cover seeded determinism, numeric validity, parameter ranges, bounded density, every phase/weather intensity floor, and shared astronomy time/projection. Browser checks exercise computed contrast treatment, layer order, repeatable CSS, distinct motion, reduced motion, keyboard focus restoration, failure honesty, theme mark footprints, axe, and responsive overflow. Screenshots are visual review artifacts rather than brittle per-particle pixel assertions.

## QA and accessibility

I run `npm run check` for types, lint, formatting, unit tests, and production build; then `npm run test:e2e -- --workers=2` for browser checks. `npm run preview` serves the built output. I use the existing Playwright screenshots in ignored `.local/` to review representative weather/theme combinations. I inspect 320, 390, 768, 1440, and 1920px layouts.

Reduced motion stops clouds, rain, snow, and hail; static texture preserves the preset. Constellations and the Sun/Moon never animate. Storms never flash. All decorative layers are `aria-hidden` and ignore pointer input. The details panel's **Show atmosphere** checkbox hides the scene for the current visit; core navigation and contact controls remain independent.
