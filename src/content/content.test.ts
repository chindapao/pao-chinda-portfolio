import { afterEach, describe, expect, it, vi } from "vitest";

import { getFeaturedProjects, getProfile, getProject, getRoles } from "./index";
import { PROJECTS_KM, ROLES_KM } from "./km";
import { PROFILE } from "./profile";
import { PROJECTS } from "./projects";
import { ROLES, visibleRoles } from "./roles";
import { getTech, STACK } from "./stack";
import { visibleTestimonials } from "./testimonials";

/* Content is code: these checks fail the build before a broken link or a typo'd tech id reaches a recruiter. */

describe("projects", () => {
  it("have unique, URL-safe slugs", () => {
    const slugs = PROJECTS.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("feature exactly three on the home page", () => {
    expect(getFeaturedProjects("en")).toHaveLength(3);
  });

  it("only reference known technologies", () => {
    for (const project of PROJECTS) for (const id of project.stack) expect(() => getTech(id)).not.toThrow();
  });

  it("have a period in YYYY-MM form and at least one architecture layer", () => {
    for (const project of PROJECTS) {
      expect(project.period.start).toMatch(/^\d{4}-\d{2}$/);
      expect(project.architecture.layers.length).toBeGreaterThan(0);
    }
  });

  it("serve screenshots that exist in public/", async () => {
    const { existsSync } = await import("node:fs");
    for (const project of PROJECTS) {
      for (const shot of project.screenshots ?? []) expect(existsSync(`public${shot.src}`), shot.src).toBe(true);
    }
  });
});

describe("profile", () => {
  it("claims exactly as many systems as the site documents", () => {
    expect(PROFILE.stats[0]?.value).toBe(String(PROJECTS.length));
  });
});

describe("Khmer content", () => {
  it("translates every project, with one outcome label per outcome", () => {
    for (const project of PROJECTS) {
      const km = PROJECTS_KM[project.slug];
      expect(km, project.slug).toBeDefined();
      expect(km!.outcomeLabels).toHaveLength(project.outcomes.length);
      expect(km!.achievements).toHaveLength(project.achievements.length);
    }
  });

  it("translates every role", () => {
    for (const role of ROLES) expect(ROLES_KM[role.organization], role.organization).toBeDefined();
  });

  it("falls back to English for untranslated case-study detail", () => {
    const km = getProject("cvkh", "km")!;
    expect(km.tagline).not.toBe(getProject("cvkh", "en")!.tagline);
    expect(km.features).toEqual(getProject("cvkh", "en")!.features);
  });

  it("localizes the profile", () => {
    expect(getProfile("km").headline).not.toBe(getProfile("en").headline);
    expect(getProfile("km").name).toBe(getProfile("en").name);
  });
});

describe("drafts", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("never show draft testimonials or roles in a production build", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(visibleTestimonials().every((testimonial) => !testimonial.draft)).toBe(true);
    expect(visibleRoles().every((role) => !role.draft)).toBe(true);
    expect(getRoles("km").every((role) => !role.draft)).toBe(true);
  });

  it("show drafts on preview deployments", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(visibleTestimonials().some((testimonial) => testimonial.draft)).toBe(true);
    expect(visibleRoles().some((role) => role.draft)).toBe(true);
  });
});

describe("stack", () => {
  it("has unique ids", () => {
    const ids = STACK.map((tech) => tech.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
