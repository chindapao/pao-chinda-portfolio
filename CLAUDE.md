@AGENTS.md

# pao-chinda-portfolio

Personal portfolio (Next.js 16 App Router, Cache Components, Tailwind v4, Vercel). Read `README.md` for structure.

## Rules

- Content goes in `src/content/*` only — never hard-code profile or project facts in components. Only verifiable
  facts: no invented metrics, clients or quotes. Unconfirmed values are marked `CONFIRM`.
- Colours only from the tokens in `src/app/globals.css` (`bg-surface`, `text-primary`, `text-syntax-*` …). No raw
  palette classes or hex values in components (exceptions: GitHub language dots, the OG image).
- Server components by default; `"use client"` only for interaction (navbar, terminal, contact form, motion
  wrappers). Secrets only through `src/lib/env.ts` (`server-only`).
- Cache Components is on: no `export const dynamic/revalidate`; cache with `"use cache"` + `cacheLife`. No
  `new Date()` / `Math.random()` during render outside a cache scope.
- Accessibility: icon-only buttons need `aria-label`; decorative icons `aria-hidden`; every animation must respect
  reduced motion (Motion via `MotionConfig`, CSS via the media query in globals.css).
- Before finishing: `pnpm check` (lint, typecheck, test, build) must pass.
