# Grace Arnold portfolio

## Plan

1. Verify sources and local tools.
2. Build a React/TypeScript portfolio, reusable content model, and general resume.
3. Verify production output, accessibility, responsive behavior, and repository paths.
4. Present local preview; request approval before any public deployment.

## Decisions

- New standalone repository; never modify ProfessionalWebsite.
- Warm paper, charcoal, restrained lavender; editorial typography and generous space.
- React, strict TypeScript, Vite, Tailwind; static single page with native anchor navigation and expandable case studies.
- QSRSoft employment ended September 2026. Career facts supplied by Grace take precedence over old website.
- No phone, address, unapproved portrait, or excluded podcast content.
- Use only verified project claims and real assets. Employer work uses public-safe narrative, no invented screenshots.
- Portable Node.js 24 LTS lives in ignored .tools because Node/npm are not installed on PATH.
- Planned Pages base: /grace-arnold-portfolio/. Publishing requires approval after local review.

## Confirmed during implementation

- Grace confirmed grace.m.arnold@outlook.com for commits. Repository-local author and committer settings verified after the first commit.
- Grace supplied Star Baker's itch.io page and repository and confirmed sole developer status. README and C# scripts verified; real screenshot reused. Case study preserves the documented incomplete power-up timing fix and credits Asset Store art.
- Selected QSRSoft, Star Baker, and research work; source review and reasons for excluding other repositories are in SOURCES.md.
- General one-page resume generated from supplied facts; source lives in scripts/assets.ts.
- Prerendered HTML, hash navigation, self-hosted OFL fonts, no backend or external tracking. Manual-only Pages publishing workflow.
- Final verification passed after the readability pass: typecheck, lint, formatting, three unit tests, production build, and eight desktop/mobile browser tests. Browser tests include axe, keyboard, reduced motion, assets, resume, no-JavaScript content, and overflow at 320/390/768/1440px. Desktop and mobile screenshots were visually reviewed, including an expanded case study.
- Working production preview: http://127.0.0.1:4173/grace-arnold-portfolio/ (opened for Grace). Hidden server process ID is saved in ignored .local/preview.pid. Restart with npm run preview if needed.

## Remaining decisions and access

- Grace's review of the local design, case-study wording, and general resume; publication approval is still pending.
- No further content questions block this version. New creative projects and an optional approved portrait can be added later.
- GitHub CLI is unavailable and Git Credential Manager returned no connected GitHub accounts. Authenticate as gmarnold before creating/pushing the new repository; see README.
- GitHub, itch.io, source, and gameplay-video links returned HTTP 200. LinkedIn rejected HEAD (405), then returned HTTP 200 to a normal GET request. Email destination matches Grace's approved mailto address; no test message was sent.
- The public TwitchNetwork source contained credential-like values. Grace was notified; none were copied here and no changes were made to that repository.
