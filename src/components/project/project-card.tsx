import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ProjectMockup } from "@/components/project/project-mockup";
import { TechChips } from "@/components/project/tech-chips";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPeriod, getMessages, type Locale, localePath } from "@/i18n";
import type { Project } from "@/types";

export function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  const m = getMessages(locale);
  return (
    <Card glow className="group relative flex h-full flex-col gap-4 p-4 sm:p-5">
      <ProjectMockup project={project} />
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="primary">{project.category}</Badge>
        <span className="font-mono text-xs text-muted-foreground">{formatPeriod(m, project.period)}</span>
      </div>
      <h2 className="text-xl font-bold">
        <Link
          href={localePath(locale, `/projects/${project.slug}`)}
          className="rounded outline-none after:absolute after:inset-0 focus-visible:underline focus-visible:decoration-primary focus-visible:underline-offset-4"
        >
          {project.name}
        </Link>
      </h2>
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>
      <TechChips ids={project.stack} limit={4} />
      <span className="inline-flex items-center gap-1.5 font-mono text-sm text-primary">
        {m.common.viewProject} <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Card>
  );
}
