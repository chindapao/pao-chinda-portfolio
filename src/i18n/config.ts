/*
 * Locales. Every public URL carries its locale (`/en/projects`, `/km/projects`), so the URL the browser sees always
 * matches the `app/[locale]` route tree — the client router prefetches by segment and cannot follow a hidden rewrite.
 * `src/proxy.ts` sends locale-less URLs to the visitor's language.
 */
export const LOCALES = ["en", "km"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** The public URL path of `path` (always starting with "/") in `locale`. */
export function localePath(locale: Locale, path: string): string {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Splits a public pathname into its locale and the locale-less path. */
export function parsePathname(pathname: string): { locale: Locale; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (first && isLocale(first)) return { locale: first, path: `/${rest.join("/")}` };
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}

/** Picks the visitor's locale from `Accept-Language` (Khmer if it comes before English), else English. */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  const ranked = (acceptLanguage ?? "")
    .split(",")
    .map((part) => {
      const [tag = "", q = "q=1"] = part.trim().split(";");
      return { lang: tag.toLowerCase().split("-")[0] ?? "", q: Number(q.split("=")[1] ?? 1) || 0 };
    })
    .filter((entry) => entry.lang)
    .sort((a, b) => b.q - a.q);
  const match = ranked.find((entry) => isLocale(entry.lang));
  return match ? (match.lang as Locale) : DEFAULT_LOCALE;
}

/** `<html lang>` / hreflang values. */
export const HTML_LANG: Record<Locale, string> = { en: "en", km: "km" };
export const OG_LOCALE: Record<Locale, string> = { en: "en_US", km: "km_KH" };
