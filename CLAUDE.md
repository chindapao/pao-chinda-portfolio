@AGENTS.md

# pao-chinda-portfolio

Personal portfolio (Next.js 16 App Router, Cache Components, Tailwind v4, Vercel), English at `/en` and Khmer at `/km`
(`/` redirects to the visitor's language). Never reintroduce a hidden-locale rewrite: it breaks segment prefetching.
Read `README.md` for structure.

## Rules

- Content goes in `src/content/*` only — never hard-code profile or project facts in components. Only verifiable
  facts: no invented metrics, clients or quotes. Unconfirmed values are marked `CONFIRM` or `draft: true`.
- Every user-facing string exists in both `src/i18n/messages/en.ts` and `km.ts` (the `Messages` type enforces it);
  content translations go in `src/content/km.ts`. Components get the locale as a prop (server) or from `useI18n()`
  (client), and build internal links with `localePath(locale, path)`.
- Colours only from the tokens in `src/app/globals.css` (`bg-surface`, `text-primary`, `text-syntax-*` …). No raw
  palette classes or hex values in components (exceptions: GitHub language dots, the OG image).
- Server components by default; `"use client"` only for interaction (navbar, terminal, contact form, RevealObserver).
  Scroll reveals use `Reveal` / `Stagger` (server) — don't add per-element client components. Motion: `m.*` only
  (LazyMotion strict). Secrets only through `src/lib/env.ts` (`server-only`).
- Cache Components is on: no `export const dynamic/revalidate`; cache with `"use cache"` + `cacheLife`. No
  `new Date()` / `Math.random()` during render outside a cache scope.
- Accessibility: icon-only buttons need `aria-label`; an `aria-label` must contain the visible text (WCAG 2.5.3);
  decorative icons `aria-hidden`; every animation must respect reduced motion.
- Before finishing: `pnpm check`, then `pnpm build && pnpm test:e2e` (axe must report zero violations).
