import Link from "next/link";

import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";
import { Container } from "@/components/section-heading";
import { getProfile } from "@/content";
import { COPYRIGHT_YEAR, NAV_LINKS } from "@/content/profile";
import { getMessages, type Locale, localePath } from "@/i18n";
import { cn, focusRing } from "@/lib/utils";

export function Footer({ locale }: { locale: Locale }) {
  const profile = getProfile(locale);
  const m = getMessages(locale);
  const socials = [
    { href: profile.socials.github, label: "GitHub", Icon: GitHubIcon },
    { href: profile.socials.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: profile.socials.x, label: "X (Twitter)", Icon: XIcon },
  ].filter((social): social is typeof social & { href: string } => Boolean(social.href));
  const links = [
    ...NAV_LINKS.map((link) => ({
      href: "hash" in link ? `${localePath(locale, link.path)}#${link.hash}` : localePath(locale, link.path),
      label: m.nav[link.label],
    })),
    { href: localePath(locale, "/cv"), label: m.nav.cv },
  ];

  return (
    <footer className="border-t border-border bg-surface/40 print:hidden">
      <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-bold tracking-tight">{profile.name}</p>
          <p className="text-sm text-muted-foreground">
            {profile.role} · {profile.location}
          </p>
          <ul className="mt-2 flex gap-2">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} ${m.footer.newTab}`}
                  title={label}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary",
                    focusRing,
                  )}
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <nav aria-label={m.footer.nav}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={cn("rounded transition-colors hover:text-foreground", focusRing)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="font-mono text-xs text-muted-foreground">
            © {COPYRIGHT_YEAR} pao-chinda · {m.footer.builtWith}
          </p>
        </div>
      </Container>
    </footer>
  );
}
