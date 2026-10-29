import { visibleOnly } from "@/lib/drafts";
import type { Role } from "@/types";

/*
 * Career roles, newest first. Only the first entry is confirmed by the repositories themselves (CVKH is Pao's own
 * product). The others are DRAFTS — fill in the real title and dates, then set `draft: false`:
 *  - KOSIGN: WeLoan365 and E-Learning API live in KOSIGN's GitLab, so this is the employer; title and start date
 *    are unconfirmed (first commits on these repos: Jan 2026).
 *  - Earlier roles: the GitHub account dates from 2020; add the positions before 2026 here.
 */
export const ROLES: Role[] = [
  {
    organization: "Independent",
    title: "Founder & full-stack engineer",
    period: { start: "2026-09" },
    location: "Phnom Penh",
    summary: "Designing, building and running CVKH end to end: product, Spring Boot APIs, Next.js apps, payments and ops.",
    projects: ["cvkh"],
    draft: false,
  },
  {
    organization: "KOSIGN",
    title: "Full-stack engineer",
    period: { start: "2026-01" },
    location: "Phnom Penh",
    summary: "Multi-tenant fintech and internal platforms in Spring Boot and Next.js; top contributor on WeLoan365.",
    projects: ["weloan365", "e-learning"],
    draft: true,
  },
  {
    organization: "Earlier experience",
    title: "Add roles before 2026",
    period: { start: "2020-01", end: "2025-12" },
    location: "Phnom Penh",
    summary: "Placeholder: replace with the companies, titles and dates of earlier roles.",
    projects: [],
    draft: true,
  },
];

export function visibleRoles(): Role[] {
  return visibleOnly(ROLES);
}
