import { About } from "@/components/sections/about";
import { ContactCta } from "@/components/sections/contact-cta";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Hero } from "@/components/sections/hero";
import { Journey } from "@/components/sections/journey";
import { OpenSource } from "@/components/sections/open-source";
import { TechStack } from "@/components/sections/tech-stack";
import { Testimonials } from "@/components/sections/testimonials";

/** Recruiter path: who + availability (hero) → proof (projects) → depth (journey, stack) → person → contact. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <Journey />
      <TechStack />
      <About />
      <OpenSource />
      <Testimonials />
      <ContactCta />
    </>
  );
}
