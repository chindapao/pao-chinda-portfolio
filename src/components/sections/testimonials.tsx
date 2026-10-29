import { Quote } from "lucide-react";

import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Container, SectionHeading } from "@/components/section-heading";
import { visibleTestimonials } from "@/content/testimonials";

export function Testimonials() {
  const testimonials = visibleTestimonials();
  // Production with only drafts: the section simply isn't rendered.
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="border-y border-border bg-surface/30 py-20 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading id="testimonials-title" eyebrow="06 · testimonials" title="What teammates say." />
        <Stagger as="ul" step={0.12} className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <StaggerItem as="li" key={testimonial.quote}>
              <figure className="glow-card relative flex h-full flex-col gap-5 rounded-xl border border-t-2 border-border border-t-primary bg-surface p-6">
                {testimonial.draft ? (
                  <span className="absolute top-3 right-3 rounded border border-syntax-literal/40 bg-syntax-literal/10 px-1.5 py-0.5 font-mono text-[0.6rem] text-syntax-literal">
                    DRAFT · hidden in production
                  </span>
                ) : null}
                <Quote aria-hidden="true" className="size-6 text-primary/70" />
                <blockquote className="flex-1 leading-relaxed text-foreground/90">“{testimonial.quote}”</blockquote>
                <figcaption className="flex flex-col gap-0.5 border-t border-border pt-4">
                  <span className="font-semibold">{testimonial.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{testimonial.role}</span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
