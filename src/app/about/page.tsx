import type { Metadata } from "next";

import { About } from "@/components/sections/about";
import { ContactCta } from "@/components/sections/contact-cta";
import { Journey } from "@/components/sections/journey";
import { TechStack } from "@/components/sections/tech-stack";
import { Container, SectionHeading } from "@/components/section-heading";
import { PROFILE } from "@/content/profile";

export const metadata: Metadata = {
  title: "About",
  description: `${PROFILE.name}: ${PROFILE.bio[0]}`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <div className="bg-dot-grid pt-32 pb-4">
        <Container>
          <SectionHeading as="h1" eyebrow="about" title={`Hi, I'm ${PROFILE.givenName}.`} lede={PROFILE.subheading} />
        </Container>
      </div>
      <About />
      <Journey />
      <TechStack />
      <ContactCta />
    </>
  );
}
