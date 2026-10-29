import { ArrowRight, FileText, MapPin } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/section-heading";
import { HeroTerminal } from "@/components/sections/hero-terminal";
import { Button } from "@/components/ui/button";
import { PROFILE } from "@/content/profile";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div aria-hidden="true" className="bg-dot-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div aria-hidden="true" className="absolute top-0 left-1/2 -z-10 h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <Container className="grid grid-cols-[minmax(0,1fr)] items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10">
        {/* Hero copy is not faded in: it is the LCP element and must paint immediately. */}
        <div className="flex flex-col items-start gap-7">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/5 py-1.5 pr-3.5 pl-2.5 font-mono text-[0.7rem] font-medium tracking-widest text-primary uppercase">
            <span aria-hidden="true" className="size-2 animate-pulse-dot rounded-full bg-primary" />
            {PROFILE.availability.label}
          </p>

          <h1 id="hero-title" className="text-[2.6rem] leading-[1.02] font-extrabold sm:text-6xl lg:text-[4.25rem]">
            {PROFILE.headline}
            <span aria-hidden="true" className="ml-2 inline-block h-[0.82em] w-[0.42em] translate-y-[0.08em] animate-blink rounded-[2px] bg-primary align-baseline" />
          </h1>

          <p className="max-w-xl text-lg leading-relaxed font-light text-muted-foreground sm:text-xl">{PROFILE.subheading}</p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg">
              <Link href="/#projects">
                View projects <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/cv">
                <FileText aria-hidden="true" /> Download CV
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <ul aria-label="Core stack" className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-xs text-muted-foreground">
              {PROFILE.heroPills.map((pill, index) => (
                <li key={pill} className="flex items-center gap-2">
                  {index > 0 ? <span aria-hidden="true" className="text-muted">·</span> : null}
                  <span className="rounded-md border border-border bg-surface px-2 py-1 text-foreground/90">{pill}</span>
                </li>
              ))}
            </ul>
            <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <MapPin aria-hidden="true" className="size-3.5 text-primary" /> {PROFILE.location} · remote-friendly · UTC+7
            </p>
          </div>
        </div>

        <HeroTerminal />
      </Container>
    </section>
  );
}
