import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Sora } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/components/providers";
import { PROFILE } from "@/content/profile";

const sora = Sora({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"], variable: "--font-sora", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

const description = `${PROFILE.role} in ${PROFILE.location}. ${PROFILE.subheading}`;

export const metadata: Metadata = {
  metadataBase: new URL(PROFILE.siteUrl),
  title: { default: `${PROFILE.name} — ${PROFILE.role}`, template: `%s · ${PROFILE.name}` },
  description,
  applicationName: `${PROFILE.name} portfolio`,
  authors: [{ name: PROFILE.name, url: PROFILE.siteUrl }],
  creator: PROFILE.name,
  keywords: ["senior full-stack developer", "Next.js", "Spring Boot", "TypeScript", "Java", "PostgreSQL", "Cambodia", "Phnom Penh", "remote"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: PROFILE.name,
    title: `${PROFILE.name} — ${PROFILE.role}`,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: `${PROFILE.name} — ${PROFILE.role}`, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

/** schema.org Person: helps search engines connect the name, role and profiles. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.name,
  jobTitle: PROFILE.role,
  url: PROFILE.siteUrl,
  address: { "@type": "PostalAddress", addressLocality: "Phnom Penh", addressCountry: "KH" },
  sameAs: Object.values(PROFILE.socials).filter(Boolean),
  knowsAbout: ["Next.js", "React", "TypeScript", "Spring Boot", "Java", "PostgreSQL", "AWS"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sora.variable} ${jetbrains.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Providers>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
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
