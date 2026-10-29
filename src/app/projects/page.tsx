import type { Metadata } from "next";

import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/project/project-card";
import { Container, SectionHeading } from "@/components/section-heading";
import { PROJECTS } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case studies: multi-tenant fintech, a paid SaaS with local payment rails, AI for government, booking and streaming systems.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="bg-dot-grid pt-32 pb-24 [background-position:center_top]">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          as="h1"
          eyebrow="projects/"
          title="Everything I've built lately."
          lede={`${PROJECTS.length} systems, each with its architecture, decisions and outcomes.`}
        />
        <Stagger as="ul" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <StaggerItem as="li" key={project.slug}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </div>
  );
}
