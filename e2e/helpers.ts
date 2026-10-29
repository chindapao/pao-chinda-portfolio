import type { Page } from "@playwright/test";

/** Scrolls through the page so every scroll-triggered reveal has run (axe must see final colours, not opacity 0). */
export async function revealAll(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
}

/** True when the page is wider than the viewport (sideways scrolling on phones). */
export function hasHorizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
}
