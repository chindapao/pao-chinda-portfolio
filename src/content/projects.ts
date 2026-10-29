import type { Project } from "@/types";

/*
 * Every project here is real work from Pao's repositories. Facts (commit counts, test counts, stack) were read from the
 * repos on 2026-10-29. Before publishing, check that client / employer work may be shown (see README → Launch
 * checklist) and add live or repo links where they are public.
 */
export const PROJECTS: Project[] = [
  {
    slug: "cvkh",
    name: "CVKH",
    category: "SAAS · PAYMENTS · PDF",
    tagline: "A Khmer-first CV builder that turns a free preview into a paid, print-quality PDF.",
    summary:
      "Guest-first CV builder for Cambodia and beyond: build and preview free in Khmer, English or both, then pay a small server-set price with KHQR, ABA Pay or card to download a high-quality PDF.",
    period: { start: "2026-09" },
    status: "active",
    featured: true,
    role: { title: "Founder & sole engineer", team: "solo", contribution: "282 commits — design, backend, frontend, ops" },
    stack: ["nextjs", "spring", "java", "typescript", "postgres", "redis", "payments", "tanstack", "tailwind", "docker", "react", "shadcn", "motion"],
    overview:
      "Two Next.js apps (customer site and admin dashboard) over two Spring Boot APIs. Customers never need an account: they build a CV as a guest, preview it live, and sign in with an email code only if they want it on another device.",
    problem:
      "Cambodian job seekers juggle Word templates that break Khmer script, and most CV builders are subscription-priced in dollars. CVKH needed to render Khmer perfectly, charge a few cents through local payment rails, and protect personal data that is, by definition, PII.",
    responsibilities: [
      "Product design, API contract and data model",
      "Spring Boot web-api and admin-api with Flyway-owned schemas",
      "Next.js customer site with a Canva-style page editor and live preview",
      "Payment integration with KHQR (Bakong) and ABA PayWay",
      "Server-side PDF pipeline and signed download URLs",
    ],
    architecture: {
      layers: [
        {
          label: "Clients",
          tone: "client",
          nodes: [
            { label: "Customer site", detail: "Next.js · km / en" },
            { label: "Admin dashboard", detail: "Next.js" },
          ],
        },
        {
          label: "APIs",
          tone: "service",
          nodes: [
            { label: "web-api", detail: "Spring Boot 4 · jobs" },
            { label: "admin-api", detail: "Spring Boot 4 · RBAC" },
          ],
        },
        {
          label: "Workers & providers",
          tone: "external",
          nodes: [
            { label: "Gotenberg", detail: "HTML → PDF" },
            { label: "KHQR · ABA PayWay", detail: "signed webhooks" },
            { label: "SMTP", detail: "email OTP" },
          ],
        },
        {
          label: "Data",
          tone: "data",
          nodes: [
            { label: "PostgreSQL 17", detail: "Flyway · AES-GCM PII" },
            { label: "Redis", detail: "rate limits · cache" },
          ],
        },
      ],
      notes: [
        "Prices are computed on the server only; the API never accepts an amount from a client.",
        "An order becomes PAID only through provider verification with an exact amount and currency match.",
        "The live preview and the PDF render the same React template component, so what you see is what you print.",
        "Each app owns its tables; an architecture test fails the build if a service touches SQL directly.",
      ],
    },
    features: [
      "Guest-first builder with Khmer, English and bilingual CVs",
      "Canva-style page editor with a shop-style template gallery",
      "KHQR, ABA Pay and card checkout with coupons, referrals and refunds",
      "Server-side PDF generation behind short-lived HMAC-signed download links",
      "Admin dashboard: orders, payments, coupons, FAQ, audit trail and staff roles",
    ],
    challenges: [
      {
        title: "Getting paid without trusting the browser",
        solution:
          "Orders flip to PAID only from a signed provider webhook or a provider status check that matches the exact amount and currency. Free (comp) orders and account credits are audited and excluded from revenue everywhere.",
      },
      {
        title: "Khmer that prints exactly like the preview",
        solution:
          "One template package renders both the live preview and the PDF page that Gotenberg prints, so script shaping, fonts and line breaks cannot drift between them.",
      },
      {
        title: "Personal data by default",
        solution:
          "Resume content is encrypted at rest with AES-GCM, never logged and never shown in admin lists; downloads expire within minutes.",
      },
    ],
    outcomes: [
      { value: "853", label: "frontend tests passing" },
      { value: "2", label: "Spring Boot apps, schema-validated at startup" },
      { value: "km / en", label: "every user-facing string" },
      { value: "0", label: "client-supplied prices accepted" },
    ],
    achievements: [
      "Shipped a two-app SaaS solo: customer site, admin dashboard, two APIs and the PDF pipeline",
      "Designed payment verification that cannot be faked from the client",
      "Encrypted all CV content at rest and kept it out of logs and admin views",
    ],
    mockup: "builder",
  },
  {
    slug: "weloan365",
    name: "WeLoan365",
    category: "FINTECH · MULTI-TENANT",
    tagline: "Hosted loan management for Cambodian microfinance institutions, with double-entry accounting built in.",
    summary:
      "One shared platform, many tenants: loan origination, repayment schedules and the general ledger for small MFIs, in USD and KHR, in English and Khmer.",
    period: { start: "2026-08" },
    status: "active",
    featured: true,
    role: { title: "Full-stack engineer · top contributor", team: "team", contribution: "259 commits — the most on the team" },
    stack: ["spring", "java", "nextjs", "typescript", "postgres", "rest", "security", "tailwind", "ci", "docker", "react", "tanstack", "shadcn", "motion"],
    overview:
      "A tenant product (four roles: Admin, Credit Manager, Credit Officer, Accountant) and a deliberately small Super-Admin console for the platform operator, built as Spring Boot and Next.js monorepos against an OpenAPI 3.1 contract.",
    problem:
      "Small MFIs run their loan book on spreadsheets that cannot enforce accounting rules or keep tenants apart. The platform had to isolate every tenant's data, post balanced journal entries for every money movement, and handle two currencies side by side.",
    responsibilities: [
      "Tenant API features across loans, customers, products and accounting",
      "Next.js tenant app pages, shared UI package and test helpers",
      "Super-Admin tenant approval flow with password + second factor",
      "Contract-first API work against the OpenAPI 3.1 spec",
    ],
    architecture: {
      layers: [
        {
          label: "Clients",
          tone: "client",
          nodes: [
            { label: "Tenant app", detail: "Next.js 16 · 4 roles" },
            { label: "Super-Admin console", detail: "Next.js 16" },
          ],
        },
        {
          label: "APIs",
          tone: "service",
          nodes: [
            { label: "web-api", detail: "41 controllers · tenant session" },
            { label: "admin-api", detail: "operator auth · 2FA" },
          ],
        },
        {
          label: "Domain",
          tone: "worker",
          nodes: [
            { label: "Loans & schedules" },
            { label: "Double-entry ledger" },
            { label: "Integrations", detail: "encrypted secrets" },
          ],
        },
        {
          label: "Data",
          tone: "data",
          nodes: [{ label: "PostgreSQL 17", detail: "tenant boundary · Flyway" }],
        },
      ],
      notes: [
        "Every query is scoped by tenant; organisations wait for operator approval before anyone can sign in.",
        "OpenAPI 3.1 owns every path, method and shape; Swagger UI is served from the contract.",
        "Money movements post balanced journal entries in USD or KHR.",
      ],
    },
    features: [
      "Loan products, origination, disbursement and repayment schedules",
      "Double-entry accounting with USD / KHR dual currency",
      "Tenant administration: users, roles, products, integrations, audit trail",
      "Super-Admin tenant review: approve, reject, suspend, reinstate",
    ],
    challenges: [
      {
        title: "Two kinds of “admin” in one product",
        solution:
          "Tenant Admins and platform Super-Admins live in separate apps, APIs and sessions, so a tenant role can never reach platform controls.",
      },
      {
        title: "Accounting that always balances",
        solution:
          "Business operations post through one ledger service that rejects unbalanced entries, so reports reconcile by construction.",
      },
    ],
    outcomes: [
      { value: "41", label: "tenant API controllers" },
      { value: "2", label: "currencies · 2 languages" },
      { value: "#1", label: "committer on the team" },
    ],
    achievements: [
      "Top contributor on a multi-tenant fintech platform",
      "Built tenant isolation and an operator approval flow with 2FA",
      "Worked contract-first across a Spring Boot + Next.js monorepo",
    ],
    mockup: "ledger",
  },
  {
    slug: "rodthabal",
    name: "Rodthabal",
    category: "AI · GOVTECH · AWS",
    tagline: "An AI assistant that drafts official Khmer letters, reports and minutes for government officers.",
    summary:
      "Seven AI modules (letters, monthly reports, meeting minutes, data analysis, policy review, action plans, service improvement) whose output stays an AI draft until a supervisor approves it.",
    period: { start: "2026-10" },
    status: "active",
    featured: true,
    role: { title: "Lead engineer", team: "solo", contribution: "Architecture, security model and all milestones to M5" },
    stack: ["nextjs", "node", "typescript", "ai", "postgres", "prisma", "redis", "storage", "aws", "ci", "react", "tailwind", "tanstack", "shadcn", "motion"],
    overview:
      "A Turborepo with a Fastify API, a BullMQ worker and a Khmer-first Next.js app. The API only enqueues jobs; the worker is the one process that holds the AI provider key and talks to Claude.",
    problem:
      "Officers spend hours on formal Khmer documents with strict structure. AI can draft them, but government data must not leak, prompts must be guarded, and nothing AI-written may be sent without a human signing off.",
    responsibilities: [
      "System architecture and AWS edge design",
      "Security package: Argon2id, TOTP, AES-GCM keyring, authorization policies",
      "AI package: prompts, redaction, output guards, retry and circuit breaker",
      "Prisma schema with audit-log helpers and keyset pagination",
    ],
    architecture: {
      layers: [
        {
          label: "Edge",
          tone: "edge",
          nodes: [
            { label: "CloudFront + WAF" },
            { label: "ALB" },
          ],
        },
        {
          label: "App",
          tone: "client",
          nodes: [
            { label: "web", detail: "Next.js 16 · SSR · Khmer UI" },
            { label: "api", detail: "Fastify 5 · stateless" },
          ],
        },
        {
          label: "Worker",
          tone: "worker",
          nodes: [{ label: "BullMQ worker", detail: "AI · files · exports" }],
        },
        {
          label: "Data & AI",
          tone: "data",
          nodes: [
            { label: "PostgreSQL 16" },
            { label: "Redis 7", detail: "queues · rate limits" },
            { label: "S3" },
            { label: "Claude API", detail: "worker only" },
          ],
        },
      ],
      notes: [
        "Only the worker holds the AI key; the API cannot call the provider even if compromised.",
        "Inputs are redacted before prompting and outputs pass guards before an officer sees them.",
        "Every generated document stays an AI draft until a supervisor approves it.",
      ],
    },
    features: [
      "Seven document modules producing formal Khmer",
      "Supervisor approval workflow on every AI draft",
      "Two-factor sign-in, password policy and audit log",
      "CI with lint, typecheck, tests, build and dependency / secret / image scanning",
    ],
    challenges: [
      {
        title: "AI in government without leaking data",
        solution:
          "Redaction before prompts, output guards after, and a hard process boundary: the API enqueues, the worker calls Claude.",
      },
      {
        title: "A model provider that can fail",
        solution: "Retries with backoff and a circuit breaker in the worker; officers see the job state instead of a spinner.",
      },
    ],
    outcomes: [
      { value: "7", label: "AI modules shipped (M5)" },
      { value: "1", label: "process with the AI key" },
      { value: "100%", label: "drafts human-approved" },
    ],
    achievements: [
      "Designed a human-in-the-loop AI system for government work",
      "Isolated the AI provider key in a single queue worker",
      "Built the security package: Argon2id, TOTP and an AES-GCM keyring",
    ],
    mockup: "assistant",
  },
  {
    slug: "eventticket",
    name: "EventTicket",
    category: "BOOKING · CONSISTENCY",
    tagline: "Event booking with no overbooking, idempotent payments and a full admin audit trail.",
    summary:
      "Customers book up to four seats and pay; staff check attendees in; admins manage events, bookings, payments and reports — without ever selling the same seat twice.",
    period: { start: "2026-10" },
    status: "active",
    featured: false,
    role: { title: "Full-stack engineer", team: "solo", contribution: "Architecture, ADRs, backend and frontend" },
    stack: ["spring", "java", "nextjs", "typescript", "postgres", "redis", "tanstack", "security", "observability", "docker", "react", "tailwind", "shadcn"],
    overview:
      "A single-tenant modular monolith with two API entry points (customer and back office) sharing one domain core, behind nginx, with PostgreSQL as the source of truth and Redis only as an accelerator.",
    problem: "Ticket drops create bursts of concurrent requests for the same seats, and retries on flaky networks double-charge customers.",
    responsibilities: ["Eight architecture decision records", "Booking and payment core", "Customer and admin Next.js apps", "Observability and load tests"],
    architecture: {
      layers: [
        { label: "Edge", tone: "edge", nodes: [{ label: "nginx", detail: "routes web / admin / APIs" }] },
        {
          label: "Clients",
          tone: "client",
          nodes: [
            { label: "Customer web", detail: "Next.js" },
            { label: "Admin web", detail: "Next.js" },
          ],
        },
        {
          label: "APIs",
          tone: "service",
          nodes: [
            { label: "web-api", detail: "aud=web" },
            { label: "admin-api", detail: "aud=admin" },
            { label: "core", detail: "booking · payment · audit" },
          ],
        },
        {
          label: "Data",
          tone: "data",
          nodes: [
            { label: "PostgreSQL 16", detail: "source of truth" },
            { label: "Redis 7", detail: "idempotency locks" },
          ],
        },
      ],
      notes: [
        "Inventory uses one atomic conditional UPDATE instead of locks or Redis counters.",
        "Idempotency = Redis lock + DB unique key + payload hash.",
        "Audience-separated JWTs keep customer tokens out of the back office.",
      ],
    },
    features: ["Seat booking (max 4) with payment", "Staff check-in", "Admin reports and settings", "Transactional outbox for events"],
    challenges: [
      {
        title: "Never sell a seat twice",
        solution: "A single conditional UPDATE decrements availability only if enough seats remain, so the database arbitrates races.",
      },
    ],
    outcomes: [
      { value: "0", label: "overbookings by design" },
      { value: "8", label: "ADRs" },
    ],
    achievements: ["Made booking race-free with one atomic SQL statement", "Implemented idempotent payments end to end"],
    mockup: "booking",
  },
  {
    slug: "iplaydontrey",
    name: "iPlayDontrey",
    category: "STREAMING · EVENTS",
    tagline: "A streaming platform for Cambodian music where artists earn ad revenue paid out through ABA PayWay.",
    summary: "Listeners stream free, artists publish songs and earn, and payouts reach local bank accounts.",
    period: { start: "2026-10" },
    status: "active",
    featured: false,
    role: { title: "Full-stack engineer", team: "solo" },
    stack: ["spring", "java", "nextjs", "typescript", "postgres", "redis", "queues", "storage", "payments", "kubernetes", "observability", "react", "tailwind", "shadcn"],
    overview:
      "A Spring Boot 4 modular monolith with a separate media worker, a Next.js 16 web app, and a local stack of PostgreSQL, Redis, RabbitMQ, Kafka, MinIO and Mailpit — deployable to Kubernetes with kustomize.",
    problem: "Audio uploads are large, untrusted and slow to process; payouts must be exact.",
    responsibilities: ["API and media pipeline", "Web app", "Kubernetes manifests and alerting", "Load, smoke and penetration test scripts"],
    architecture: {
      layers: [
        { label: "Client", tone: "client", nodes: [{ label: "Web app", detail: "Next.js 16" }] },
        { label: "API", tone: "service", nodes: [{ label: "API", detail: "Spring Boot 4 · Java 21" }] },
        {
          label: "Workers",
          tone: "worker",
          nodes: [
            { label: "media-worker", detail: "ffmpeg" },
            { label: "ClamAV", detail: "malware scan" },
          ],
        },
        {
          label: "Data & events",
          tone: "data",
          nodes: [
            { label: "PostgreSQL" },
            { label: "RabbitMQ · Kafka" },
            { label: "MinIO" },
            { label: "Redis" },
          ],
        },
      ],
      notes: ["Uploads are scanned and transcoded off the request path.", "Prometheus alert rules and a Grafana dashboard ship with the repo."],
    },
    features: ["Artist publishing and ad-revenue payouts", "Media processing with malware scanning", "Two-step verification for staff"],
    challenges: [
      { title: "Heavy media work", solution: "RabbitMQ jobs feed a dedicated media worker so the API stays fast." },
    ],
    outcomes: [{ value: "k6", label: "load-tested" }],
    achievements: ["Built an event-driven media pipeline with malware scanning", "Wrote Kubernetes manifests, alerts and a backup drill"],
    mockup: "player",
  },
  {
    slug: "viviatts",
    name: "ViviaTTS",
    category: "SPEECH · KHMER NLP",
    tagline: "Khmer–English text-to-speech and reading platform with Khmer-aware text chunking.",
    summary: "An end-user site and admin console over one Spring Boot API, with a pluggable speech-provider layer.",
    period: { start: "2026-10" },
    status: "active",
    featured: false,
    role: { title: "Full-stack engineer", team: "solo" },
    stack: ["spring", "java", "nextjs", "typescript", "postgres", "redis", "storage", "python", "security", "react", "tailwind", "tanstack", "motion"],
    overview:
      "Spring Boot 3.5 on Java 21 is the only authorization boundary; speech jobs are idempotent, quota-reserved and processed in chunks through a provider gateway with timeouts and circuit breakers.",
    problem: "Standard text segmentation splits Khmer coeng conjuncts, which breaks synthesis mid-syllable.",
    responsibilities: ["Auth and session design", "Speech job engine", "Khmer chunking rules", "Web app"],
    architecture: {
      layers: [
        { label: "Clients", tone: "client", nodes: [{ label: "Web" }, { label: "Admin" }] },
        { label: "API", tone: "service", nodes: [{ label: "Spring Boot 3.5", detail: "jobs · quotas · auth" }] },
        { label: "Speech", tone: "worker", nodes: [{ label: "Provider gateway", detail: "circuit breaker" }, { label: "Python worker" }] },
        { label: "Data", tone: "data", nodes: [{ label: "PostgreSQL" }, { label: "Redis queue" }, { label: "S3 / MinIO" }] },
      ],
      notes: ["Khmer-aware chunking fuzz-tested with 4,800 cases.", "Concurrency guards proven by mutation checks."],
    },
    features: ["Khmer and English synthesis jobs", "Usage quotas and history", "Private audio with range requests"],
    challenges: [
      {
        title: "Segmenting Khmer correctly",
        solution: "Own cluster rules instead of UAX #29, fuzz-tested so no conjunct is ever split.",
      },
    ],
    outcomes: [
      { value: "143", label: "backend tests" },
      { value: "4,800", label: "fuzz cases" },
    ],
    achievements: ["Wrote Khmer-aware text chunking", "Built an idempotent job engine with outbox and lease-based claiming"],
    mockup: "speech",
  },
  {
    slug: "e-learning",
    name: "E-Learning API",
    category: "EDTECH · TEAM",
    tagline: "Course, quiz and enrolment API for an internal learning platform.",
    summary: "Courses, lessons, quizzes, enrolments, approvals and report exports for instructors and learners.",
    period: { start: "2026-01", end: "2026-07" },
    status: "archived",
    featured: false,
    role: { title: "Backend engineer · top contributor", team: "team", contribution: "98 commits — the most on the team" },
    stack: ["spring", "java", "postgres", "rest", "security"],
    overview: "A Gradle multi-module Spring Boot 3.5 API (API + commons) secured as an OAuth2 resource server.",
    problem: "Instructors needed approval workflows and exportable reports on top of courses and quizzes.",
    responsibilities: ["Course, lesson and quiz endpoints", "Enrolment and approval flows", "Report exports"],
    architecture: {
      layers: [
        { label: "Clients", tone: "client", nodes: [{ label: "Learning web app" }] },
        { label: "API", tone: "service", nodes: [{ label: "elng-api", detail: "Spring Boot 3.5" }, { label: "elng-commons" }] },
        { label: "Data", tone: "data", nodes: [{ label: "PostgreSQL" }] },
      ],
      notes: ["OAuth2 resource server; shared commons module for cross-cutting code."],
    },
    features: ["Courses, lessons, quizzes and attempts", "Enrolments and approvals", "Instructor report exports"],
    challenges: [],
    outcomes: [{ value: "19", label: "controllers" }],
    achievements: ["Top contributor on a team Spring Boot API"],
    mockup: "learning",
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured);

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

/** Newest first, for the journey timeline. */
export const PROJECTS_BY_DATE = [...PROJECTS].sort((a, b) => b.period.start.localeCompare(a.period.start));
