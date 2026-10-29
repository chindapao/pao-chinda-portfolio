import type * as React from "react";

/*
 * Scroll-triggered fade-up, without shipping a client component per element: these are server components that only
 * mark elements with `data-reveal`; one <RevealObserver> (IntersectionObserver) per page flips `data-shown`, and the
 * CSS in globals.css animates it. Children of a `Stagger` get nth-child delays.
 *
 * Content is never hidden before the observer is ready (and so never hidden without JavaScript), and the global
 * reduced-motion rule turns the transition off.
 */

type Tag = "div" | "section" | "ul" | "ol" | "li" | "article" | "header";

interface RevealProps {
  as?: Tag;
  className?: string;
  children: React.ReactNode;
}

/** One element that fades up when it scrolls into view. `delay` in seconds. */
export function Reveal({ as: Component = "div", delay = 0, className, children }: RevealProps & { delay?: number }) {
  return (
    <Component data-reveal="" className={className} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </Component>
  );
}

/** A container whose `StaggerItem` children fade up one after another. */
export function Stagger({ as: Component = "div", className, children }: RevealProps) {
  return (
    <Component data-stagger="" className={className}>
      {children}
    </Component>
  );
}

export function StaggerItem({ as: Component = "div", className, children }: RevealProps) {
  return (
    <Component data-reveal="" className={className}>
      {children}
    </Component>
  );
}
