"use client";

import { useLayoutEffect } from "react";

const SELECTOR = "[data-reveal]:not([data-shown])";

/**
 * The single client piece behind every `Reveal`: marks `[data-reveal]` elements as shown when they scroll into view.
 * Runs before the first paint (layout effect): elements already on screen are shown at once, and only then is
 * `data-reveal-ready` set on <html> — the CSS hides unrevealed elements only after that, so nothing flashes and
 * nothing stays hidden without JavaScript. A MutationObserver picks up content that arrives later (client navigation,
 * streamed Suspense boundaries).
 */
export function RevealObserver() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const show = (el: Element) => el.setAttribute("data-shown", "");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    const track = (scope: ParentNode) => {
      for (const el of scope.querySelectorAll(SELECTOR)) {
        const { top } = el.getBoundingClientRect();
        if (top < window.innerHeight) show(el); // already visible (or scrolled past): no animation needed
        else io.observe(el);
      }
    };

    track(document);
    root.setAttribute("data-reveal-ready", "");

    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(SELECTOR)) io.observe(node);
          track(node);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
