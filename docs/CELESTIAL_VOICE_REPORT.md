# Celestial and voice iteration — completion report

Recovered and completed on October 1, 2026. The interrupted pass had implemented most changes but stopped during browser verification. Recovery fixed the JSON import required by Node, completed documentation, isolated astronomy download failures from the panel controls, and corrected an ambiguous location-status test.

## Changes and affected files

- `src/components/HeroAtmosphere.tsx`, `src/atmosphere.css`, and `src/features/atmosphere.ts`: theme-aware constellation contrast, bounded phase/weather intensity, revised layering, and preview controls.
- `src/features/AtmosphereProvider.tsx`, `src/features/heroSky.ts`, `src/features/astronomy.ts`, and `src/features/SkyExperience.tsx`: shared hero projection, actual tonight information, reproducible preview date, and astronomy failure isolation.
- `src/features/precipitation.ts`: deterministic particle profiles and generation.
- `src/App.tsx`: requested tagline, house-tour microcopy, removal of the empty slogan, and header/footer illustration marks.
- `src/components/BrandMark.tsx`, `src/enhancements.css`, `scripts/illustrations.ts`, and two `public/illustrations/*-mark.webp` derivatives: decorative 32px theme marks from cropped transparent originals, exported at 96px for high-density displays. Original artwork remains intact.
- Astronomy, atmosphere, and precipitation unit tests; `tests/celestial.spec.ts`, plus existing artwork, atmosphere, and enhancement browser tests.
- `README.md`, `docs/ATMOSPHERE_PREVIEW.md`, `docs/MAINTENANCE.md`, and this report: updated behavior, generated-asset documentation, QA URLs, and next-iteration copy candidates.

## Constellation visibility and composition

Dark mode uses pale lavender (`#e3d6ef`), 1.25px strokes, and a static 2px drop shadow. Light mode uses darker ink, 65% of the computed intensity, and no glow. One SVG contains the projected constellation segments and stars.

Intensity is `max(0.74, 1 - 0.18 * lunar illumination - weather veil)`. The veil is zero for clear conditions, 0.04 for lighter weather, and 0.08 for overcast, fog, heavy precipitation, storms, and hail. Clear new/full moons therefore produce 100%/82%; storm plus full Moon reaches the 74% floor. Waxing and waning brightness follow illumination, without making the design disappear.

The layer order is gradient → clouds → Sun/Moon → constellations → precipitation → text-protection overlay. Clouds remain behind the celestial artwork. The existing spatial fades protect copy and keep the scene contained in the hero; the floor governs constellation intensity before those composition masks. Glow never pulses. Screenshots reviewed include desktop storm/full Moon and mobile clear/new Moon, plus desktop light/partly-cloudy, with additional clear/full, overcast/crescent, and overcast/gibbous desktop/mobile artifacts in `.local/`.

## What the sky panel displays

The provider computes the hero's projection once for a location/time update and shares it with the panel. At night the projection uses the current time; during daylight/twilight it uses the coming evening, 30 minutes after civil twilight.

The panel shows that observing time, tracked planets above the horizon with altitude/direction, and major catalogued constellations with above-horizon line segments in the hero data. It retains calculated current Moon phase/illumination, upcoming sunrise/sunset/moonrise/moonset, and the current-position map. It explains that position above the horizon does not guarantee observing visibility. The illustrated Moon position remains a composition choice.

A failed astronomy import leaves weather/location/atmosphere controls usable and omits astronomical facts. There is no invented planet or constellation fallback. A failed panel bundle still uses the existing error boundary. Preview phase overrides change decorative brightness and Moon shape; the panel reports calculated facts for its displayed date.

## Precipitation, determinism, and performance

A local integer PRNG with fixed default seed 7319 generates positions, duration, negative delay, length, width, opacity, drift, sway, angle, and rotation. No clock or `Math.random()` affects particle layout. Output is memoized by preset.

Drizzle is fine and sparse; rain is faster with varied streaks; heavy rain adds density and broader speed/length variation. Snow uses slow multi-step drift and rotation; heavy snow adds density and stronger drift. Freezing precipitation mixes rain and irregular ice paths; hail uses quick pellet motion. Storms use stronger wind-driven drift and angles, without flashes. Three interleaved depth groups accompany varied sizes/speeds/opacity. Profiles contain 22–68 particles, stay clipped to the hero, and animate transforms without per-frame React updates or a new library.

Reduced motion stops both particles and cloud translation, retaining distributed static texture. Preview `motion=freeze` pauses at deterministic negative offsets; `motion=slow` runs at quarter speed. Neither overrides reduced motion.

Unit tests check deterministic seeded output, alternate seeds, bounded density, varied finite parameters, profile ranges, and phase/weather intensity floors. Browser tests check computed contrast/layer order, repeated CSS parameters, distinct animation families, reduced motion, data correspondence, failure handling, focus restoration, and theme mark footprints. They do not assert exact per-particle pixels.

## Voice, branding, and recruiter hierarchy

