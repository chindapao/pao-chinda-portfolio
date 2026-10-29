import type { Metadata } from "next";

import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/project/project-card";
import { Container, SectionHeading } from "@/components/section-heading";
import { getProjects } from "@/content";
import { format, getMessages } from "@/i18n";
import { alternates, localeOf } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const locale = await localeOf(params);
  const m = getMessages(locale);
  return { title: m.meta.projectsTitle, description: m.meta.projectsDescription, alternates: alternates(locale, "/projects") };
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const locale = await localeOf(params);
  const m = getMessages(locale);
  const projects = getProjects(locale);
  return (
    <div className="bg-dot-grid pt-32 pb-24 [background-position:center_top]">
      <Container className="flex flex-col gap-12">
        <SectionHeading as="h1" eyebrow={m.projects.eyebrow} title={m.projects.title} lede={format(m.projects.lede, { count: projects.length })} />
        <Stagger as="ul" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <StaggerItem as="li" key={project.slug}>
              <ProjectCard project={project} locale={locale} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </div>
  );
}
