import { ArrowDown } from "lucide-react";
import { Fragment } from "react";

import { cn } from "@/lib/utils";
import type { ArchLayer, Architecture } from "@/types";

/*
 * Architecture as data → diagram, readable as plain text by screen readers (a labelled list of layers).
 *  - compact (project cards): a vertical pipeline — one row per layer, nodes as wrapping chips. Fits any width.
 *  - full (case study): layers stacked top to bottom, nodes in an auto-fit grid. (Side-by-side columns were tried:
 *    the case-study column is at most ~750 px wide, so four columns always squeezed the labels.)
 */

const TONE: Record<ArchLayer["tone"], { dot: string; ring: string; label: string }> = {
  client: { dot: "bg-syntax-property", ring: "border-syntax-property/30", label: "text-syntax-property" },
  edge: { dot: "bg-syntax-keyword", ring: "border-syntax-keyword/30", label: "text-syntax-keyword" },
  service: { dot: "bg-primary", ring: "border-primary/35", label: "text-primary" },
  worker: { dot: "bg-syntax-literal", ring: "border-syntax-literal/30", label: "text-syntax-literal" },
  data: { dot: "bg-syntax-string", ring: "border-syntax-string/30", label: "text-syntax-string" },
  external: { dot: "bg-muted-foreground", ring: "border-border-strong", label: "text-muted-foreground" },
};

function LayerLabel({ layer }: { layer: ArchLayer }) {
  const tone = TONE[layer.tone];
  return (
    <p className={cn("flex items-center gap-1.5 font-mono text-[0.7rem] font-medium tracking-widest uppercase", tone.label)}>
      <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", tone.dot)} />
      {layer.label}
    </p>
  );
}

export function ArchitectureDiagram({
  architecture,
  label,
  compact = false,
}: {
  architecture: Architecture;
  /** Accessible name of the diagram, e.g. "CVKH architecture, 4 layers". */
  label: string;
  /** Card size: a vertical pipeline of chips, no notes. */
  compact?: boolean;
}) {
  const { layers, notes } = architecture;

  if (compact) {
    return (
      <ol aria-label={label} className="flex flex-col">
        {layers.map((layer, index) => (
          <li key={layer.label} className="flex flex-col">
            {index > 0 ? <ArrowDown aria-hidden="true" className="my-1 ml-[0.2rem] size-3.5 text-muted" /> : null}
            <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-3">
              <div className="pt-1">
                <LayerLabel layer={layer} />
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {layer.nodes.map((node) => (
                  <li
                    key={node.label}
                    className={cn("rounded-md border border-dashed bg-surface-raised px-2 py-1 text-xs font-medium", TONE[layer.tone].ring)}
                  >
                    {node.label}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <figure className="flex flex-col gap-5">
      <div role="list" aria-label={label} className="flex flex-col items-stretch gap-2">
        {layers.map((layer, index) => (
          <Fragment key={layer.label}>
            {index > 0 ? (
              <span aria-hidden="true" className="flex justify-center text-muted">
                <ArrowDown className="size-4" />
              </span>
            ) : null}
            <div
              role="listitem"
              className={cn("flex min-w-0 flex-1 flex-col gap-2 rounded-lg border border-dashed bg-background/60 p-3", TONE[layer.tone].ring)}
            >
              <LayerLabel layer={layer} />
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))] gap-1.5">
                {layer.nodes.map((node) => (
                  <li key={node.label} className="min-w-0 rounded-md border border-border bg-surface-raised px-2.5 py-2">
                    <span className="block text-sm font-medium [overflow-wrap:anywhere] text-foreground">{node.label}</span>
                    {node.detail ? (
                      <span className="block font-mono text-[0.7rem] [overflow-wrap:anywhere] text-muted-foreground">{node.detail}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </Fragment>
        ))}
      </div>
      {notes.length ? (
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
