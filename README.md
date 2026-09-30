# Grace Arnold · Software Engineer

A light, editorial portfolio for full-stack production work, creative development, and teaching. React + strict TypeScript + Vite + Tailwind, with build-time HTML prerendering and a one-page general resume. No backend or tracking.

## Local setup

Use Node.js 24 LTS and npm. Exact dependency resolutions are in `package-lock.json`.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5173/grace-arnold-portfolio/`.

On Grace's current Windows machine, a checksum-verified portable Node is available in ignored `.tools`. In PowerShell, run this first from the repository:

```powershell
$env:PATH = "$PWD\.tools\node-v24.21.0-win-x64;$env:PATH"
npm.cmd run dev
```

| Command            | Purpose                                                         |
| ------------------ | --------------------------------------------------------------- |
| `npm run dev`      | Generate resume/sharing assets and start development            |
| `npm run check`    | Type checking, lint, format check, unit tests, production build |
| `npm run build`    | Generate assets, typecheck, bundle, prerender                   |
| `npm run preview`  | Preview production output on port 4173                          |
| `npm run test:e2e` | Desktop/mobile browser journeys and axe accessibility checks    |
| `npm run format`   | Apply consistent formatting                                     |
| `npm run assets`   | Regenerate public resume PDF and social image                   |

Install Chromium once before browser tests: `npx playwright install chromium` (Linux CI uses `--with-deps`).

## Architecture & editing

- `src/content.ts`: typed projects, job history, skills, and contact details. Add a `CaseStudy` entry here and a matching presentation in `App.tsx` when adding a project; the varied layouts are deliberate.
- `src/App.tsx`: semantic page sections and responsive navigation. `src/components/CaseStudy.tsx` renders reusable native disclosure controls that work without JavaScript.
- `src/styles.css`: Tailwind theme tokens, component styles, mobile layouts, focus and reduced-motion rules.
- `scripts/prerender.tsx`: writes real content into the built homepage and adds metadata when `SITE_URL` is set. React hydrates the same component tree. Native `#section` links avoid Pages deep-link refresh failures.
- `scripts/assets.ts`: generates the general resume from public career facts and the social image. Edit the concise resume descriptions here and job data in `content.ts`, then run `npm run assets`. Review the one-page PDF; the generator fails if it overflows.
- `public/images/star-baker.webp`: optimized real screenshot from the game's itch.io page. Preserve source attribution in `SOURCES.md`; use appropriately sized WebP images and descriptive alt text for new work. Never substitute fictional employer screenshots.
- Fonts: self-hosted DM Sans and Newsreader variable fonts, SIL Open Font License. No external font requests. License texts ship in `public/licenses`.

The PDF contains no phone number or street address. Do not replace it with an employer-specific application resume without generalizing and reviewing it first. Do not add unverified metrics, hidden placeholders, or an unapproved portrait.

## Verification

Vitest covers navigation state and public destinations. Playwright tests actual production output under the repository subdirectory: expanded case studies, section navigation, PDF download/parsing, keyboard navigation, reduced motion, axe WCAG A/AA checks, no-JavaScript content, local asset requests, and overflow at 320/390/768/1440 pixels. Screenshots and reports are ignored local artifacts.

Automated accessibility checks complement manual keyboard and visual inspection; they do not establish full WCAG conformance. Tests do not launch the external Unity game or assert external service availability.

## Publication (after local review and approval)

Nothing has been published automatically. The old repository remains untouched. CI verifies pushes and pull requests; deployment is a separate manual workflow.

1. Connect GitHub as `gmarnold`. GitHub CLI was not installed at setup; install it and run `gh auth login --hostname github.com --web`, then `gh auth setup-git`, or authenticate through GitHub Desktop.
2. Create a **new** repository named `grace-arnold-portfolio`, connect it as `origin`, and push `main` after approval. Never set `ProfessionalWebsite` as the remote.
3. In the new repository's Settings → Pages, choose GitHub Actions as the source.
4. Run **Publish approved portfolio** from Actions on `main`. It reruns all checks before deploying.

The intended URL is `https://gmarnold.github.io/grace-arnold-portfolio/`. The publishing workflow supplies it as `SITE_URL` for canonical and social metadata. If the repository/address changes, update `vite.config.ts`, `scripts/prerender.tsx`, `playwright.config.ts`, test URLs, and workflow `SITE_URL` together before deploying. No canonical URL is emitted for an unconfigured local build.

Setup references: [Vite](https://vite.dev/guide/), [Tailwind's Vite integration](https://tailwindcss.com/docs/installation/using-vite), [React hydration](https://react.dev/reference/react-dom/client/hydrateRoot), [Vite on GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages), [Playwright CI](https://playwright.dev/docs/ci-intro).
