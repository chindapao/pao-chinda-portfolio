import { expect, type Page, test } from "@playwright/test";

import { revealAll } from "./helpers";

/*
 * Responsive layout audit (the CVKH process): a matrix of widths × pages, each checked for the problems that break
 * layouts on real devices. Runs once (desktop project): the viewport width is what matters here.
 */
const WIDTHS = [320, 375, 768, 1024, 1440, 2560];
const PAGES = ["/en", "/km", "/en/projects", "/en/projects/cvkh", "/km/projects/weloan365", "/en/contact"];

/** Every layout problem on the page, as readable strings (empty = clean). */
function auditLayout(page: Page) {
  return page.evaluate(() => {
    const issues: string[] = [];
    const vw = window.innerWidth;
    const describe = (el: Element) =>
      `<${el.tagName.toLowerCase()}> "${((el as HTMLElement).innerText || el.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 40)}"`;
    const insideScroller = (el: Element) => {
      for (let a = el.parentElement; a; a = a.parentElement) {
        const overflow = getComputedStyle(a).overflowX;
        if (overflow === "auto" || overflow === "scroll") return true;
      }
      return false;
    };
    const clippedByAncestor = (el: Element) => {
      for (let a = el.parentElement; a; a = a.parentElement) {
        const overflow = getComputedStyle(a).overflowX;
        if ((overflow === "hidden" || overflow === "clip") && a.getBoundingClientRect().right <= vw + 1) return true;
      }
      return false;
    };

    if (document.documentElement.scrollWidth > vw + 1) issues.push(`page scrolls sideways (${document.documentElement.scrollWidth}px)`);

    for (const el of document.querySelectorAll("header *, main *, footer *")) {
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden" || el.closest("[aria-hidden=true], .sr-only")) continue;
      const box = el.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) continue;
      const leaf = el.children.length === 0 && Boolean(el.textContent?.trim());

      if ((box.right > vw + 1 || box.left < -1) && style.position !== "fixed" && !insideScroller(el) && !clippedByAncestor(el)) {
        issues.push(`escapes the viewport: ${describe(el)}`);
      }
      if (leaf && style.overflowX === "visible" && style.whiteSpace !== "nowrap" && style.display !== "inline" && el.scrollWidth > el.clientWidth + 2 && !insideScroller(el)) {
        issues.push(`text overflows its box: ${describe(el)}`);
      }
      if (leaf && parseFloat(style.fontSize) < 11 && style.position !== "absolute") {
        issues.push(`text below 11px (${style.fontSize}): ${describe(el)}`);
      }
      // WCAG 2.5.8 target size (24×24). A stretched link (its ::after covers the card) is as big as the card.
      const stretched = getComputedStyle(el, "::after").position === "absolute";
      if ((el.tagName === "A" || el.tagName === "BUTTON") && style.display !== "inline" && !stretched && (box.width < 24 || box.height < 24)) {
        issues.push(`tap target ${Math.round(box.width)}×${Math.round(box.height)}: ${describe(el)}`);
      }
    }

    // The navbar stays one tidy row: no wrapped name, no overlapping items.
    const name = document.querySelector("header nav > a span");
    if (name && name.getClientRects().length > 1) issues.push("navbar name wraps");
    const items = [...document.querySelectorAll("header nav > *")].map((n) => n.getBoundingClientRect()).filter((r) => r.width > 0);
    for (let i = 1; i < items.length; i++) if (items[i]!.left < items[i - 1]!.right - 1) issues.push("navbar items overlap");

    return [...new Set(issues)];
  });
}

test.describe("responsive layout", () => {
  for (const width of WIDTHS) {
    test(`${width}px: no overflow, readable text, usable targets`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "desktop", "viewport-driven: runs once, in the desktop project");
      await page.setViewportSize({ width, height: width >= 1920 ? 1080 : 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      for (const path of PAGES) {
        await page.goto(path);
        await revealAll(page);
        expect(await auditLayout(page), `${path} at ${width}px`).toEqual([]);
      }
    });
  }
});
