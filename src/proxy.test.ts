import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { localePath, negotiateLocale, parsePathname } from "./i18n/config";
import { proxy } from "./proxy";

const run = (path: string, acceptLanguage?: string) =>
  proxy(new NextRequest(`https://pchinda.vercel.app${path}`, acceptLanguage ? { headers: { "accept-language": acceptLanguage } } : {}));

describe("proxy", () => {
  it("serves locale-prefixed URLs as is (no rewrite, no redirect)", () => {
    for (const path of ["/en", "/en/projects/cvkh", "/km", "/km/cv"]) {
      const response = run(path);
      expect(response.headers.get("location"), path).toBeNull();
      expect(response.headers.get("x-middleware-rewrite"), path).toBeNull();
    }
  });

  it("sends locale-less URLs to English by default, temporarily", () => {
    const home = run("/");
    expect(home.status).toBe(307);
    expect(home.headers.get("location")).toBe("https://pchinda.vercel.app/en");
    expect(run("/projects/cvkh").headers.get("location")).toBe("https://pchinda.vercel.app/en/projects/cvkh");
  });

  it("sends Khmer browsers to Khmer", () => {
    expect(run("/contact", "km-KH,km;q=0.9,en;q=0.8").headers.get("location")).toBe("https://pchinda.vercel.app/km/contact");
    expect(run("/contact", "en-US,en;q=0.9,km;q=0.5").headers.get("location")).toBe("https://pchinda.vercel.app/en/contact");
  });
});

describe("locale paths", () => {
  it("builds and parses public paths", () => {
    expect(localePath("en", "/")).toBe("/en");
    expect(localePath("en", "/projects")).toBe("/en/projects");
    expect(localePath("km", "/cv")).toBe("/km/cv");
    expect(parsePathname("/km/projects/cvkh")).toEqual({ locale: "km", path: "/projects/cvkh" });
    expect(parsePathname("/en")).toEqual({ locale: "en", path: "/" });
  });

  it("negotiates the language", () => {
    expect(negotiateLocale(null)).toBe("en");
    expect(negotiateLocale("fr-FR,fr;q=0.9")).toBe("en");
    expect(negotiateLocale("km")).toBe("km");
    expect(negotiateLocale("fr;q=0.9,km;q=0.8,en;q=0.7")).toBe("km");
  });
});
