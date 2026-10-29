import Image from "next/image";

import { cn } from "@/lib/utils";
import type { MockupKind, Project } from "@/types";

/*
 * When a project has a screenshot it is shown with next/image; otherwise an abstract dark UI is drawn in CSS — no
 * network request, no layout shift (fixed aspect ratio), and it never goes stale or leaks client data.
 */

function Bar({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("block h-2 rounded-full bg-border-strong", className)} />;
}

function Body({ kind }: { kind: MockupKind }) {
  switch (kind) {
    case "builder":
      return (
        <div className="grid h-full grid-cols-[1fr_1.3fr] gap-3">
          <div className="flex flex-col gap-2 rounded-md bg-surface-raised p-2.5">
            <Bar className="w-2/3 bg-primary/60" />
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className="block h-5 rounded border border-border bg-background/60" />
            ))}
          </div>
          <div className="flex flex-col gap-1.5 rounded-sm bg-foreground/95 p-3">
            <span className="block h-3 w-1/2 rounded-sm bg-background/80" />
            <span className="block h-1.5 w-1/3 rounded-sm bg-primary-dark" />
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i} className={cn("block h-1 rounded-sm bg-background/25", i % 3 === 2 ? "w-2/3" : "w-full")} />
            ))}
          </div>
        </div>
      );
    case "ledger":
      return (
        <div className="flex h-full flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            {["USD", "KHR", "PAR"].map((label, i) => (
              <div key={label} className="rounded-md bg-surface-raised p-2">
                <span className="block font-mono text-[0.55rem] text-muted-foreground">{label}</span>
                <span className={cn("mt-1 block h-2.5 rounded-full", i === 2 ? "w-1/2 bg-syntax-literal/70" : "w-3/4 bg-primary/70")} />
              </div>
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-1.5 rounded-md bg-surface-raised p-2.5">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                <Bar className="w-3/4" />
                <span className="block h-2 w-8 rounded-full bg-primary/50" />
                <span className="block h-2 w-8 rounded-full bg-syntax-property/40" />
              </div>
            ))}
          </div>
        </div>
      );
    case "assistant":
      return (
        <div className="flex h-full flex-col gap-2">
          <div className="ml-auto w-2/3 rounded-lg rounded-br-sm bg-primary/20 p-2">
            <Bar className="w-full bg-primary/60" />
          </div>
          <div className="w-4/5 rounded-lg rounded-bl-sm bg-surface-raised p-2.5">
            {Array.from({ length: 4 }, (_, i) => (
              <Bar key={i} className={cn("mt-1.5 first:mt-0", i === 3 ? "w-1/2" : "w-full")} />
            ))}
          </div>
          <div className="mt-auto flex items-center gap-2 rounded-md border border-syntax-literal/40 bg-syntax-literal/10 px-2 py-1.5">
            <span className="font-mono text-[0.55rem] text-syntax-literal">AI DRAFT · awaiting approval</span>
          </div>
        </div>
      );
    case "booking":
      return (
        <div className="grid h-full grid-cols-8 content-center gap-1.5 p-1">
          {Array.from({ length: 40 }, (_, i) => (
            <span
              key={i}
              className={cn(
                "aspect-square rounded-sm",
                [3, 4, 11, 12, 19, 26, 27, 33].includes(i) ? "bg-primary/70" : [6, 14, 22].includes(i) ? "bg-syntax-literal/70" : "bg-surface-raised",
              )}
            />
          ))}
        </div>
      );
    case "player":
      return (
        <div className="flex h-full flex-col justify-end gap-3">
          <div className="flex h-16 items-end gap-1">
            {[40, 70, 55, 90, 65, 80, 45, 95, 60, 75, 50, 85, 35, 70, 55, 65].map((h, i) => (
              <span key={i} className="flex-1 rounded-t-sm bg-primary/60" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-primary" />
            <span className="h-1.5 flex-1 rounded-full bg-border-strong">
              <span className="block h-full w-2/5 rounded-full bg-primary" />
            </span>
          </div>
        </div>
      );
    case "speech":
      return (
        <div className="flex h-full flex-col gap-3">
          <div className="rounded-md bg-surface-raised p-2.5">
            <Bar className="w-full" />
            <Bar className="mt-1.5 w-4/5" />
          </div>
          <div className="flex flex-1 items-center gap-[3px]">
            {Array.from({ length: 36 }, (_, i) => (
              <span key={i} className="w-full rounded-full bg-syntax-property/60" style={{ height: `${20 + ((i * 37) % 70)}%` }} />
            ))}
          </div>
        </div>
      );
    case "learning":
      return (
        <div className="grid h-full grid-cols-2 gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex flex-col gap-1.5 rounded-md bg-surface-raised p-2">
              <span className="block h-6 rounded bg-background/70" />
              <Bar className="w-3/4" />
              <span className="block h-1 rounded-full bg-border">
                <span className="block h-full rounded-full bg-primary" style={{ width: `${30 + i * 20}%` }} />
              </span>
            </div>
          ))}
        </div>
      );
  }
}

export function ProjectMockup({ project, className, priority = false }: { project: Project; className?: string; priority?: boolean }) {
  const shot = project.screenshots?.[0];
  return (
    <div
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border bg-background shadow-[0_20px_60px_-30px_hsl(var(--primary)/0.4)]",
        className,
      )}
    >
      <div className="flex h-7 items-center gap-1.5 border-b border-border bg-surface-raised px-3">
        <span className="size-2 rounded-full bg-muted/60" />
        <span className="size-2 rounded-full bg-muted/60" />
        <span className="size-2 rounded-full bg-primary/70" />
        <span className="ml-3 truncate font-mono text-[0.7rem] text-muted-foreground">{project.slug}.app</span>
      </div>
      {shot ? (
        <Image
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          priority={priority}
          sizes="(min-width: 1024px) 560px, 100vw"
          className="h-[calc(100%-1.75rem)] w-full object-cover object-top"
        />
      ) : (
        <div aria-hidden="true" className="h-[calc(100%-1.75rem)] bg-surface p-3 sm:p-4">
          <Body kind={project.mockup} />
        </div>
      )}
    </div>
  );
}
