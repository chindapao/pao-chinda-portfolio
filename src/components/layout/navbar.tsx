"use client";

import { ArrowRight, Languages, Menu, X } from "lucide-react";
import { AnimatePresence, m as motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { NAV_LINKS, PROFILE } from "@/content/profile";
import { localePath, parsePathname } from "@/i18n/config";
import { useI18n } from "@/i18n/client";
import { cn, focusRing } from "@/lib/utils";

export function Navbar() {
  const { locale, m, href } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { path: currentPath } = parsePathname(pathname);
  const otherLocale = locale === "en" ? "km" : "en";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = NAV_LINKS.map((link) => ({
    href: "hash" in link ? `${href(link.path)}#${link.hash}` : href(link.path),
    current: !("hash" in link) && currentPath === link.path,
    label: m.nav[link.label],
  }));

  const languageSwitch = (
    <Link
      href={localePath(otherLocale, currentPath)}
      hrefLang={otherLocale}
      lang={otherLocale}
      title={m.nav.switchLabel}
      className={cn(
        // Sans, not mono: "ខ្មែរ" needs Kantumruy at a readable size (the mono face has no Khmer glyphs).
        "inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-2.5 text-[0.8rem] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground",
        focusRing,
      )}
    >
      <Languages aria-hidden="true" className="size-3.5" />
      {/* The accessible name keeps the visible text first (WCAG 2.5.3), then explains it. */}
      {m.nav.switchToShort}
      <span className="sr-only"> — {m.nav.switchLabel}</span>
    </Link>
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 print:hidden",
        scrolled ? "border-border bg-background/80 backdrop-blur-xl" : "border-transparent bg-transparent",
      )}
    >
      <nav aria-label={m.nav.main} className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={href("/")} className={cn("group flex items-center gap-2.5 rounded-md", focusRing)}>
          <span className="text-[0.95rem] font-bold tracking-tight">{PROFILE.name}</span>
          <span className="rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[0.65rem] font-medium text-primary transition-colors group-hover:bg-primary/20">
            {PROFILE.shortRole}
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link, index) => (
            <li key={link.href} className="flex items-center">
              {index > 0 ? (
                <span aria-hidden="true" className="px-1 text-muted">
                  ·
                </span>
              ) : null}
              <Link
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground",
                  focusRing,
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {languageSwitch}
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href={href("/contact")}>
              {m.nav.hireMe} <ArrowRight aria-hidden="true" />
            </Link>
          </Button>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label={m.nav.openMenu}>
                <Menu aria-hidden="true" className="!size-5" />
              </Button>
            </Dialog.Trigger>
            <AnimatePresence>
              {open ? (
                <Dialog.Portal forceMount>
                  <Dialog.Overlay asChild forceMount>
                    <motion.div
                      className="fixed inset-0 z-50 bg-background/70 backdrop-blur-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  </Dialog.Overlay>
                  <Dialog.Content asChild forceMount aria-describedby={undefined}>
                    <motion.div
                      className="fixed inset-x-3 top-3 z-50 rounded-2xl border border-border bg-surface p-5 shadow-2xl"
                      initial={{ opacity: 0, y: -16, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.98 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="font-mono text-xs tracking-widest text-primary uppercase">
                          <span className="text-syntax-comment">{"// "}</span>
                          {m.nav.menu}
                        </Dialog.Title>
                        <Dialog.Close asChild>
                          <Button variant="ghost" size="icon" aria-label={m.nav.closeMenu}>
                            <X aria-hidden="true" className="!size-5" />
                          </Button>
                        </Dialog.Close>
                      </div>
                      <ul className="mt-2 flex flex-col">
                        {links.map((link, index) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "flex items-baseline gap-3 rounded-lg px-2 py-3 text-2xl font-bold tracking-tight transition-colors hover:text-primary",
                                focusRing,
                              )}
                            >
                              <span className="font-mono text-xs font-normal text-muted-foreground">0{index + 1}</span>
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Button asChild size="lg" className="mt-4 w-full">
                        <Link href={href("/contact")} onClick={() => setOpen(false)}>
                          {m.nav.hireMe} <ArrowRight aria-hidden="true" />
                        </Link>
                      </Button>
                    </motion.div>
                  </Dialog.Content>
                </Dialog.Portal>
              ) : null}
            </AnimatePresence>
          </Dialog.Root>
        </div>
      </nav>
    </header>
  );
}
