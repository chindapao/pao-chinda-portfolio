# pao-chinda-portfolio

Portfolio of **Pao Chinda**, Senior Full-Stack Developer: a recruiter-first landing page with case studies,
architecture diagrams and a tech-stack matrix, in **English and Khmer**, built on Next.js and deployed on Vercel.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router, Cache Components, Turbopack) | First-class on Vercel; server components, static prerendering, `"use cache"` ISR |
| Language | TypeScript (strict) | Typed content model: a typo in a project fails the build |
| i18n | Own typed dictionaries + `proxy.ts` (no library) | `/en/…` and `/km/…`; `/` goes to the visitor's language; a missing Khmer key is a type error |
| Styling | Tailwind CSS v4 + CSS-variable tokens, shadcn/ui-style primitives (Radix) | One token file, owned components |
| Motion | `motion` (LazyMotion) for the menu and terminal; CSS + one IntersectionObserver for scroll reveals | Keeps the sections server components (fast on low-end phones) |
| Forms | react-hook-form + zod + TanStack Query `useMutation` + sonner | Same zod schema on client and server |
| Email | Resend | Simple API, works from a Vercel function |
| Data | GitHub REST (+ GraphQL for contributions) | Cached for an hour with `cacheLife("hours")` |
| Tests | Vitest (unit) · Playwright + axe-core (e2e, a11y) · Lighthouse CI (budget) | See [Quality gates](#quality-gates) |
| Hosting | Vercel (+ Analytics, Speed Insights) | Preview per PR, production on `sit` |

## Structure

```
src/
  proxy.ts                locale routing: /en/x and /km/x as is; locale-less /x → 307 to the visitor's language
  app/
    [locale]/             every page: /, /projects, /projects/[slug], /about, /contact, /cv, 404
    api/                  contact (POST), github (cached GET)
    og/                   Open Graph image · sitemap.ts · robots.ts
  i18n/                   config (locales, localePath), messages/en.ts + km.ts, client provider
  components/
    layout/               navbar (language switch, accessible mobile dialog), footer
    sections/             hero (+ interactive terminal), featured-projects, journey (roles + projects),
                          tech-stack (+ stack-matrix), about, open-source, testimonials, contact-cta
    project/              architecture-diagram, project-mockup, screenshot-gallery, project-card, tech-chips
    contact/              contact-form, contact-providers (Query + toasts, contact page only)
    motion/               Reveal / Stagger (server) + RevealObserver (the one client piece)
    ui/                   button, card, badge, input, textarea, skeleton
  content/                ← edit these: profile, projects, roles, stack, testimonials, km (Khmer overlay)
  lib/                    env (server-only), github, validation, rate-limit, seo, drafts, utils
  types/
e2e/                      Playwright specs (site flows + axe audits)
public/projects/          real product screenshots
```

**All content lives in `src/content/`.** The landing page, the case studies, the matrix and the printable `/cv` are all
generated from it in both languages, so they cannot drift apart. `src/content/km.ts` holds the Khmer translations;
anything not translated there falls back to English. `src/content/content.test.ts` checks it on every build.

**Drafts:** roles and testimonials marked `draft: true` show (with a DRAFT badge) in `pnpm dev` and on Vercel
preview deployments, and are **never** rendered in production.

## Local setup

Requires Node 22+ and pnpm 9 (`corepack enable`).

```bash
pnpm install
cp .env.example .env.local    # optional: the site runs without any variables
pnpm dev                      # http://localhost:3000 → /en (Khmer: http://localhost:3000/km)
```

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server (drafts visible) |
| `pnpm lint` / `pnpm typecheck` / `pnpm test` | ESLint (0 warnings), `tsc --noEmit`, Vitest |
| `pnpm build && pnpm start` | Production build, served locally |
| `pnpm test:e2e` | Playwright + axe against the production build (run `pnpm build` first; `pnpm exec playwright install chromium` once) |
| `pnpm lighthouse` | Lighthouse CI budget against the production build |
| `pnpm check` | Lint, typecheck, unit tests and build |

## Quality gates

GitHub Actions (`.github/workflows/ci.yml`) runs on every pull request and every push to `dev` and `sit`:

1. **check** — lint, typecheck, unit tests (content integrity, validation, rate limit, locale routing), build.
2. **browser** — Playwright on desktop and a 360 px phone, English and Khmer: navigation, language switch, 404s,
   terminal, mobile menu (focus trap, Escape), contact form (client validation, stubbed submit) and API guards; **axe
   WCAG 2.1 AA audits on 10 pages with zero violations allowed**, plus a no-horizontal-scroll check. Then the
   **Lighthouse budget** (desktop, gating): performance ≥ 90, accessibility 100, best practices ≥ 95, SEO 100,
   LCP ≤ 2 s, CLS ≤ 0.05. A mobile Lighthouse run is reported but does not gate (simulated slow-4G scores vary by
   runner); accessibility and CLS still gate there.

Why every URL carries its locale (no hidden `/en` rewrite): with Cache Components the client router prefetches by route
segment from the URL it sees. A rewrite that hides `/en` made it request the wrong segment (`/cv` as `[locale]="cv"`),
get a 404 and retry in a loop — hundreds of requests per visit. An e2e test now fails if any URL is requested 5+ times
or any request errors.

Measured locally on 2026-10-29 (desktop preset, median of 3): performance 97–100, accessibility 100, best practices
96–100, SEO 100, LCP 0.74–1.0 s, CLS 0–0.029.

## Environment variables

| Variable | Required | Used for |
|---|---|---|
| `RESEND_API_KEY` | for the contact form | Sending email (server only) |
| `CONTACT_EMAIL` | for the contact form | Inbox that receives messages |
| `CONTACT_FROM` | recommended | Sender on a domain verified in Resend (defaults to Resend's test sender) |
| `GITHUB_USERNAME` | no (default `chindapao`) | Open-source section |
| `GITHUB_TOKEN` | no | Higher rate limit + "Contributions this year" |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URL, sitemap, Open Graph (default `https://pchinda.vercel.app`) |

Secrets are read only in `src/lib/env.ts`, which imports `server-only`: importing it from a client component is a
build error, so keys cannot reach the browser.

The contact page is prerendered: it shows the form only when `RESEND_API_KEY` and `CONTACT_EMAIL` are set **at build
time**, and direct contact options otherwise. After adding them in Vercel, **redeploy**.

## Branches

| Branch | Role | Deploys to |
|---|---|---|
| `dev` | Development (default branch). Feature branches open pull requests into `dev`. | Vercel preview |
| `sit` | Deploy branch. Merge `dev` into `sit` to release. | Vercel production |

```
feature/* ──PR──► dev ──PR / merge──► sit ──► production
```

## Deployment (GitHub + Vercel)

The repository is [chindapao/pao-chinda-portfolio](https://github.com/chindapao/pao-chinda-portfolio).

1. On [vercel.com/new](https://vercel.com/new), import `pao-chinda-portfolio`. The framework (Next.js) and pnpm are
   detected automatically. No build settings to change.
2. **Settings → Environments → Production → Branch Tracking**: set it to `sit`. Every other branch and pull request
   gets its own preview URL.
3. In **Settings → Environment Variables**, add the variables above for **Production**, **Preview** and
   **Development** (`vercel env pull .env.local` then syncs them locally), then redeploy.
4. Optional: add a custom domain in **Settings → Domains**, then update `NEXT_PUBLIC_SITE_URL`.

## Security

- Contact form: zod validation on client **and** server, honeypot field, same-origin check, 16 KB body cap,
  per-IP rate limit (5 per 10 min, in memory per instance — swap in Upstash Redis for a global limit), user text
  HTML-escaped in the email, and the visitor's message is never logged.
- Strict headers on every response (`next.config.ts`): CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`,
  Referrer-Policy, Permissions-Policy, COOP.
- The GitHub token is only used server-side inside a cached function.

## Launch checklist

Only Pao can confirm these (search for `CONFIRM` and `draft: true` in `src/content/`):

- [ ] `profile.ts`: public `email`, LinkedIn / X URLs, and a years-of-experience stat once confirmed
- [ ] `roles.ts`: KOSIGN title and start date; earlier roles before 2026 (then `draft: false`)
- [ ] `testimonials.ts`: real quotes with permission (then `draft: false`)
- [ ] `km.ts` and `src/i18n/messages/km.ts`: a native-speaker review of the Khmer copy
- [ ] Vercel: `RESEND_API_KEY`, `CONTACT_EMAIL`, `CONTACT_FROM` (verified domain) → redeploy
- [ ] Optional: screenshots for the other projects (`screenshots` + files in `public/projects/<slug>/`) and public
      `links` (live site / repo) where they exist
