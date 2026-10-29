import { ArrowRight, Clock, Mail } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/content";
import { getMessages, type Locale, localePath } from "@/i18n";

export function ContactCta({ locale }: { locale: Locale }) {
  const { availability, email } = getProfile(locale);
  const m = getMessages(locale);
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden py-24 sm:py-32 defer-render">
      <div aria-hidden="true" className="bg-dot-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div aria-hidden="true" className="absolute top-1/2 left-1/2 -z-10 h-80 w-[40rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-[100px]" />
      <Container>
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <p className="inline-flex items-center gap-2 font-mono text-xs text-primary">
            <span aria-hidden="true" className="size-2 animate-pulse-dot rounded-full bg-primary" />
            {availability.slots}
          </p>
          <h2 id="cta-title" className="text-4xl leading-[1.05] font-extrabold sm:text-6xl">
            {m.cta.title}
          </h2>
          <p className="text-lg font-light text-muted-foreground">{m.cta.body}</p>
          <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg">
              <Link href={localePath(locale, "/contact")}>
                {m.cta.start} <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            {email ? (
              <Button asChild size="lg" variant="ghost">
                <a href={`mailto:${email}`}>
                  <Mail aria-hidden="true" /> {m.cta.email}
                </a>
              </Button>
            ) : null}
          </div>
          <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <Clock aria-hidden="true" className="size-3.5" /> {availability.responseTime}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
