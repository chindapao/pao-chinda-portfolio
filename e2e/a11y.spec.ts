import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { hasHorizontalOverflow, revealAll } from "./helpers";

/* Every page, in both languages, on desktop and a 360 px phone: no WCAG 2.1 AA violations, no sideways scroll. */
const PAGES = ["/en", "/en/projects", "/en/projects/cvkh", "/en/about", "/en/contact", "/en/cv", "/km", "/km/projects/rodthabal", "/km/contact", "/en/nope"];

for (const path of PAGES) {
  test(`${path} has no accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await revealAll(page);
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });
}
