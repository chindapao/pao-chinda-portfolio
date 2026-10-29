import Link from "next/link";

import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";
import { Container } from "@/components/section-heading";
import { COPYRIGHT_YEAR, NAV_LINKS, PROFILE } from "@/content/profile";
import { cn, focusRing } from "@/lib/utils";

const SOCIALS = [
  { href: PROFILE.socials.github, label: "GitHub", Icon: GitHubIcon },
  { href: PROFILE.socials.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: PROFILE.socials.x, label: "X (Twitter)", Icon: XIcon },
].filter((social): social is typeof social & { href: string } => Boolean(social.href));

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40 print:hidden">
      <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-bold tracking-tight">{PROFILE.name}</p>
          <p className="text-sm text-muted-foreground">
            {PROFILE.role} · {PROFILE.location}
          </p>
          <ul className="mt-2 flex gap-2">
            {SOCIALS.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (opens in a new tab)`}
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
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {[...NAV_LINKS, { href: "/cv", label: "CV" } as const].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={cn("rounded transition-colors hover:text-foreground", focusRing)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="font-mono text-xs text-muted-foreground">
            © {COPYRIGHT_YEAR} {PROFILE.name.toLowerCase().replace(" ", "-")} · built with Next.js, deployed on Vercel
          </p>
        </div>
      </Container>
    </footer>
  );
}
