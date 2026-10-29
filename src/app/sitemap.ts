import type { MetadataRoute } from "next";

import { PROFILE } from "@/content/profile";
import { PROJECTS } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = PROFILE.siteUrl.replace(/\/$/, "");
  const pages = ["", "/projects", "/about", "/contact", "/cv"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
  const projects = PROJECTS.map((project) => ({
    url: `${base}/projects/${project.slug}`,
    changeFrequency: "monthly" as const,
    priority: project.featured ? 0.8 : 0.6,
  }));
  return [...pages, ...projects];
}