“You had me at Hello World.” replaces the secondary slogan. “Do you want the house tour?” replaces the scroll hint, with an accessible label pointing to selected work. “Built with care. Made for people.” is removed. The professional introduction remains intact, and substantive project/experience copy remains unchanged.

Light mode uses Skitty Hi and dark mode uses Sleepy Espeon in the header/footer; System follows the resolved device theme. The marks have fixed equivalent 32px footprints, transparent backgrounds, empty alt text, decorative semantics, and no pointer interaction. Functional icons retain their normal labels and behavior.

The hierarchy still exposes Grace Arnold and the software engineer role immediately, followed by the concrete interfaces/services/production introduction and work/contact actions. QSRSoft production ownership, Star Baker, and research work remain prominent. Résumé access stays in navigation/experience; GitHub remains in contact and Quick links. The theme artwork is a small signature beside the name.

## Verification

`npm run check` passes TypeScript, ESLint, formatting, all 50 unit tests across five files, asset generation, the production build, and prerendering. `npm run test:e2e -- --workers=2` passes all 52 desktop/mobile browser tests, including axe accessibility scans and the repaired astronomy/location failure paths.

Browser coverage includes WCAG A/AA axe scans, keyboard focus, reduced motion, no-JavaScript content, downloads, astronomy/weather/location failure paths, and widths 320, 390, 768, 1440, and 1920px. Automated accessibility checks supplement visual/keyboard review; no exhaustive device-performance benchmark was run.

## Exact previews

Run `npm run preview -- --port 4173` after the build. Useful local combinations:

- [Dark clear / new Moon](http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=clear&theme=dark&time=night&moonPhase=new&skyDate=2026-10-01T04:00:00Z&motion=freeze)
- [Dark clear / full Moon](http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=clear&theme=dark&time=night&moonPhase=full&skyDate=2026-10-01T04:00:00Z&motion=freeze)
- [Dark overcast / crescent](http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=overcast&theme=dark&time=night&moonPhase=crescent&skyDate=2026-10-01T04:00:00Z&motion=freeze)
- [Dark overcast / gibbous](http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=overcast&theme=dark&time=night&moonPhase=gibbous&skyDate=2026-10-01T04:00:00Z&motion=freeze)
- [Dark storm / full Moon](http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=storm&theme=dark&time=night&moonPhase=full&skyDate=2026-10-01T04:00:00Z&motion=freeze)
- [Light cloudy](http://127.0.0.1:4173/grace-arnold-portfolio/?atmosphere=partly-cloudy&theme=light&time=day&skyDate=2026-10-01T18:00:00Z&motion=freeze)

The [atmosphere preview guide](ATMOSPHERE_PREVIEW.md) includes individual drizzle, rain, heavy-rain, snow, heavy-snow, freezing, hail, and storm URLs. All overrides require a valid `atmosphere` preset and never persist. Remove the query to return to live weather. Publication uses the separately approved GitHub Pages workflow; deployed preview links are also listed in the guide.

## COPY / CONTENT CANDIDATES FOR NEXT ITERATION

These are recommendations only; the copy below has not been removed.

| Current copy / section                                                                                                                                      | Why it may not be earning its space                                                                    | Recommended direction                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| “THE THROUGH LINE” and “I connect the details that make software work: a clear interface, a reliable service, and a team that understands both.”            | Repeats the hero's interface/services/ownership point and delays arrival at work.                      | Consider removing the band or reducing it to one concrete bridge into projects.                                                    |
| “Practical problems. Personal craft.” and “Production experience, creative exploration, and the decisions behind the work.”                                 | Both introduce selected work without giving information beyond the cards beneath them.                 | Keep a simple Selected work heading; let the project titles carry personality.                                                     |
| QSRSoft summary, case-study “The work,” “Outcome & scope,” and experience description                                                                       | The Calendar/Chat ownership arc and 1,000+ managers recur in several nearby places.                    | Keep the metric once in the overview; use expanded details for a specific engineering decision while preserving public-safe facts. |
| “A small product, built with the same care I bring to production software.” in Engineering                                                                  | The care claim is generic; the adjacent React versus Vue/Angular distinction is useful.                | Lead with that concrete distinction, leaving architecture/test detail in the existing disclosure.                                  |
| “For me, ownership includes the follow-through: supporting a release, explaining a decision, and helping the next engineer find their way.”                 | Repeats production support and mentoring already established elsewhere.                                | Consider removing the disclosure unless it can add a concrete example.                                                             |
| “I like making complicated things easier to use—and easier to understand.” and “I’m drawn to useful products and the care it takes to make them work well.” | Broad claims recur in the hero and through-line; the cake/research/teaching details are more personal. | Begin About with those specific connections and shorten the general framing.                                                       |
| “Something useful starts with a conversation.” plus “Say hello. I’d love to hear what you’re building.”                                                     | Two invitation lines compete with the concrete role/location availability and email.                   | Keep one warm invitation alongside the clear availability statement.                                                               |
| “Thoughtfully built with React & TypeScript.” in the footer                                                                                                 | The adverb adds little; the technology already appears in the engineering disclosure.                  | Shorten to the factual stack or remove the footer sentence.                                                                        |
