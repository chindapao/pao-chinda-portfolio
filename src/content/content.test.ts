import { afterEach, describe, expect, it, vi } from "vitest";

import { FEATURED_PROJECTS, PROJECTS } from "./projects";
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
    expect(FEATURED_PROJECTS).toHaveLength(3);
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
});

describe("stack", () => {
  it("has unique ids", () => {
    const ids = STACK.map((tech) => tech.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("testimonials", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("never show drafts in a production build", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(visibleTestimonials().every((testimonial) => !testimonial.draft)).toBe(true);
  });

  it("show drafts on preview deployments", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(visibleTestimonials().some((testimonial) => testimonial.draft)).toBe(true);
  });
});
