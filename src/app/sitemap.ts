import type { MetadataRoute } from "next";

import { PROFILE } from "@/content/profile";
import { PROJECTS } from "@/content/projects";
import { localePath, LOCALES } from "@/i18n/config";

/** Every page in every locale, each listing its language alternates (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = PROFILE.siteUrl.replace(/\/$/, "");
  const url = (locale: (typeof LOCALES)[number], path: string) => `${base}${localePath(locale, path)}`.replace(/\/$/, "") || base;
  const pages = [
    ...["/", "/projects", "/about", "/contact", "/cv"].map((path) => ({ path, priority: path === "/" ? 1 : 0.7 })),
    ...PROJECTS.map((project) => ({ path: `/projects/${project.slug}`, priority: project.featured ? 0.8 : 0.6 })),
  ];
  return pages.flatMap(({ path, priority }) =>
    LOCALES.map((locale) => ({
      url: url(locale, path),
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, url(l, path)])) },
    })),
  );
}
