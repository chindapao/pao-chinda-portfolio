import type { Locale } from "@/i18n/config";
import type { Profile, Project, Role, StackCategory } from "@/types";

import { PROFILE_KM, PROJECTS_KM, ROLES_KM, STACK_CATEGORIES_KM } from "./km";
import { PROFILE } from "./profile";
import { PROJECTS } from "./projects";
import { visibleRoles } from "./roles";
import { STACK_CATEGORIES } from "./stack";

/*
 * Locale-aware access to the content. Components call these instead of importing the raw English data, so the
 * Khmer overlay applies everywhere and untranslated fields fall back to English.
 */

export function getProfile(locale: Locale): Profile {
  if (locale === "en") return PROFILE;
  return {
    ...PROFILE,
    role: PROFILE_KM.role,
    location: PROFILE_KM.location,
    availability: { ...PROFILE.availability, ...PROFILE_KM.availability },
    headline: PROFILE_KM.headline,
    subheading: PROFILE_KM.subheading,
    bio: PROFILE_KM.bio,
    approach: PROFILE_KM.approach,
    stats: PROFILE.stats.map((stat, i) => ({ ...stat, label: PROFILE_KM.statLabels[i] ?? stat.label })),
  };
}

function localizeProject(project: Project, locale: Locale): Project {
  const km = locale === "km" ? PROJECTS_KM[project.slug] : undefined;
  if (!km) return project;
  return {
    ...project,
    tagline: km.tagline,
    summary: km.summary,
    role: { ...project.role, title: km.roleTitle, contribution: km.contribution ?? project.role.contribution },
    overview: km.overview ?? project.overview,
    problem: km.problem ?? project.problem,
    achievements: km.achievements,
    outcomes: project.outcomes.map((metric, i) => ({ ...metric, label: km.outcomeLabels[i] ?? metric.label })),
  };
}

export function getProjects(locale: Locale): Project[] {
  return PROJECTS.map((project) => localizeProject(project, locale));
}

export function getFeaturedProjects(locale: Locale): Project[] {
  return getProjects(locale).filter((project) => project.featured);
}

/** Newest first, for the journey timeline and the CV. */
export function getProjectsByDate(locale: Locale): Project[] {
  return getProjects(locale).sort((a, b) => b.period.start.localeCompare(a.period.start));
}

export function getProject(slug: string, locale: Locale): Project | undefined {
  const project = PROJECTS.find((p) => p.slug === slug);
  return project && localizeProject(project, locale);
}

export function getStackCategories(locale: Locale): { id: StackCategory; label: string; blurb: string }[] {
  return locale === "km" ? STACK_CATEGORIES.map((c) => ({ id: c.id, ...STACK_CATEGORIES_KM[c.id] })) : STACK_CATEGORIES;
}

export function getRoles(locale: Locale): Role[] {
  return visibleRoles().map((role) => {
    const km = locale === "km" ? ROLES_KM[role.organization] : undefined;
    return km ? { ...role, ...km, organization: km.organization ?? role.organization } : role;
  });
}
