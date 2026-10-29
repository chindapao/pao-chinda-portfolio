import "../globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Kantumruy_Pro, Sora } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { Providers } from "@/components/providers";
import { getProfile } from "@/content";
import { format, getMessages, HTML_LANG, LOCALES, OG_LOCALE } from "@/i18n";
import { I18nProvider } from "@/i18n/client";
import { alternates, localeOf } from "@/lib/seo";

// All three are variable fonts: one file per family covers every weight (listing weights would download one file each).
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
// Sora has no Khmer glyphs: the browser falls through to Kantumruy Pro for Khmer text only (unicode-range). Not preloaded,
// so English pages never download it.
const kantumruy = Kantumruy_Pro({ subsets: ["khmer"], variable: "--font-kantumruy", display: "swap", preload: false });

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const locale = await localeOf(params);
  const profile = getProfile(locale);
  const m = getMessages(locale);
  const title = `${profile.name} — ${profile.role}`;
  const description = format(m.meta.siteDescription, { role: profile.role, location: profile.location, subheading: profile.subheading });
  return {
    metadataBase: new URL(profile.siteUrl),
    title: { default: title, template: `%s · ${profile.name}` },
    description,
    applicationName: `${profile.name} portfolio`,
    authors: [{ name: profile.name, url: profile.siteUrl }],
    creator: profile.name,
    keywords: ["senior full-stack developer", "Next.js", "Spring Boot", "TypeScript", "Java", "PostgreSQL", "Cambodia", "Phnom Penh", "remote"],
    alternates: alternates(locale, "/"),
    icons: { icon: "/icon.svg" },
    openGraph: {
      type: "website",
      siteName: profile.name,
      title,
      description,
      locale: OG_LOCALE[locale],
      images: [{ url: "/og", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og"] },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = await localeOf(params);
  const profile = getProfile(locale);
  const m = getMessages(locale);

  /** schema.org Person: helps search engines connect the name, role and profiles. */
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    url: profile.siteUrl,
    address: { "@type": "PostalAddress", addressLocality: "Phnom Penh", addressCountry: "KH" },
    sameAs: Object.values(profile.socials).filter(Boolean),
    knowsAbout: ["Next.js", "React", "TypeScript", "Spring Boot", "Java", "PostgreSQL", "AWS"],
  };

  return (
    <html lang={HTML_LANG[locale]} className={`${sora.variable} ${jetbrains.variable} ${kantumruy.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {m.nav.skip}
        </a>
        <I18nProvider locale={locale} messages={m}>
          <Providers>
            <Navbar />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer locale={locale} />
            <RevealObserver />
          </Providers>
        </I18nProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        {/* Their scripts are served by Vercel at /_vercel/*; elsewhere (local `next start`) they would 404. */}
        {process.env.VERCEL ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
