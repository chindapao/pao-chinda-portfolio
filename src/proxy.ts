import { type NextRequest, NextResponse } from "next/server";

import { isLocale, localePath, negotiateLocale } from "@/i18n/config";

/*
 * Locale routing. Every page lives under `app/[locale]` and every public URL carries its locale:
 *   /en/projects, /km/projects  → served as is
 *   /projects, /                → 307 to the visitor's language (Accept-Language), e.g. /en/projects
 * No rewrites: the client router prefetches by route segment and must see the real path (a hidden /en rewrite made it
 * request the wrong segment and retry in a loop).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = localePath(negotiateLocale(request.headers.get("accept-language")), pathname);
  // 307: the target depends on the visitor's language, so it must not be cached as permanent.
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Not for API routes, the OG image, Next internals, Vercel's /_vercel/* or any file with an extension.
  matcher: ["/((?!api|og|_next|_vercel|.*\\..*).*)"],
};
