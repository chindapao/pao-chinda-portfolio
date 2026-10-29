import { About } from "@/components/sections/about";
import { ContactCta } from "@/components/sections/contact-cta";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Hero } from "@/components/sections/hero";
import { Journey } from "@/components/sections/journey";
import { OpenSource } from "@/components/sections/open-source";
import { TechStack } from "@/components/sections/tech-stack";
import { Testimonials } from "@/components/sections/testimonials";
import { localeOf } from "@/lib/seo";

/** Recruiter path: who + availability (hero) → proof (projects) → depth (journey, stack) → person → contact. */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = await localeOf(params);
  return (
    <>
      <Hero locale={locale} />
      <FeaturedProjects locale={locale} />
      <Journey locale={locale} />
      <TechStack locale={locale} />
      <About locale={locale} />
      <OpenSource locale={locale} />
      <Testimonials locale={locale} />
      <ContactCta locale={locale} />
    </>
  );
}
