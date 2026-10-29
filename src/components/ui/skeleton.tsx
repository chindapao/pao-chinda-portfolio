import type * as React from "react";

import { cn } from "@/lib/utils";

/** Loading placeholder; sized by the caller to match the real content so nothing shifts when it arrives. */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-md bg-surface-raised", className)} {...props} />;
}
