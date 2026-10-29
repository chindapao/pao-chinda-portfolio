import { Clock, MapPin, Sparkles } from "lucide-react";
import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { GitHubIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { Container, SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { PROFILE } from "@/content/profile";

export const metadata: Metadata = {
  title: "Contact",
  description: `Hire ${PROFILE.name}, ${PROFILE.role}. ${PROFILE.availability.slots}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const facts = [
    { icon: Sparkles, text: PROFILE.availability.slots },
    { icon: Clock, text: PROFILE.availability.responseTime },
    { icon: MapPin, text: `${PROFILE.location} · remote-friendly` },
  ];
  return (
    <div className="bg-dot-grid pt-32 pb-24">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading as="h1" eyebrow="contact" title="Let's build something." lede="Tell me what you're working on — a role, a product or a rescue mission. I read every message." />
          <Reveal as="ul" className="flex flex-col gap-3">
            {facts.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 font-mono text-sm text-muted-foreground">
                <span className="flex size-8 items-center justify-center rounded-md border border-border bg-surface text-primary">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                {text}
              </li>
            ))}
            <li className="flex items-center gap-3 font-mono text-sm text-muted-foreground">
              <span className="flex size-8 items-center justify-center rounded-md border border-border bg-surface text-primary">
                <GitHubIcon className="size-4" />
              </span>
              <a href={PROFILE.socials.github} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-primary hover:underline">
                {PROFILE.socials.github.replace("https://", "")}
              </a>
            </li>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <Card className="relative p-5 sm:p-8">
            <ContactForm />
          </Card>
        </Reveal>
      </Container>
    </div>
  );
}
