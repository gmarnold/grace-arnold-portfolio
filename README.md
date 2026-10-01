# Grace Arnold · Software Engineering Portfolio

**[Explore the portfolio](https://gmarnold.github.io/grace-arnold-portfolio/)** · [Résumé](https://gmarnold.github.io/grace-arnold-portfolio/grace-arnold-resume.pdf) · [LinkedIn](https://www.linkedin.com/in/grace-m-arnold/) · [Email](mailto:grace.m.arnold@outlook.com)

I built this portfolio to show how I approach a complete product: clear professional content, accessible interactions, and optional creative features that leave the core experience fast and reliable.

I’m a software engineer with full-stack production ownership, a research background, and experience teaching and mentoring. My professional frontend work is primarily in Vue and Angular; this project puts React and TypeScript into practice through a complete, tested, deployed product.

## What to explore

- **Production ownership:** Calendar and Chat features at QSRSoft, supporting 1,000+ franchise managers from requirements through rollout and production support.
- **Creative development:** Star Baker, a solo Unity/C# game with a playable release and a case study that explains implementation decisions and remaining limitations.
- **Research engineering:** Python data-processing and visualization workflows, paired with workshops that helped colleagues use the tools.
- **The portfolio itself:** an expandable engineering case study, a searchable command palette, system-aware themes, and an automatic Chicago sky atmosphere.

## Technology and purpose

| Layer             | Technology                                             | Why it is here                                                                                                            |
| ----------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Interface         | React, strict TypeScript                               | Typed content and focused components, with explicit states for preferences, permissions, loading, and failure.            |
| Build and styling | Vite, Tailwind CSS, semantic CSS tokens                | A small static deployment and a shared visual system across warm light and aubergine dark themes.                         |
| Initial rendering | React build-time prerendering                          | Recruiters and search engines receive meaningful HTML immediately. Core content and case studies work without JavaScript. |
| Interaction       | Native dialog, disclosure, select, and anchor elements | Familiar browser behavior, keyboard access, and simpler focus management without a UI framework.                          |
| Weather           | Open-Meteo forecast API                                | A real asynchronous integration with validated responses, timeout handling, request reuse, caching, and fallbacks.        |
| Astronomy         | Astronomy Engine, custom SVG                           | Local celestial calculations and a small constellation dataset, progressively loaded after core content.                  |
| Verification      | Vitest, React Testing Library, Playwright, axe         | Behavior tests and production-browser journeys, including accessibility and failure paths.                                |
| Delivery          | GitHub Actions, GitHub Pages                           | Repeatable verification and a release workflow that checks the production build before publishing.                        |

## Engineering decisions

**Keep the important path independent.** Experience, projects, contact links, and the resume do not depend on a weather API or astronomy code. I load the atmosphere progressively after the core HTML, using current Chicago weather and local astronomical calculations. The details panel stays on demand. Weather failure falls back from an opted-in location to Chicago, then to a neutral time-of-day treatment.

**Use a coherent theme system.** I pair a soft Sun and Skitty illustration with light mode, and a phase-aware Moon and Sleepy Espeon with dark mode. System mode follows the device, including changes while the page is open. Explicit light/dark choices persist when storage is available. A small pre-stylesheet script applies saved preferences, while CSS provides an OS-aware fallback without JavaScript.

**Make interactions discoverable and accessible.** The command palette supports Ctrl/Cmd+K and a visible mobile-accessible button, searchable commands, arrow-key navigation, Escape dismissal, and focus restoration. Standard navigation remains available. Decorative artwork never substitutes for a control’s label.

**Treat optional location as optional.** Geolocation is requested only after an intentional click. Coordinates are rounded before weather requests and held only in tab memory. Weather results are reused for 15 minutes; no API secret or precise location is stored in the repository or browser storage.

**Represent the sky honestly.** I project a small set of real constellation coordinates into the local sky using Astronomy Engine. At night I use the current sky; during daylight I use the coming evening, 30 minutes after civil twilight. The decorative Moon uses the current lunar phase, with the lit side changing between waxing and waning. Its corner position is an illustration choice, not a claim about where the Moon is overhead. The panel calculates moon phase, upcoming rise/set events, and above-horizon positions. It distinguishes calculated position from actual observing visibility, and accounts for locations where a rise or set does not occur in the search window.

**Choose infrastructure for the job.** GitHub Pages fits a static portfolio. Browser-side public weather data and local astronomy calculations do not currently justify a backend, database, or cloud credentials. The design leaves room for a service only when it solves a real requirement.

## Atmosphere and resilience

I use Open-Meteo WMO codes to select 13 distinct weather treatments: clear, mainly clear, partly cloudy, overcast, fog, drizzle, rain, heavy rain, snow, heavy snow, storm, freezing precipitation, and hail. Clouds sit in front of the Sun/Moon and partially obscure the constellations. Weather and exact sky data enhance the page without blocking my experience, projects, or contact details.

I keep motion restrained: slow clouds, CSS rain or snow, no moving constellations, and no storm flashes. Reduced-motion preferences stop all atmospheric animation. I use SVG/CSS rather than a particle or 3D framework, and reused the existing astronomy dependency. No new runtime dependency was needed.

I document deterministic weather, theme, and Moon-phase preview links in [Atmosphere preview](docs/ATMOSPHERE_PREVIEW.md). Preview values never persist or masquerade as current weather. My [maintenance notes](docs/MAINTENANCE.md) cover the test/build commands.

## Quality and delivery

The release pipeline checks TypeScript, ESLint, formatting, unit tests, and the production build before running browser tests and publishing. Browser coverage exercises desktop/mobile navigation, resume downloads, case studies, focus behavior, themes, reduced motion, no-JavaScript content, responsive overflow, and optional-feature failure paths. axe checks supplement visual review; they are not a claim of complete accessibility conformance.

```text
Typed content + React components
          ↓
Type, lint, formatting + unit checks
          ↓
Vite production build + prerendered HTML
          ↓
Browser journeys + accessibility checks
          ↓
GitHub Pages
```

The visual system uses self-hosted, openly licensed fonts, optimized project images, reserved image dimensions, restrained motion, and visible keyboard focus. Native section links avoid static-host deep-link refresh failures.

Six original fan-art illustrations drawn by me add small personal touches. Transparent WebP derivatives keep them lightweight; decorative semantics keep them out of screen-reader navigation, and the animated source uses a still frame to avoid unnecessary motion.

## A closer look at the code

- [Typed career and project content](src/content.ts)
- [Theme preferences and OS subscription](src/features/theme.ts)
- [Searchable command palette](src/components/CommandPalette.tsx)
- [Weather caching and fallback behavior](src/features/weather.ts)
- [Local astronomy calculations](src/features/astronomy.ts)
- [Browser acceptance tests](tests/enhancements.spec.ts)
- [Verified release workflow](.github/workflows/deploy.yml)

Career claims and project assets are grounded in the [documented sources](SOURCES.md). Employer case studies use public-safe descriptions rather than proprietary code or invented screenshots.
