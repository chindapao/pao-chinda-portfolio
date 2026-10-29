import type * as React from "react";

import { cn } from "@/lib/utils";

import { fieldStyles } from "./input";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn(fieldStyles, "min-h-36 resize-y py-3", className)} {...props} />;
}
