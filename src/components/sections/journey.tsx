import { GitCommitHorizontal } from "lucide-react";
import Link from "next/link";

import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { TechChips } from "@/components/project/tech-chips";
import { Container, SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { PROJECTS_BY_DATE } from "@/content/projects";
import { cn, focusRing, formatPeriod } from "@/lib/utils";
import type { ProjectStatus } from "@/types";

const STATUS: Record<ProjectStatus, { label: string; className: string }> = {
  live: { label: "live", className: "border-primary/30 bg-primary/10 text-primary" },
  active: { label: "active", className: "border-syntax-property/30 bg-syntax-property/10 text-syntax-property" },
  archived: { label: "shipped", className: "border-border bg-surface-raised text-muted-foreground" },
};

/** The career as a `git log --graph`: every project, newest first, with role and the achievements that matter. */
export function Journey() {
  return (
    <section id="journey" aria-labelledby="journey-title" className="border-y border-border bg-surface/30 py-20 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          id="journey-title"
          eyebrow="02 · journey"
          title={
            <>
              <span className="font-mono text-primary">git log</span> --my-career
            </>
          }
          lede="Every project, what I owned, and what it proved. Team projects show my share of the commits — numbers you can check."
        />

        <Stagger as="ol" className="relative flex flex-col gap-6 before:absolute before:top-2 before:bottom-2 before:left-[0.69rem] before:w-px before:bg-border-strong">
          {PROJECTS_BY_DATE.map((project) => (
            <StaggerItem as="li" key={project.slug} className="relative grid grid-cols-[minmax(0,1fr)] gap-3 pl-10 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8">
              <span aria-hidden="true" className="absolute top-0.5 left-0 flex size-[1.4rem] items-center justify-center rounded-full border border-primary/40 bg-background text-primary">
                <GitCommitHorizontal className="size-3.5" />
              </span>

              <div className="flex flex-row flex-wrap items-center gap-2 md:flex-col md:items-start">
                <p className="font-mono text-xs text-muted-foreground">{formatPeriod(project.period)}</p>
                <span className={cn("rounded-md border px-1.5 py-0.5 font-mono text-[0.65rem]", STATUS[project.status].className)}>
                  {STATUS[project.status].label}
                </span>
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-strong">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-lg font-bold">
                    <Link href={`/projects/${project.slug}`} className={cn("rounded transition-colors hover:text-primary", focusRing)}>
                      {project.name}
                    </Link>
                  </h3>
                  <Badge variant="outline">{project.category}</Badge>
                </div>
                <p className="text-sm text-foreground/90">
                  <span className="font-medium">{project.role.title}</span>
                  {project.role.contribution ? (
                    <span className="text-muted-foreground"> — {project.role.contribution}</span>
                  ) : null}
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
                <TechChips ids={project.stack} limit={5} className="pt-1" />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
