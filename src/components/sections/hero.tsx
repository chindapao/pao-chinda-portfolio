import { ArrowRight, FileText, MapPin } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/section-heading";
import { HeroTerminal } from "@/components/sections/hero-terminal";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/content";
import { format, getMessages, type Locale, localePath } from "@/i18n";

export function Hero({ locale }: { locale: Locale }) {
  const profile = getProfile(locale);
  const m = getMessages(locale);
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div aria-hidden="true" className="bg-dot-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div aria-hidden="true" className="absolute top-0 left-1/2 -z-10 h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      {/* items-start, not center: a centred terminal would move when the web font swaps in and resizes the copy (CLS). */}
      <Container className="grid grid-cols-[minmax(0,1fr)] items-start gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10">
        {/* Hero copy is not faded in: it is the LCP element and must paint immediately. */}
        <div className="flex flex-col items-start gap-7">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/5 py-1.5 pr-3.5 pl-2.5 font-mono text-[0.7rem] font-medium tracking-widest text-primary uppercase">
            <span aria-hidden="true" className="size-2 animate-pulse-dot rounded-full bg-primary" />
            {profile.availability.label}
          </p>

          <h1 id="hero-title" className="text-[2.6rem] leading-[1.02] font-extrabold sm:text-6xl lg:text-[4.25rem]">
            {profile.headline}
            <span aria-hidden="true" className="ml-2 inline-block h-[0.82em] w-[0.42em] translate-y-[0.08em] animate-blink rounded-[2px] bg-primary align-baseline" />
          </h1>

          <p className="max-w-xl text-lg leading-relaxed font-light text-muted-foreground sm:text-xl">{profile.subheading}</p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg">
              <Link href={`${localePath(locale, "/")}#projects`}>
                {m.hero.viewProjects} <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={localePath(locale, "/cv")}>
                <FileText aria-hidden="true" /> {m.hero.downloadCv}
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <ul aria-label={m.hero.coreStack} className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-xs text-muted-foreground">
              {profile.heroPills.map((pill, index) => (
                <li key={pill} className="flex items-center gap-2">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-muted">
                      ·
                    </span>
                  ) : null}
                  <span className="rounded-md border border-border bg-surface px-2 py-1 text-foreground/90">{pill}</span>
                </li>
              ))}
            </ul>
            <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <MapPin aria-hidden="true" className="size-3.5 text-primary" /> {format(m.hero.locationLine, { location: profile.location })}
            </p>
          </div>
        </div>

        <div className="lg:pt-14">
          <HeroTerminal />
        </div>
      </Container>
    </section>
  );
}
