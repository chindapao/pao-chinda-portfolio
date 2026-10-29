import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { PROJECTS } from "@/content/projects";
import { STACK, STACK_CATEGORIES } from "@/content/stack";
import { cn, focusRing } from "@/lib/utils";

/**
 * Tech × project matrix. A real `<table>` (row and column headers) so screen readers announce "Spring Boot, CVKH, used".
 * On narrow screens the table scrolls inside its own focusable region; the page itself never scrolls sideways.
 */
export function StackMatrix() {
  const usage = new Map(STACK.map((tech) => [tech.id, PROJECTS.filter((p) => p.stack.includes(tech.id)).length]));

  return (
    <Reveal className="flex w-full min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-xl font-bold sm:text-2xl">Tech-stack matrix</h3>
        <p className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2.5 rounded-sm bg-primary" /> used in project
          </span>
          <span>scroll → on small screens</span>
        </p>
      </div>

      <div
        role="region"
        aria-labelledby="matrix-caption"
        tabIndex={0}
        // `relative`: contains the sr-only cell labels (absolutely positioned), which would otherwise widen the page.
        className={cn("relative overflow-x-auto rounded-xl border border-border bg-surface", focusRing)}
      >
        <table className="w-full min-w-[46rem] border-collapse text-sm">
          <caption id="matrix-caption" className="sr-only">
            Technologies used in each project
          </caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="sticky left-0 z-10 bg-surface px-4 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
                tech \ project
              </th>
              {PROJECTS.map((project) => (
                <th key={project.slug} scope="col" className="px-2 py-3 text-center font-medium">
                  <Link href={`/projects/${project.slug}`} className={cn("rounded text-xs whitespace-nowrap transition-colors hover:text-primary", focusRing)}>
                    {project.name}
                  </Link>
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-right font-mono text-xs font-medium text-muted-foreground">
                depth
              </th>
            </tr>
          </thead>
          {STACK_CATEGORIES.map((category) => (
            <tbody key={category.id}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={PROJECTS.length + 2}
                  className="bg-surface-raised/60 px-4 py-1.5 text-left font-mono text-[0.68rem] font-medium tracking-widest text-primary uppercase"
                >
                  {category.label}
                </th>
              </tr>
              {STACK.filter((tech) => tech.category === category.id).map((tech) => {
                const count = usage.get(tech.id) ?? 0;
                return (
                  <tr key={tech.id} className="border-t border-border/60 transition-colors hover:bg-surface-raised/50">
                    <th scope="row" className="sticky left-0 z-10 bg-surface px-4 py-2 text-left font-medium whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        <tech.icon aria-hidden="true" className="size-3.5 text-muted-foreground" />
                        {tech.name}
                      </span>
                    </th>
                    {PROJECTS.map((project) => {
                      const used = project.stack.includes(tech.id);
                      return (
                        <td key={project.slug} className="px-2 py-2 text-center">
                          <span
                            aria-hidden="true"
                            className={cn(
                              "mx-auto block size-3 rounded-sm",
                              used ? "bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)]" : "border border-border",
                            )}
                          />
                          <span className="sr-only">{used ? "used" : "not used"}</span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-2 text-right font-mono text-xs text-muted-foreground">
                      {count}/{PROJECTS.length}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          ))}
        </table>
      </div>
    </Reveal>
  );
}
