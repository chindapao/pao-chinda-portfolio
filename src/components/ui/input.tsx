import type * as React from "react";

import { cn } from "@/lib/utils";

export const fieldStyles =
  "w-full rounded-lg border border-border-strong bg-surface px-3.5 text-base text-foreground transition-colors placeholder:text-muted-foreground/70 outline-none hover:border-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 aria-invalid:border-danger aria-invalid:ring-danger/25 disabled:opacity-50 sm:text-sm";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input data-slot="input" className={cn(fieldStyles, "h-11", className)} {...props} />;
}
