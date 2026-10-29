import type { Metadata } from "next";

import { Container } from "@/components/section-heading";
import { getProfile, getProjectsByDate, getRoles, getStackCategories } from "@/content";
import { STACK } from "@/content/stack";
import { format, formatPeriod, getMessages } from "@/i18n";
import { alternates, localeOf } from "@/lib/seo";

import { PrintButton } from "./print-button";

export async function generateMetadata({ params }: PageProps<"/[locale]/cv">): Promise<Metadata> {
  const locale = await localeOf(params);
  const profile = getProfile(locale);
  const m = getMessages(locale);
  return {
    title: m.meta.cvTitle,
    description: format(m.meta.cvDescription, { name: profile.name, role: profile.role }),
    alternates: alternates(locale, "/cv"),
  };
}

const heading = "font-mono text-xs font-medium tracking-widest text-primary uppercase";

/**
 * The CV is rendered from the same content as the site, so it can never drift from it. "Save as PDF" uses the
 * browser's print dialog with the print styles in globals.css (light, ink-friendly, no chrome).
 */
export default async function CvPage({ params }: PageProps<"/[locale]/cv">) {
  const locale = await localeOf(params);
  const profile = getProfile(locale);
  const m = getMessages(locale);
  const roles = getRoles(locale);
  const contactLine = [
    profile.location,
    profile.email,
    profile.socials.github.replace("https://", ""),
    profile.socials.linkedin?.replace("https://", ""),
    profile.siteUrl.replace("https://", ""),
  ].filter(Boolean);

  return (
    <div className="pt-28 pb-24 print:p-0">
      <Container className="max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <p className="font-mono text-xs text-muted-foreground">
            <span className="text-syntax-comment">{"// "}</span>
            {m.cv.comment}
          </p>
          <PrintButton label={m.cv.save} />
        </div>

        <article className="flex flex-col gap-8 rounded-2xl border border-border bg-surface p-6 sm:p-10 print:border-0 print:p-0 print:text-[10.5pt]">
          <header className="flex flex-col gap-2 border-b border-border pb-6">
            <h1 className="text-3xl font-extrabold sm:text-4xl">{profile.name}</h1>
            <p className="text-lg font-medium text-primary">{profile.role}</p>
            <p className="font-mono text-xs text-muted-foreground">{contactLine.join("  ·  ")}</p>
          </header>

          <section aria-labelledby="cv-summary" className="flex flex-col gap-2">
            <h2 id="cv-summary" className={heading}>
              {m.cv.summary}
            </h2>
            {profile.bio.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-foreground/90">
                {paragraph}
              </p>
            ))}
          </section>

          <section aria-labelledby="cv-skills" className="flex flex-col gap-3">
            <h2 id="cv-skills" className={heading}>
              {m.cv.skills}
            </h2>
            <dl className="grid gap-2 sm:grid-cols-[10rem_1fr]">
              {getStackCategories(locale).map((category) => (
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

          {roles.length ? (
            <section aria-labelledby="cv-experience" className="flex flex-col gap-4">
              <h2 id="cv-experience" className={heading}>
                {m.cv.experience}
              </h2>
              {roles.map((role) => (
                <div key={`${role.organization}-${role.period.start}`} className="flex break-inside-avoid flex-col gap-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-base font-bold tracking-tight">
                      {role.title} <span className="font-normal text-muted-foreground">— {role.organization}</span>
                      {role.draft ? <span className="ml-2 font-mono text-[0.6rem] text-syntax-literal print:hidden">{m.common.draft}</span> : null}
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground">{formatPeriod(m, role.period)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{role.summary}</p>
                </div>
              ))}
            </section>
          ) : null}

          <section aria-labelledby="cv-projects" className="flex flex-col gap-5">
            <h2 id="cv-projects" className={heading}>
              {m.cv.selected}
            </h2>
            {getProjectsByDate(locale).map((project) => (
              <div key={project.slug} className="flex break-inside-avoid flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-base font-bold tracking-tight">
                    {project.name} <span className="font-normal text-muted-foreground">— {project.role.title}</span>
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">{formatPeriod(m, project.period)}</span>
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
