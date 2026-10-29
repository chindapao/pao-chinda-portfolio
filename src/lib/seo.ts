import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, type Locale, localePath, LOCALES } from "@/i18n/config";

/** The `[locale]` param, validated (anything else is a 404). */
export async function localeOf(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

/** Canonical URL for this locale plus hreflang alternates for every locale (x-default: the locale-less URL, which
 * the proxy sends to the visitor's language). */
export function alternates(locale: Locale, path: string): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, localePath(l, path)])),
      "x-default": path,
    },
  };
}
