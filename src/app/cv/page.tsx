import type { Metadata } from "next";

import { Container } from "@/components/section-heading";
import { PROFILE } from "@/content/profile";
import { PROJECTS_BY_DATE } from "@/content/projects";
import { STACK, STACK_CATEGORIES } from "@/content/stack";
import { formatPeriod } from "@/lib/utils";

import { PrintButton } from "./print-button";

export const metadata: Metadata = {
  title: "CV",
  description: `Résumé of ${PROFILE.name}, ${PROFILE.role}.`,
  alternates: { canonical: "/cv" },
};

/**
 * The CV is rendered from the same content as the site, so it can never drift from it. "Save as PDF" uses the
 * browser's print dialog with the print styles in globals.css (light, ink-friendly, no chrome).
 */
export default function CvPage() {
  return (
    <div className="pt-28 pb-24 print:p-0">
      <Container className="max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <p className="font-mono text-xs text-muted-foreground">
            <span className="text-syntax-comment">{"// "}</span>printable résumé — generated from this site&apos;s content
          </p>
          <PrintButton />
        </div>

        <article className="flex flex-col gap-8 rounded-2xl border border-border bg-surface p-6 sm:p-10 print:border-0 print:p-0 print:text-[10.5pt]">
          <header className="flex flex-col gap-2 border-b border-border pb-6">
            <h1 className="text-3xl font-extrabold sm:text-4xl">{PROFILE.name}</h1>
            <p className="text-lg font-medium text-primary">{PROFILE.role}</p>
            <p className="font-mono text-xs text-muted-foreground">
              {[PROFILE.location, PROFILE.email, PROFILE.socials.github.replace("https://", ""), PROFILE.socials.linkedin?.replace("https://", ""), PROFILE.siteUrl.replace("https://", "")]
                .filter(Boolean)
                .join("  ·  ")}
            </p>
          </header>

          <section aria-labelledby="cv-summary" className="flex flex-col gap-2">
            <h2 id="cv-summary" className="font-mono text-xs font-medium tracking-widest text-primary uppercase">
              Summary
            </h2>
            {PROFILE.bio.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-foreground/90">
                {paragraph}
              </p>
            ))}
          </section>

          <section aria-labelledby="cv-skills" className="flex flex-col gap-3">
            <h2 id="cv-skills" className="font-mono text-xs font-medium tracking-widest text-primary uppercase">
              Skills
            </h2>
            <dl className="grid gap-2 sm:grid-cols-[10rem_1fr]">
              {STACK_CATEGORIES.map((category) => (
                <div key={category.id} className="contents">
                  <dt className="font-semibold">{category.label}</dt>
                  <dd className="text-muted-foreground">
                    {STACK.filter((tech) => tech.category === category.id)
                      .map((tech) => tech.name)
                      .join(", ")}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="cv-experience" className="flex flex-col gap-5">
            <h2 id="cv-experience" className="font-mono text-xs font-medium tracking-widest text-primary uppercase">
              Selected projects
            </h2>
            {PROJECTS_BY_DATE.map((project) => (
              <div key={project.slug} className="flex break-inside-avoid flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-base font-bold tracking-tight">
                    {project.name} <span className="font-normal text-muted-foreground">— {project.role.title}</span>
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">{formatPeriod(project.period)}</span>
                </div>
                <p className="text-sm text-foreground/90">{project.tagline}</p>
                <ul className="flex list-disc flex-col gap-0.5 pl-5 text-sm text-muted-foreground">
                  {project.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </article>
      </Container>
    </div>
  );
}
