"use client";

import { domAnimation, LazyMotion, MotionConfig } from "motion/react";

/**
 * Site-wide client context, kept deliberately small: it ships with every page.
 * - LazyMotion + `domAnimation` loads only the DOM animation features we use; `strict` makes a stray full `motion.*`
 *   component an error (use `m.*`).
 * - `reducedMotion="user"`: with the OS "reduce motion" setting, transforms are dropped and opacity fades stay.
 * Only the interactive pieces (mobile menu, terminal) use Motion; scroll reveals are CSS + one observer (RevealObserver).
 * Data fetching (TanStack Query) and toasts live with the contact form, the only place that needs them.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
