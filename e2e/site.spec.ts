import { expect, test } from "@playwright/test";

test.describe("navigation", () => {
  test("home shows who, what and how to hire", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Building apps people actually use/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("link", { name: /View projects/ })).toBeVisible();
  });

  test("switches to Khmer and back, keeping the page", async ({ page }) => {
    await page.goto("/en/projects/cvkh");
    await page.getByRole("link", { name: /Read this page in Khmer/ }).click();
    await expect(page).toHaveURL(/\/km\/projects\/cvkh$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "km");
    await page.getByRole("link", { name: /Read this page in English/ }).click();
    await expect(page).toHaveURL(/\/en\/projects\/cvkh$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("sends locale-less URLs to the visitor's language", async ({ page }) => {
    await page.goto("/projects");
    await expect(page).toHaveURL(/\/en\/projects$/);
  });

  test("never loops on prefetches (every request answered, none repeated)", async ({ page }) => {
    const requests = new Map<string, number>();
    const failures: string[] = [];
    page.on("response", (response) => {
      const url = response.url().replace(/^https?:\/\/[^/]+/, "");
      requests.set(url, (requests.get(url) ?? 0) + 1);
      if (response.status() >= 400) failures.push(`${response.status()} ${url}`);
    });
    await page.goto("/en");
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    });
    await page.waitForTimeout(2000);
    expect(failures).toEqual([]);
    expect(Math.max(...requests.values())).toBeLessThan(5);
  });

  test("unknown pages get a 404 in the site chrome", async ({ page }) => {
    const response = await page.goto("/km/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "404." })).toBeVisible();
  });

  test("case study shows architecture and real screenshots", async ({ page }) => {
    await page.goto("/en/projects/cvkh");
    await expect(page.getByRole("list", { name: /CVKH architecture, 4 layers/ })).toBeVisible();
    // The builder shot is both the header picture and the first gallery image.
    await expect(page.getByRole("img", { name: /CVKH builder/ })).toHaveCount(2);
    await expect(page.getByRole("img", { name: /CVKH template gallery/ })).toBeVisible();
  });
});

test.describe("terminal", () => {
  test("runs a command and shows its output", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "same component; covered on desktop");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await page.getByRole("button", { name: "$ ls projects/" }).click();
    await expect(page.getByRole("button", { name: "$ ls projects/" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("figure", { name: "Interactive terminal" })).toContainText("weloan365");
  });
});

test.describe("mobile menu", () => {
  test("opens, traps focus and closes on Escape", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "the menu button only exists on small screens");
    await page.goto("/en");
    const trigger = page.getByRole("button", { name: "Open menu" });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: /Projects/ })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});

test.describe("contact", () => {
  test("validates on the client, then submits", async ({ page }) => {
    await page.goto("/en/contact");
    const form = page.getByRole("button", { name: "Send message" });
    // Without RESEND_API_KEY / CONTACT_EMAIL at build time the page offers direct channels instead of the form.
    if ((await form.count()) === 0) {
      await expect(page.getByText("The contact form is being set up.")).toBeVisible();
      return;
    }
    await form.click();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();

    // The API is stubbed: this test checks the browser flow, not Resend.
    await page.route("**/api/contact", (route) => route.fulfill({ status: 200, json: { ok: true, message: "ok" } }));
    await page.getByLabel("name").fill("Recruiter");
    await page.getByLabel("email").fill("recruiter@example.com");
    await page.getByLabel("message").fill("We would love to talk about a senior full-stack role.");
    await form.click();
    await expect(page.getByText("Thanks — your message is in my inbox.")).toBeVisible();
  });

  test("the API re-validates and rejects cross-site posts", async ({ request }, testInfo) => {
    // Own rate-limit bucket per run (the limiter keys on the client IP; on Vercel the platform sets this header).
    const headers = { "x-real-ip": `e2e-${testInfo.project.name}-${Date.now()}` };
    const invalid = await request.post("/api/contact", { headers, data: { name: "x", email: "bad", message: "short" } });
    expect(invalid.status()).toBe(422);
    expect((await invalid.json()).fieldErrors.email).toEqual(["emailInvalid"]);
    const crossSite = await request.post("/api/contact", { headers: { ...headers, origin: "https://evil.example" }, data: {} });
    expect(crossSite.status()).toBe(403);
  });
});
