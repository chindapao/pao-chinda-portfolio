import { ArrowRight, Users, User } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { ArchitectureDiagram } from "@/components/project/architecture-diagram";
import { ProjectMockup } from "@/components/project/project-mockup";
import { TechChips } from "@/components/project/tech-chips";
import { Container, SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FEATURED_PROJECTS, PROJECTS } from "@/content/projects";
import { cn, formatPeriod } from "@/lib/utils";

export function FeaturedProjects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="py-20 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          id="projects-title"
          eyebrow="01 · featured projects"
          title="Real systems, real constraints."
          lede="Payments that can't be faked, tenants that can't see each other, AI that can't send without a human. Each card shows the architecture behind the screen."
        />

        <ol className="flex flex-col gap-8">
          {FEATURED_PROJECTS.map((project, index) => (
            <Reveal as="li" key={project.slug}>
              <Card glow className="group relative overflow-hidden">
                <article className="grid gap-8 p-5 sm:p-8 lg:grid-cols-2 lg:gap-10">
                  <div className={cn("flex flex-col gap-5", index % 2 === 1 && "lg:order-2")}>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="primary">{project.category}</Badge>
                      <Badge>
                        {project.role.team === "solo" ? <User aria-hidden="true" /> : <Users aria-hidden="true" />}
                        {project.role.title}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-2xl font-bold sm:text-3xl">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="rounded outline-none after:absolute after:inset-0 focus-visible:underline focus-visible:decoration-primary focus-visible:underline-offset-4"
                        >
                          {project.name}
                        </Link>
                      </h3>
                      <p className="font-mono text-xs text-muted-foreground">{formatPeriod(project.period)}</p>
                    </div>
                    <p className="leading-relaxed text-muted-foreground">{project.tagline}</p>

                    <dl className="grid grid-cols-3 gap-2">
                      {project.outcomes.slice(0, 3).map((metric) => (
                        <div key={metric.label} className="flex flex-col gap-0.5 rounded-lg border border-border bg-background/60 p-3">
                          <dt className="order-2 text-[0.7rem] leading-snug text-muted-foreground sm:text-xs">{metric.label}</dt>
                          <dd className="font-mono text-lg font-medium text-primary sm:text-xl">{metric.value}</dd>
                        </div>
                      ))}
                    </dl>

                    <TechChips ids={project.stack} limit={6} />

                    <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-sm text-primary">
                      View project
                      <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    <ProjectMockup project={project} />
                    <div className="hidden sm:block">
                      <ArchitectureDiagram architecture={project.architecture} title={project.name} compact />
                    </div>
                  </div>
                </article>
              </Card>
            </Reveal>
          ))}
        </ol>

        <Reveal className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/projects">
              All {PROJECTS.length} projects <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
