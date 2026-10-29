import { ArrowLeft, ArrowRight, ArrowUpRight, Users, User } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { ArchitectureDiagram } from "@/components/project/architecture-diagram";
import { ProjectMockup } from "@/components/project/project-mockup";
import { TechChips } from "@/components/project/tech-chips";
import { Container } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProject, PROJECTS } from "@/content/projects";
import { formatPeriod } from "@/lib/utils";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: `${project.name} — case study`,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: `${project.name} — case study`, description: project.summary },
  };
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal as="section" className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
        <span aria-hidden="true" className="font-mono text-base text-primary">
          #
        </span>
        {title}
      </h2>
      {children}
    </Reveal>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed text-muted-foreground">
          <span aria-hidden="true" className="font-mono text-primary">
            ▸
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const index = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = PROJECTS[(index + 1) % PROJECTS.length]!;
  const links = Object.entries(project.links ?? {}).filter((entry): entry is [string, string] => Boolean(entry[1]));
  const linkLabel: Record<string, string> = { live: "Live site", repo: "Source code", caseStudy: "Case study" };

  return (
    <article className="pt-28 pb-24">
      <header className="bg-dot-grid border-b border-border pb-14">
        <Container className="flex flex-col gap-10">
          <Link href="/projects" className="inline-flex w-fit items-center gap-1.5 rounded font-mono text-xs text-muted-foreground hover:text-primary">
            <ArrowLeft aria-hidden="true" className="size-3.5" /> cd ../projects
          </Link>
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary">{project.category}</Badge>
                <Badge>
                  {project.role.team === "solo" ? <User aria-hidden="true" /> : <Users aria-hidden="true" />}
                  {project.role.team === "solo" ? "Solo" : "Team"} · {formatPeriod(project.period)}
                </Badge>
              </div>
              <h1 className="text-4xl leading-[1.05] font-extrabold sm:text-5xl">{project.name}</h1>
              <p className="text-lg leading-relaxed font-light text-muted-foreground sm:text-xl">{project.tagline}</p>
              <p className="text-sm">
                <span className="font-mono text-xs text-primary">role: </span>
                <span className="font-medium">{project.role.title}</span>
                {project.role.contribution ? <span className="text-muted-foreground"> — {project.role.contribution}</span> : null}
              </p>
              {links.length ? (
                <div className="flex flex-wrap gap-2">
                  {links.map(([key, href]) => (
                    <Button key={key} asChild variant="outline" size="sm">
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {linkLabel[key] ?? key} <ArrowUpRight aria-hidden="true" />
                      </a>
                    </Button>
                  ))}
                </div>
              ) : null}
            </div>
            <ProjectMockup project={project} priority />
          </div>
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {project.outcomes.map((metric) => (
              <div key={metric.label} className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-4">
                <dt className="order-2 text-xs text-muted-foreground">{metric.label}</dt>
                <dd className="font-mono text-2xl font-medium text-primary">{metric.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </header>

      <Container className="grid gap-14 pt-14 lg:grid-cols-[1fr_17rem]">
        <div className="flex min-w-0 flex-col gap-14">
          <Block title="Overview">
            <p className="leading-relaxed text-muted-foreground">{project.overview}</p>
          </Block>
          <Block title="The problem">
            <p className="leading-relaxed text-muted-foreground">{project.problem}</p>
          </Block>
          <Block title="Architecture">
            <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
              <ArchitectureDiagram architecture={project.architecture} title={project.name} />
            </div>
          </Block>
          <Block title="Key features">
            <Bullets items={project.features} />
          </Block>
          {project.challenges.length ? (
            <Block title="Challenges & decisions">
              <dl className="flex flex-col gap-3">
                {project.challenges.map((challenge) => (
                  <div key={challenge.title} className="rounded-xl border border-border bg-surface p-5">
                    <dt className="font-semibold">{challenge.title}</dt>
                    <dd className="mt-2 leading-relaxed text-muted-foreground">{challenge.solution}</dd>
                  </div>
                ))}
              </dl>
            </Block>
          ) : null}
          <Block title="What I'm proud of">
            <Bullets items={project.achievements} />
          </Block>
        </div>

        <aside aria-label="Project facts" className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-3">
            <h2 className="font-mono text-xs font-medium tracking-widest text-primary uppercase">My role</h2>
            <Bullets items={project.responsibilities} />
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="font-mono text-xs font-medium tracking-widest text-primary uppercase">Stack</h2>
            <TechChips ids={project.stack} />
          </div>
        </aside>
      </Container>

      <Container className="pt-16">
        <Link
          href={`/projects/${next.slug}`}
          className="glow-card group flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-5 sm:p-6"
        >
          <span className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground">next project</span>
            <span className="text-xl font-bold">{next.name}</span>
          </span>
          <ArrowRight aria-hidden="true" className="size-5 text-primary transition-transform group-hover:translate-x-1" />
        </Link>
      </Container>
    </article>
  );
}
