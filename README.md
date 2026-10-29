# pao-chinda-portfolio

Portfolio of **Pao Chinda**, Senior Full-Stack Developer: a recruiter-first landing page with case studies,
architecture diagrams and a tech-stack matrix, built on Next.js and deployed on Vercel.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router, Cache Components, Turbopack) | First-class on Vercel; server components, static prerendering, `"use cache"` ISR |
| Language | TypeScript (strict) | Typed content model: a typo in a project fails the build |
| Styling | Tailwind CSS v4 + CSS-variable tokens, shadcn/ui-style primitives (Radix) | One token file, owned components |
| Motion | `motion` (Motion for React) | `whileInView` = IntersectionObserver; `reducedMotion="user"` globally |
| Forms | react-hook-form + zod + TanStack Query `useMutation` + sonner | Same zod schema on client and server |
| Email | Resend | Simple API, works from a Vercel function |
| Data | GitHub REST (+ GraphQL for contributions) | Cached for an hour with `cacheLife("hours")` |
| Tests | Vitest | Validation, rate limiting, content integrity |
| Hosting | Vercel (+ Analytics, Speed Insights) | Preview per PR, production on `sit` |

## Structure

```
src/
  app/                    routes (thin): /, /projects, /projects/[slug], /about, /contact, /cv,
                          api/contact, api/github, sitemap, robots, opengraph-image, icon
  components/
    layout/               navbar (accessible mobile dialog), footer
    sections/             home sections: hero (+ interactive terminal), featured-projects, journey,
                          tech-stack (+ stack-matrix), about, open-source, testimonials, contact-cta
    project/              architecture-diagram, project-mockup, project-card, tech-chips
    contact/              contact-form
    motion/               Reveal / Stagger (scroll fade-up)
    ui/                   button, card, badge, input, textarea, skeleton
  content/                ← edit these: profile.ts, projects.ts, stack.ts, testimonials.ts
  lib/                    env (server-only), github, validation, rate-limit, utils
  types/                  Project, Tech, Testimonial, GitHubStats, ContactResponse …
```

**All content lives in `src/content/`.** The landing page, the case-study pages, the matrix and the printable `/cv`
are all generated from it, so they cannot drift apart. `src/content/content.test.ts` checks it on every build.

## Local setup

Requires Node 22+ and pnpm 9 (`corepack enable`).

```bash
pnpm install
cp .env.example .env.local    # optional: the site runs without any variables
pnpm dev                      # http://localhost:3000
```

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server (drafts such as placeholder testimonials are visible) |
| `pnpm lint` / `pnpm typecheck` / `pnpm test` | ESLint (0 warnings), `tsc --noEmit`, Vitest |
| `pnpm build && pnpm start` | Production build, served locally |
| `pnpm check` | Everything CI runs |

## Environment variables

| Variable | Required | Used for |
|---|---|---|
| `RESEND_API_KEY` | for the contact form | Sending email (server only) |
| `CONTACT_EMAIL` | for the contact form | Inbox that receives messages |
| `CONTACT_FROM` | recommended | Sender on a domain verified in Resend (defaults to Resend's test sender) |
| `GITHUB_USERNAME` | no (default `chindapao`) | Open-source section |
| `GITHUB_TOKEN` | no | Higher rate limit + "Contributions this year" |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URL, sitemap, Open Graph |

Secrets are read only in `src/lib/env.ts`, which imports `server-only`: importing it from a client component is a
build error, so keys cannot reach the browser.

## Branches

| Branch | Role | Deploys to |
|---|---|---|
| `dev` | Development (default branch). Feature branches open pull requests into `dev`. | Vercel preview |
| `sit` | Deploy branch. Merge `dev` into `sit` to release. | Vercel production |

```
feature/* ──PR──► dev ──PR / merge──► sit ──► production
```

The `CI` workflow (lint, typecheck, tests, build) runs on every pull request and on every push to `dev` and `sit`.

## Deployment (GitHub + Vercel)

The repository is [chindapao/pao-chinda-portfolio](https://github.com/chindapao/pao-chinda-portfolio).

1. On [vercel.com/new](https://vercel.com/new), import `pao-chinda-portfolio`. The framework (Next.js) and pnpm are
   detected automatically. No build settings to change.
2. **Settings → Git → Production Branch**: set it to `sit`. Every other branch and pull request gets its own
   preview URL.
3. In **Settings → Environment Variables**, add the variables above for **Production**, **Preview** and
   **Development** (`vercel env pull .env.local` then syncs them locally).
4. Optional: add a custom domain in **Settings → Domains**, then update `NEXT_PUBLIC_SITE_URL`.

## Security

- Contact form: zod validation on client **and** server, honeypot field, same-origin check, 16 KB body cap,
  per-IP rate limit (5 per 10 min, in memory per instance — swap in Upstash Redis for a global limit), user text
  HTML-escaped in the email, and the visitor's message is never logged.
- Strict headers on every response (`next.config.ts`): CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`,
  Referrer-Policy, Permissions-Policy, COOP.
- The GitHub token is only used server-side inside a cached function.

## Launch checklist

Content that only Pao can confirm is marked `CONFIRM` in `src/content/`:

- [ ] `profile.ts`: years of experience and project count in `stats`, public `email`, LinkedIn / X URLs
- [ ] `projects.ts`: confirm that employer / client work (WeLoan365, E-Learning API) may be shown publicly, and
      add `links` (live site, public repo) where they exist
- [ ] `testimonials.ts`: replace the three drafts with real quotes and set `draft: false`. Drafts never render in
      production; with none published, the section is hidden.
- [ ] Optional: add real screenshots (`screenshots` on a project; files in `public/`). Until then each card shows a
      CSS-drawn mockup.
