import type * as React from "react";

import { cn } from "@/lib/utils";

/** Surface card. `glow` adds the green hover / focus-within glow used across the site. */
export function Card({ className, glow = false, ...props }: React.ComponentProps<"div"> & { glow?: boolean }) {
  return (
    <div
      data-slot="card"
      className={cn("rounded-xl border border-border bg-surface", glow && "glow-card", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 p-5 sm:p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn("text-lg font-semibold tracking-tight", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-5 pb-5 sm:px-6 sm:pb-6", className)} {...props} />;
}
