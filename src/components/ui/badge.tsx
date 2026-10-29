import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

/** Mono tags: categories, tech chips, status. */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border font-mono text-[0.72rem] leading-none font-medium tracking-wide whitespace-nowrap [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "border-primary/30 bg-primary/10 px-2 py-1 text-primary",
        neutral: "border-border bg-surface-raised px-2 py-1 text-muted-foreground",
        outline: "border-border-strong px-2 py-1 text-foreground",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}
