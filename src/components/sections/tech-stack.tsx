import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Container, SectionHeading } from "@/components/section-heading";
import { StackMatrix } from "@/components/sections/stack-matrix";
import { STACK, STACK_CATEGORIES } from "@/content/stack";

export function TechStack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="py-20 sm:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          id="stack-title"
          eyebrow="03 · stack"
          title="Tools I reach for — and where I used them."
          lede="Grouped by layer, then mapped against every project, so you can see depth, not just a logo wall."
        />

        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-2">
          {STACK_CATEGORIES.map((category) => (
            <div key={category.id} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="font-mono text-sm font-medium text-primary">{category.label.toLowerCase()}/</h3>
                <p className="text-sm text-muted-foreground">{category.blurb}</p>
              </div>
              <Stagger as="ul" step={0.05} className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {STACK.filter((tech) => tech.category === category.id).map(({ id, name, note, icon: Icon }) => (
                  <StaggerItem as="li" key={id}>
                    <div className="glow-card flex h-full flex-col gap-2 rounded-lg border border-border bg-surface p-3 hover:-translate-y-0.5">
                      <span className="flex size-8 items-center justify-center rounded-md border border-border bg-surface-raised text-primary">
                        <Icon aria-hidden="true" className="size-4" />
                      </span>
                      <span className="text-sm font-semibold">{name}</span>
                      <span className="font-mono text-[0.68rem] leading-snug text-muted-foreground">{note}</span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          ))}
        </div>

        <StackMatrix />
      </Container>
    </section>
  );
}
