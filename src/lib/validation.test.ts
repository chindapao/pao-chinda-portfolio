import { describe, expect, it } from "vitest";

import { contactSchema, escapeHtml, fieldErrorsOf } from "./validation";

const valid = { name: "Sokha", email: "sokha@example.com", message: "We are hiring a senior full-stack developer." };

describe("contactSchema", () => {
  it("accepts a complete message and trims it", () => {
    const parsed = contactSchema.parse({ ...valid, name: "  Sokha  " });
    expect(parsed.name).toBe("Sokha");
  });

  it.each([
    ["name", { ...valid, name: "S" }],
    ["email", { ...valid, email: "not-an-email" }],
    ["message", { ...valid, message: "too short" }],
    ["message", { ...valid, message: "x".repeat(4001) }],
  ] as const)("rejects an invalid %s with a field error", (field, input) => {
    const result = contactSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) expect(fieldErrorsOf(result.error)[field]?.length).toBeGreaterThan(0);
  });

  it("accepts a filled honeypot so bots get no validation hint (the route drops it)", () => {
    expect(contactSchema.parse({ ...valid, company: "ACME" }).company).toBe("ACME");
  });
});

describe("escapeHtml", () => {
  it("neutralises markup in user text", () => {
    expect(escapeHtml(`<img src=x onerror="alert('x')">&`)).toBe("&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;&amp;");
  });
});
