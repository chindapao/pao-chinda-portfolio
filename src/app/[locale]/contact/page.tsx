import { Clock, Mail, MapPin, Sparkles } from "lucide-react";
import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { ContactProviders } from "@/components/contact/contact-providers";
import { GitHubIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { Container, SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProfile } from "@/content";
import { format, getMessages } from "@/i18n";
import { isContactConfigured } from "@/lib/env";
import { alternates, localeOf } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const locale = await localeOf(params);
  const profile = getProfile(locale);
  const m = getMessages(locale);
  return {
    title: m.meta.contactTitle,
    description: format(m.meta.contactDescription, { name: profile.name, role: profile.role, slots: profile.availability.slots }),
    alternates: alternates(locale, "/contact"),
  };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const locale = await localeOf(params);
  const profile = getProfile(locale);
  const m = getMessages(locale);
  const github = profile.socials.github;
  const facts = [
    { icon: Sparkles, text: profile.availability.slots },
    { icon: Clock, text: profile.availability.responseTime },
    { icon: MapPin, text: format(m.contact.remote, { location: profile.location }) },
  ];
  const iconBox = "flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-primary";

  return (
    <div className="bg-dot-grid pt-32 pb-24">
      <Container className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading as="h1" eyebrow={m.contact.eyebrow} title={m.cta.title} lede={m.contact.lede} />
          <Reveal as="ul" className="flex flex-col gap-3">
            {facts.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 font-mono text-sm text-muted-foreground">
                <span className={iconBox}>
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                {text}
              </li>
            ))}
            <li className="flex items-center gap-3 font-mono text-sm text-muted-foreground">
              <span className={iconBox}>
                <GitHubIcon className="size-4" />
              </span>
              <a href={github} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-primary hover:underline">
                {github.replace("https://", "")}
              </a>
            </li>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <Card className="relative p-5 sm:p-8">
            {/* Read at build time on the server: without Resend configured, offer direct channels instead of a form that can't send. */}
            {isContactConfigured() ? (
              <ContactProviders>
                <ContactForm />
              </ContactProviders>
            ) : (
              <div className="flex flex-col items-start gap-4">
                <p className="text-xl font-bold">{m.contact.offlineTitle}</p>
                <p className="text-muted-foreground">{m.contact.offlineBody}</p>
                <div className="flex flex-wrap gap-2">
                  {profile.email ? (
                    <Button asChild>
                      <a href={`mailto:${profile.email}`}>
                        <Mail aria-hidden="true" /> {profile.email}
                      </a>
                    </Button>
                  ) : null}
                  <Button asChild variant="outline">
                    <a href={github} target="_blank" rel="noopener noreferrer">
                      <GitHubIcon /> GitHub
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </Reveal>
      </Container>
    </div>
  );
}
