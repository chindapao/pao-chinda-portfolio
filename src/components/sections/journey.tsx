import { Briefcase, GitCommitHorizontal } from "lucide-react";
import Link from "next/link";

import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { TechChips } from "@/components/project/tech-chips";
import { Container, SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { getProjectsByDate, getRoles } from "@/content";
import { formatPeriod, getMessages, type Locale, localePath } from "@/i18n";
import { cn, focusRing } from "@/lib/utils";
import type { ProjectStatus } from "@/types";

const STATUS_CLASS: Record<ProjectStatus, string> = {
  live: "border-primary/30 bg-primary/10 text-primary",
  active: "border-syntax-property/30 bg-syntax-property/10 text-syntax-property",
  archived: "border-border bg-surface-raised text-muted-foreground",
};

const RAIL =
  "relative flex flex-col gap-6 before:absolute before:top-2 before:bottom-2 before:left-[0.69rem] before:w-px before:bg-border-strong";
const NODE = "absolute top-0.5 left-0 flex size-[1.4rem] items-center justify-center rounded-full border bg-background";
const ROW = "relative grid grid-cols-[minmax(0,1fr)] gap-3 pl-10 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8";
const SUBHEAD = "font-mono text-xs font-medium tracking-widest text-primary uppercase";

/** The career as a `git log --graph`: roles (where and when), then every project, newest first. */
export function Journey({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const roles = getRoles(locale);
  const projects = getProjectsByDate(locale);
  const projectName = new Map(projects.map((project) => [project.slug, project.name]));

  return (
    <section id="journey" aria-labelledby="journey-title" className="border-y border-border bg-surface/30 py-20 sm:py-28 defer-render">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          id="journey-title"
          eyebrow={m.journey.eyebrow}
          title={
            <>
              <span className="font-mono text-primary">git log</span> {m.journey.titleRest}
            </>
          }
          lede={m.journey.lede}
        />

        {roles.length ? (
          <div className="flex flex-col gap-5">
            <h3 className={SUBHEAD}>{m.journey.roles}</h3>
            <Stagger as="ol" className={RAIL}>
              {roles.map((role) => (
                <StaggerItem as="li" key={`${role.organization}-${role.period.start}`} className={ROW}>
                  <span aria-hidden="true" className={cn(NODE, "border-syntax-property/50 text-syntax-property")}>
                    <Briefcase className="size-3" />
                  </span>
                  <p className="font-mono text-xs text-muted-foreground">{formatPeriod(m, role.period)}</p>
                  <div
                    className={cn(
                      "flex flex-col gap-2 rounded-xl border bg-surface p-5",
                      role.draft ? "border-dashed border-syntax-literal/40" : "border-border",
                    )}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h4 className="text-lg font-bold">
                        {role.title} <span className="font-normal text-muted-foreground">· {role.organization}</span>
                      </h4>
                      {role.draft ? <span className="font-mono text-[0.7rem] text-syntax-literal">{m.common.draft}</span> : null}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{role.summary}</p>
                    {role.projects.length ? (
                      <ul className="flex flex-wrap gap-1.5">
                        {role.projects.map((slug) => (
                          <li key={slug}>
                            <Link href={localePath(locale, `/projects/${slug}`)} className={cn("rounded-md", focusRing)}>
                              <Badge variant="outline" className="hover:border-primary/50 hover:text-primary">
                                {projectName.get(slug) ?? slug}
                              </Badge>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        ) : null}

        <div className="flex flex-col gap-5">
          <h3 className={SUBHEAD}>{m.journey.projectsLog}</h3>
          <Stagger as="ol" className={RAIL}>
            {projects.map((project) => (
              <StaggerItem as="li" key={project.slug} className={ROW}>
                <span aria-hidden="true" className={cn(NODE, "border-primary/40 text-primary")}>
                  <GitCommitHorizontal className="size-3.5" />
                </span>

                <div className="flex flex-row flex-wrap items-center gap-2 md:flex-col md:items-start">
                  <p className="font-mono text-xs text-muted-foreground">{formatPeriod(m, project.period)}</p>
                  <span className={cn("rounded-md border px-1.5 py-0.5 font-mono text-[0.7rem]", STATUS_CLASS[project.status])}>
                    {m.journey.status[project.status]}
                  </span>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-strong">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h4 className="text-lg font-bold">
                      <Link
                        href={localePath(locale, `/projects/${project.slug}`)}
                        className={cn("rounded transition-colors hover:text-primary", focusRing)}
                      >
                        {project.name}
                      </Link>
                    </h4>
                    <Badge variant="outline">{project.category}</Badge>
                  </div>
                  <p className="text-sm text-foreground/90">
                    <span className="font-medium">{project.role.title}</span>
                    {project.role.contribution ? <span className="text-muted-foreground"> — {project.role.contribution}</span> : null}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {project.achievements.map((achievement) => (
                      <li key={achievement} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                        <span aria-hidden="true" className="font-mono text-primary">
                          +
                        </span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                  <TechChips ids={project.stack} limit={5} icons={false} className="pt-1" />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
