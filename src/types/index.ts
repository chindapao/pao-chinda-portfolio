import type { LucideIcon } from "lucide-react";

/** Where a technology sits in the stack. Drives the stack cards and the matrix rows. */
export type StackCategory = "frontend" | "backend" | "data" | "infra";

export interface Tech {
  /** Stable key referenced by projects (`Project.stack`). */
  id: string;
  name: string;
  category: StackCategory;
  icon: LucideIcon;
  /** One line a recruiter can skim: what Pao does with it. */
  note: string;
}

/** `live`: users on it · `active`: under active development · `archived`: Pao's part is finished. */
export type ProjectStatus = "live" | "active" | "archived";

/** How the work was done: solo product or as part of a team (with Pao's share). */
export interface ProjectRole {
  title: string;
  team: "solo" | "team";
  /** e.g. "259 of 398 commits" — only facts that can be checked. */
  contribution?: string;
}

/** A node in an architecture diagram; `tone` colours it by layer. */
export interface ArchNode {
  label: string;
  detail?: string;
}

/** Diagrams are drawn as left-to-right layers (top-to-bottom on phones), each a column of nodes. */
export interface ArchLayer {
  label: string;
  tone: "client" | "edge" | "service" | "worker" | "data" | "external";
  nodes: ArchNode[];
}

export interface Architecture {
  layers: ArchLayer[];
  /** Short labelled notes under the diagram: the decisions that matter. */
  notes: string[];
}

export interface Metric {
  value: string;
  label: string;
}

export interface Screenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** Visual for cards when there is no screenshot: an abstract dark UI drawn in CSS. */
export type MockupKind = "builder" | "ledger" | "assistant" | "booking" | "player" | "speech" | "learning";

export interface Project {
  slug: string;
  name: string;
  /** Mono tag above the title, e.g. "SAAS · PAYMENTS". */
  category: string;
  tagline: string;
  summary: string;
  period: { start: string; end?: string };
  status: ProjectStatus;
  featured: boolean;
  role: ProjectRole;
  /** `Tech.id`s, most important first. */
  stack: string[];
  overview: string;
  problem: string;
  responsibilities: string[];
  architecture: Architecture;
  features: string[];
  challenges: { title: string; solution: string }[];
  outcomes: Metric[];
  /** Journey bullet points: the achievements a recruiter should remember. */
  achievements: string[];
  mockup: MockupKind;
  screenshots?: Screenshot[];
  links?: { live?: string; repo?: string; caseStudy?: string };
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  /**
   * Draft quotes render in development and preview deployments (with a DRAFT badge) and are hidden in production,
   * so a placeholder can never reach a recruiter.
   */
  draft: boolean;
}

export interface SocialLinks {
  github: string;
  linkedin?: string;
  x?: string;
}

export interface Profile {
  name: string;
  givenName: string;
  shortRole: string;
  role: string;
  location: string;
  /** Shown as `mailto:` when set; the contact form works either way. */
  email?: string;
  availability: { open: boolean; label: string; slots: string; responseTime: string };
  headline: string;
  subheading: string;
  bio: string[];
  approach: { title: string; body: string }[];
  stats: { value: string; label: string }[];
  heroPills: string[];
  socials: SocialLinks;
  siteUrl: string;
}

// ---------------------------------------------------------------------------------------------------------------------
// GitHub (only the fields the site reads).

export interface GitHubRepo {
  name: string;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  stars: number;
}

export interface GitHubStats {
  username: string;
  stars: number;
  publicRepos: number;
  /** `null` when no token is configured: the contributions calendar needs the GraphQL API. */
  contributionsThisYear: number | null;
  topRepos: GitHubRepo[];
  fetchedAt: string;
}

// ---------------------------------------------------------------------------------------------------------------------
// Contact form.

export interface ContactResponse {
  ok: boolean;
  message: string;
  /** Field errors from the server-side re-validation. */
  fieldErrors?: Partial<Record<"name" | "email" | "message", string[]>>;
}
