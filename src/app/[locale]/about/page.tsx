import type { Metadata } from "next";

import { Container, SectionHeading } from "@/components/section-heading";
import { About } from "@/components/sections/about";
import { ContactCta } from "@/components/sections/contact-cta";
import { Journey } from "@/components/sections/journey";
import { TechStack } from "@/components/sections/tech-stack";
import { getProfile } from "@/content";
import { format, getMessages } from "@/i18n";
import { alternates, localeOf } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const locale = await localeOf(params);
  const profile = getProfile(locale);
  return {
    title: getMessages(locale).meta.aboutTitle,
    description: `${profile.name}: ${profile.bio[0]}`,
    alternates: alternates(locale, "/about"),
  };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const locale = await localeOf(params);
  const profile = getProfile(locale);
  const m = getMessages(locale);
  return (
    <>
      <div className="bg-dot-grid pt-32 pb-4">
        <Container>
          <SectionHeading as="h1" eyebrow={m.about.eyebrow.replace(/^\d+ · /, "")} title={format(m.about.hi, { name: profile.givenName })} lede={profile.subheading} />
        </Container>
      </div>
      <About locale={locale} />
      <Journey locale={locale} />
      <TechStack locale={locale} />
      <ContactCta locale={locale} />
    </>
  );
}
