import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { getStackCategories } from "@/content";
import { PROJECTS } from "@/content/projects";
import { STACK } from "@/content/stack";
import { getMessages, type Locale, localePath } from "@/i18n";
import { cn, focusRing } from "@/lib/utils";

/**
 * Tech × project matrix. A real `<table>` (row and column headers) so screen readers announce "Spring Boot, CVKH, used".
 * On narrow screens the table scrolls inside its own focusable region; the page itself never scrolls sideways.
 */
export function StackMatrix({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const usage = new Map(STACK.map((tech) => [tech.id, PROJECTS.filter((p) => p.stack.includes(tech.id)).length]));

  return (
    <Reveal className="flex w-full min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-xl font-bold sm:text-2xl">{m.stack.matrixTitle}</h3>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2.5 rounded-sm bg-primary" /> {m.stack.used}
          </span>
          <span>{m.stack.scrollHint}</span>
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
            {m.stack.caption}
          </caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="sticky left-0 z-10 bg-surface px-4 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
                {m.stack.corner}
              </th>
              {PROJECTS.map((project) => (
                <th key={project.slug} scope="col" className="px-2 py-3 text-center font-medium">
                  <Link
                    href={localePath(locale, `/projects/${project.slug}`)}
                    className={cn("rounded text-xs whitespace-nowrap transition-colors hover:text-primary", focusRing)}
                  >
                    {project.name}
                  </Link>
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-right font-mono text-xs font-medium text-muted-foreground">
                {m.stack.depth}
              </th>
            </tr>
          </thead>
          {getStackCategories(locale).map((category) => (
            <tbody key={category.id}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={PROJECTS.length + 2}
                  className="bg-surface-raised/60 px-4 py-1.5 text-left font-mono text-[0.7rem] font-medium tracking-widest text-primary uppercase"
                >
                  {category.label}
                </th>
              </tr>
              {STACK.filter((tech) => tech.category === category.id).map((tech) => {
                const count = usage.get(tech.id) ?? 0;
                return (
                  <tr key={tech.id} className="border-t border-border/60 transition-colors hover:bg-surface-raised/50">
                    <th scope="row" className="sticky left-0 z-10 bg-surface px-4 py-2 text-left font-medium whitespace-nowrap">
                      {tech.name}
                    </th>
                    {PROJECTS.map((project) => {
                      const used = project.stack.includes(tech.id);
                      return (
                        // One node per cell, styled by `.matrix-cell` (globals.css): 175 cells × a long class list was the
                        // single biggest chunk of the page's HTML.
                        <td key={project.slug} className="matrix-cell" data-used={used || undefined}>
                          <span className="sr-only">{used ? m.stack.usedSr : m.stack.notUsedSr}</span>
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
