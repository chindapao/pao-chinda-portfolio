import { ArrowDown, ArrowRight } from "lucide-react";
import { Fragment } from "react";

import { cn } from "@/lib/utils";
import type { ArchLayer, Architecture } from "@/types";

/*
 * Architecture as data → diagram. Layers flow left-to-right on wide screens and top-to-bottom on phones, so the diagram
 * never needs horizontal scrolling and stays readable as plain text for screen readers (it is a labelled list).
 */

const TONE: Record<ArchLayer["tone"], { dot: string; ring: string; label: string }> = {
  client: { dot: "bg-syntax-property", ring: "border-syntax-property/30", label: "text-syntax-property" },
  edge: { dot: "bg-syntax-keyword", ring: "border-syntax-keyword/30", label: "text-syntax-keyword" },
  service: { dot: "bg-primary", ring: "border-primary/35", label: "text-primary" },
  worker: { dot: "bg-syntax-literal", ring: "border-syntax-literal/30", label: "text-syntax-literal" },
  data: { dot: "bg-syntax-string", ring: "border-syntax-string/30", label: "text-syntax-string" },
  external: { dot: "bg-muted-foreground", ring: "border-border-strong", label: "text-muted-foreground" },
};

export function ArchitectureDiagram({
  architecture,
  label,
  compact = false,
}: {
  architecture: Architecture;
  /** Accessible name of the diagram, e.g. "CVKH architecture, 4 layers". */
  label: string;
  /** Card size: no notes, tighter boxes. */
  compact?: boolean;
}) {
  const { layers, notes } = architecture;
  return (
    <figure className="flex flex-col gap-5">
      <div
        role="list"
        aria-label={label}
        className={cn("flex flex-col items-stretch gap-2 md:flex-row md:items-center", compact ? "md:gap-1.5" : "md:gap-2.5")}
      >
        {layers.map((layer, index) => {
          const tone = TONE[layer.tone];
          return (
            <Fragment key={layer.label}>
              {index > 0 ? (
                <span aria-hidden="true" className="flex justify-center text-muted md:px-0">
                  <ArrowDown className="size-4 md:hidden" />
                  <ArrowRight className="hidden size-4 md:block" />
                </span>
              ) : null}
              <div
                role="listitem"
                className={cn("flex min-w-0 flex-1 flex-col gap-2 rounded-lg border border-dashed bg-background/60", tone.ring, compact ? "p-2.5" : "p-3")}
              >
                <p className={cn("flex items-center gap-1.5 font-mono text-[0.65rem] font-medium tracking-widest uppercase", tone.label)}>
                  <span aria-hidden="true" className={cn("size-1.5 rounded-full", tone.dot)} />
                  {layer.label}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {layer.nodes.map((node) => (
                    <li
                      key={node.label}
                      className={cn("rounded-md border border-border bg-surface-raised", compact ? "px-2 py-1.5" : "px-2.5 py-2")}
                    >
                      <span className={cn("block font-medium text-foreground", compact ? "text-xs" : "text-sm")}>{node.label}</span>
                      {node.detail && !compact ? (
                        <span className="block font-mono text-[0.68rem] text-muted-foreground">{node.detail}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </Fragment>
          );
        })}
      </div>
      {!compact && notes.length ? (
        <figcaption>
          <ul className="grid gap-2 sm:grid-cols-2">
            {notes.map((note) => (
              <li key={note} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span aria-hidden="true" className="mt-0.5 font-mono text-primary">
                  ▸
                </span>
                {note}
              </li>
            ))}
          </ul>
        </figcaption>
      ) : null}
    </figure>
  );
}
