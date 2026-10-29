import type { Profile } from "@/types";

/*
 * Everything personal in one place. Values marked CONFIRM are reasonable defaults that only Pao can verify — the README
 * launch checklist lists them.
 */
export const PROFILE: Profile = {
  name: "Pao Chinda",
  // Khmer order: family name first, so the given name is Chinda.
  givenName: "Chinda",
  shortRole: "Full-Stack Dev",
  role: "Senior Full-Stack Developer",
  location: "Phnom Penh, Cambodia",
  // CONFIRM: a public address for the "Or email me" link. Left unset, the link is hidden and /contact still works.
  email: undefined,
  availability: {
    open: true,
    label: "Available for hire · 2026",
    slots: "Currently available · 2–3 project slots open",
    responseTime: "I reply within one working day (UTC+7).",
  },
  headline: "Building apps people actually use.",
  subheading:
    "Full-stack developer specialising in Next.js, Spring Boot and TypeScript. Multi-tenant SaaS, payments and AI — fast, accessible, and built to scale.",
  bio: [
    "I'm a senior full-stack developer in Phnom Penh who turns complex business ideas into simple digital products. I've built multi-tenant fintech, a paid SaaS with local payment rails, and an AI assistant for government officers — usually owning the work from the data model to the last pixel.",
    "I like systems that are boring in the right places: the database decides races, the server decides prices, and every decision worth arguing about gets an ADR.",
  ],
  approach: [
    { title: "Contract first", body: "The API contract changes in the same pull request as the endpoint and the client." },
    { title: "Secure by default", body: "Server-side pricing, signed webhooks, encrypted PII, least-privilege keys." },
    { title: "Proven, not promised", body: "Testcontainers, concurrency tests and CI gates before anything ships." },
    { title: "Khmer-first, worldwide", body: "Bilingual UIs that render Khmer script correctly — on screen and on paper." },
  ],
  // Only claims the site itself proves. CONFIRM: add `{ value: "N+ yrs", label: "experience" }` once you've confirmed N.
  stats: [
    { value: "7", label: "systems on this site" },
    { value: "Spring + Next", label: "full-stack" },
    { value: "km / en", label: "bilingual products" },
    { value: "Remote", label: "friendly · UTC+7" },
  ],
  heroPills: ["Next.js", "Spring Boot", "TypeScript", "PostgreSQL", "AWS"],
  socials: {
    github: "https://github.com/chindapao",
    // CONFIRM: add the profile URLs to show the icons in the footer.
    linkedin: undefined,
    x: undefined,
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pchinda.vercel.app",
};

/** Main navigation: locale-less paths (see `localePath`) and the `messages.nav` key of each label. */
export const NAV_LINKS = [
  { path: "/", hash: "projects", label: "projects" },
  { path: "/", hash: "stack", label: "stack" },
  { path: "/", hash: "about", label: "about" },
  { path: "/contact", label: "contact" },
] as const;

/** Fixed so prerendering stays deterministic (Cache Components forbids `new Date()` outside a cache scope). */
export const COPYRIGHT_YEAR = 2026;
