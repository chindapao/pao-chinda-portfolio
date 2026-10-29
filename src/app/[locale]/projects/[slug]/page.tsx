import { ArrowLeft, ArrowRight, ArrowUpRight, Languages, User, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { ArchitectureDiagram } from "@/components/project/architecture-diagram";
import { ProjectMockup } from "@/components/project/project-mockup";
import { ScreenshotGallery } from "@/components/project/screenshot-gallery";
import { TechChips } from "@/components/project/tech-chips";
import { Container } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProject, getProjects } from "@/content";
import { PROJECTS } from "@/content/projects";
import { format, formatPeriod, getMessages, localePath, LOCALES } from "@/i18n";
import { alternates, localeOf } from "@/lib/seo";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => PROJECTS.map((project) => ({ locale, slug: project.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const locale = await localeOf(params);
  const project = getProject((await params).slug, locale);
  if (!project) return {};
  const title = format(getMessages(locale).meta.caseStudy, { name: project.name });
  return {
    title,
    description: project.summary,
    alternates: alternates(locale, `/projects/${project.slug}`),
    openGraph: { title, description: project.summary },
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

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const locale = await localeOf(params);
  const project = getProject((await params).slug, locale);
  if (!project) notFound();
  const m = getMessages(locale);

  const projects = getProjects(locale);
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length]!;
  const links = Object.entries(project.links ?? {}).filter((entry): entry is [keyof typeof m.project.links, string] => Boolean(entry[1]));

  return (
    <article className="pt-28 pb-24">
      <header className="bg-dot-grid border-b border-border pb-14">
        <Container className="flex flex-col gap-10">
          <Link
            href={localePath(locale, "/projects")}
            className="inline-flex w-fit items-center gap-1.5 rounded font-mono text-xs text-muted-foreground hover:text-primary"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" /> {m.project.back}
          </Link>
          <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary">{project.category}</Badge>
                <Badge>
                  {project.role.team === "solo" ? <User aria-hidden="true" /> : <Users aria-hidden="true" />}
                  {project.role.team === "solo" ? m.project.solo : m.project.team} · {formatPeriod(m, project.period)}
                </Badge>
              </div>
              <h1 className="text-4xl leading-[1.05] font-extrabold sm:text-5xl">{project.name}</h1>
              <p className="text-lg leading-relaxed font-light text-muted-foreground sm:text-xl">{project.tagline}</p>
              <p className="text-sm">
                <span className="font-mono text-xs text-primary">{m.project.role} </span>
                <span className="font-medium">{project.role.title}</span>
                {project.role.contribution ? <span className="text-muted-foreground"> — {project.role.contribution}</span> : null}
              </p>
              {links.length ? (
                <div className="flex flex-wrap gap-2">
                  {links.map(([key, href]) => (
                    <Button key={key} asChild variant="outline" size="sm">
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {m.project.links[key]} <ArrowUpRight aria-hidden="true" />
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

      <Container className="grid grid-cols-[minmax(0,1fr)] gap-14 pt-14 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="flex min-w-0 flex-col gap-14">
          {m.project.englishDetails ? (
            <p className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
              <Languages aria-hidden="true" className="size-4 shrink-0 text-primary" /> {m.project.englishDetails}
            </p>
          ) : null}
          <Block title={m.project.overview}>
            <p className="leading-relaxed text-muted-foreground">{project.overview}</p>
          </Block>
          <Block title={m.project.problem}>
            <p className="leading-relaxed text-muted-foreground">{project.problem}</p>
          </Block>
          <Block title={m.project.architecture}>
            <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
              <ArchitectureDiagram
                architecture={project.architecture}
                label={format(m.project.architectureLabel, { name: project.name, count: project.architecture.layers.length })}
              />
            </div>
          </Block>
          {project.screenshots?.length ? (
            <Block title={m.project.screenshots}>
              <ScreenshotGallery screenshots={project.screenshots} />
            </Block>
          ) : null}
          <Block title={m.project.features}>
            <Bullets items={project.features} />
          </Block>
          {project.challenges.length ? (
            <Block title={m.project.challenges}>
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
          <Block title={m.project.proud}>
            <Bullets items={project.achievements} />
          </Block>
        </div>

        <aside aria-label={m.project.facts} className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-3">
            <h2 className="font-mono text-xs font-medium tracking-widest text-primary uppercase">{m.project.myRole}</h2>
            <Bullets items={project.responsibilities} />
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="font-mono text-xs font-medium tracking-widest text-primary uppercase">{m.project.stack}</h2>
            <TechChips ids={project.stack} />
          </div>
        </aside>
      </Container>

      <Container className="pt-16">
        <Link
          href={localePath(locale, `/projects/${next.slug}`)}
          className="glow-card group flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-5 sm:p-6"
        >
          <span className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground">{m.project.next}</span>
            <span className="text-xl font-bold">{next.name}</span>
          </span>
          <ArrowRight aria-hidden="true" className="size-5 text-primary transition-transform group-hover:translate-x-1" />
        </Link>
      </Container>
    </article>
  );
}
