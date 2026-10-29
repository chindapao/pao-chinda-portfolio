import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Container, SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/content";
import { PROJECTS } from "@/content/projects";
import { getMessages, type Locale, localePath } from "@/i18n";

/** Abstract "workspace" visual: a commit-activity grid plus an editor pane, drawn in CSS (no image to load). */
function WorkspaceVisual() {
  // Deterministic pseudo-activity so server and client render the same cells.
  const levels = Array.from({ length: 7 * 18 }, (_, i) => ((i * 7919) % 13) % 5);
  const shade = ["bg-surface-raised", "bg-primary/20", "bg-primary/40", "bg-primary/65", "bg-primary"];
  return (
    <div aria-hidden="true" className="relative">
      <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-primary/10 blur-3xl" />
      <div className="flex flex-col gap-4 rounded-2xl border border-border-strong bg-surface p-5 sm:p-6">
        <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
          <span>~/pao/activity</span>
          <span className="text-primary">● online</span>
        </div>
        <div className="grid grid-flow-col grid-rows-7 gap-1">
          {levels.map((level, i) => (
            <span key={i} className={`aspect-square rounded-[3px] ${shade[level]}`} />
          ))}
        </div>
        <div className="rounded-lg border border-border bg-background/70 p-4 font-mono text-xs leading-6">
          <p>
            <span className="text-syntax-keyword">export function</span> <span className="text-syntax-property">ship</span>
            <span className="text-muted-foreground">(idea) {"{"}</span>
          </p>
          <p className="pl-4">
            <span className="text-syntax-keyword">return</span> idea
          </p>
          <p className="pl-8 text-muted-foreground">
            .<span className="text-syntax-property">contract</span>()
          </p>
          <p className="pl-8 text-muted-foreground">
            .<span className="text-syntax-property">test</span>()
          </p>
          <p className="pl-8 text-muted-foreground">
            .<span className="text-syntax-property">deploy</span>(<span className="text-syntax-string">&quot;vercel&quot;</span>);
          </p>
          <p className="text-muted-foreground">{"}"}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 font-mono text-[0.68rem] text-muted-foreground">
          <span className="rounded-md border border-border px-2 py-1.5">{PROJECTS.length} systems</span>
          <span className="rounded-md border border-border px-2 py-1.5">km / en</span>
          <span className="rounded-md border border-border px-2 py-1.5">UTC+7</span>
        </div>
      </div>
    </div>
  );
}

export function About({ locale }: { locale: Locale }) {
  const profile = getProfile(locale);
  const m = getMessages(locale);
  return (
    <section id="about" aria-labelledby="about-title" className="overflow-hidden border-y border-border bg-surface/30 py-20 sm:py-28 defer-render">
      <Container className="grid grid-cols-[minmax(0,1fr)] items-center gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-8">
          <SectionHeading id="about-title" eyebrow={m.about.eyebrow} title={m.about.title} />
          <Reveal className="flex flex-col gap-4 text-base leading-relaxed font-light text-muted-foreground sm:text-lg">
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>

          <Stagger as="ul" className="grid gap-3 sm:grid-cols-2">
            {profile.approach.map((item) => (
              <StaggerItem as="li" key={item.title} className="rounded-lg border border-border bg-surface p-4">
                <p className="font-mono text-xs font-medium text-primary">{item.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="flex flex-col gap-6">
            <ul aria-label={m.about.glance} className="flex flex-wrap gap-2">
              {profile.stats.map((stat) => (
                <li key={stat.label} className="rounded-full border border-border-strong bg-surface px-3.5 py-1.5 font-mono text-xs">
                  <span className="font-medium text-primary">{stat.value}</span> <span className="text-muted-foreground">{stat.label}</span>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="self-start">
              <Link href={localePath(locale, "/about")}>
                {m.about.more} <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <WorkspaceVisual />
        </Reveal>
      </Container>
    </section>
  );
}
