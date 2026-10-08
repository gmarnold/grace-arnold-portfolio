# Content and asset provenance

Reviewed September 30, 2026.

- Career facts: my original project brief, with QSRSoft ending September 2026. These take precedence over the older portfolio. My supplied public resume is in public/Grace_Arnold_Resume.pdf and is published unchanged.
- [Old portfolio source](https://github.com/gmarnold/ProfessionalWebsite): inspected source and built bundle read-only. Earlier student positioning is outdated; no old portrait or personal photos reused.
- [Star Baker README](https://github.com/gmarnold/Unity-Create-with-Code#star-baker): original game versus course prototypes, development decisions, known coroutine limitation, free Unity Asset Store art, and gameplay video. I developed the project on my own.
- [Gameplay scripts](https://github.com/gmarnold/Unity-Create-with-Code/tree/main/Star%20Baker/Assets/Scripts): inspected GameManager, PlayerController, MoveLeft, DifficultyButton, and RepeatBackground. Verified random spawns, force/torque motion, power-up timing, scoring, and collision handling. Did not modify the source project.
- [Star Baker play page](https://grachay.itch.io/star-baker): verified reachable and instructions consistent with source. Real screenshot downloaded from the page's image `https://img.itch.zone/aW1nLzExNTQ0NzE3LnBuZw==/original/79NaYz.png`, resized to 1200px wide and encoded as WebP. The game art is not claimed as my original illustration.
- [Gameplay video](https://user-images.githubusercontent.com/50962446/232926442-03b4d9b5-d7b7-4594-8013-80ce042cbcd1.mp4): linked from the project README; external rather than embedded to avoid unnecessary page weight.

## Selection decisions

Featured QSRSoft production ownership, Star Baker's solo creative development, and Illinois Tech research engineering. Together these demonstrate production responsibility, debugging, initiative, data work, and communication without inventing new outcomes.

Other repositories reviewed before selection:

- TwitchNetwork: README and Python implementation show a joint project with Gladys Toledo-Rodriguez; individual responsibility is unclear and the legacy code needs review before recommendation. Not featured.
- FakeNewsClassification: README has only a title and notebook markdown adds no substantive explanation. Not enough context to establish individual contribution, evaluation, or responsible limitations; not featured.
- Unity course prototypes and Creator-Kit-FPS: tutorial/kit context makes them less distinctive than the independently developed Star Baker. No tutorial assets are presented as original authored work.
- ICS-Labs: repository description identifies a course/lab collection; not selected as evidence of original product work.

QSRSoft's typography panel is an editorial scope illustration, not an employer UI screenshot. Research workload volume is not presented as a benchmark or speed improvement.

## Optional exploration features

- I drew the six custom Pokémon fan-art illustrations. The original files are in `public/illustrations`: five named PNGs plus `gamerrex.gif` for Calyrex. WebP versions fit the artwork inside a transparent 160×160 canvas without cropping. Calyrex uses the GIF's first frame to remain static and motion-safe. No AI replacements or extracted chat screenshots are used.
- [MDN prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme): OS-aware CSS fallback alongside explicit theme preferences.
- [Open-Meteo documentation](https://open-meteo.com/en/docs): current `weather_code`, `is_day`, and Fahrenheit `temperature_2m`, timezone handling, and WMO code mapping. Visible attribution links to Open-Meteo. Weather loads automatically after hydration and never blocks core portfolio rendering.
- [Astronomy Engine](https://github.com/cosinekitty/astronomy), version 2.1.19, MIT license: locally calculated phase, illumination, rise/set events, and topocentric horizon positions. Installed TypeScript signatures were inspected. The visualization is a custom SVG rather than a third-party embedded sky application.

- I use a local 12-constellation subset of [D3-Celestial's line dataset](https://github.com/ofrohn/d3-celestial/blob/master/data/constellations.lines.json), retrieved September 30, 2026. Its J2000 RA/declination coordinates identify real star endpoints. I retain the [BSD license](public/licenses/d3-celestial.txt). I do not bundle D3 or the full star catalog. Star sizes are illustrative emphasis, not magnitude measurements.
- I use Astronomy Engine's J2000-to-equator-of-date rotation, Horizon, SearchAltitude, and MoonPhase functions. Constellation segments below the horizon are omitted. The Sun/Moon corner position is decorative; the Moon's phase is calculated for the current instant, not the evening constellation time.
