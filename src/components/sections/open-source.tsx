import { ArrowUpRight, FolderLock, GitFork, Star } from "lucide-react";
import { Suspense } from "react";

import { GitHubIcon } from "@/components/icons";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Container, SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PROFILE } from "@/content/profile";
import { getMessages, type Locale, type Messages } from "@/i18n";
import { getGitHubStats, LANGUAGE_COLORS } from "@/lib/github";
import { cn, focusRing, formatCount } from "@/lib/utils";

export function OpenSource({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  return (
    <section id="open-source" aria-labelledby="oss-title" className="py-20 sm:py-28 defer-render">
      <Container className="flex flex-col items-center gap-12">
        <SectionHeading id="oss-title" align="center" eyebrow={m.openSource.eyebrow} title={m.openSource.title} lede={m.openSource.lede} />
        {/* Streams in after the shell; the skeleton has the same size as the cards, so nothing shifts. */}
        <Suspense fallback={<OpenSourceSkeleton label={m.openSource.loading} />}>
          <OpenSourceContent m={m} />
        </Suspense>
      </Container>
    </section>
  );
}

async function OpenSourceContent({ m }: { m: Messages }) {
  const stats = await getGitHubStats();
  const profileButton = (
    <Button asChild variant="outline">
      <a href={PROFILE.socials.github} target="_blank" rel="noopener noreferrer">
        <GitHubIcon /> github.com/{stats?.username ?? PROFILE.socials.github.split("/").pop()}
        <ArrowUpRight aria-hidden="true" />
      </a>
    </Button>
  );

  // No data, or nothing public yet: say so plainly instead of showing a row of zeros.
  if (!stats || stats.publicRepos === 0) {
    return (
      <div className="flex w-full max-w-2xl flex-col items-center gap-6">
        <Card className="flex w-full flex-col items-center gap-3 p-8 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-surface-raised text-primary">
            <FolderLock aria-hidden="true" className="size-5" />
          </span>
          <p className="text-lg font-semibold">{m.openSource.privateTitle}</p>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{stats ? m.openSource.privateBody : m.openSource.unavailableBody}</p>
        </Card>
        {profileButton}
      </div>
    );
  }

  const cards = [
    { label: m.openSource.stars, value: formatCount(stats.stars), icon: Star },
    { label: m.openSource.repos, value: formatCount(stats.publicRepos), icon: GitFork },
    {
      label: m.openSource.contributions,
      value: stats.contributionsThisYear === null ? "—" : formatCount(stats.contributionsThisYear),
      icon: GitHubIcon,
    },
  ];

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <Stagger as="ul" className="grid w-full max-w-3xl gap-3 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <StaggerItem as="li" key={label}>
            <Card glow className="flex flex-col items-center gap-1 p-6 text-center">
              <Icon aria-hidden="true" className="mb-2 size-5 text-primary" />
              <span className="font-mono text-3xl font-medium">{value}</span>
              <span className="text-sm text-muted-foreground">{label}</span>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>

      {stats.topRepos.length ? (
        <Stagger as="ul" className="grid w-full gap-3 md:grid-cols-3">
          {stats.topRepos.map((repo) => (
            <StaggerItem as="li" key={repo.name}>
              <Card glow className="relative flex h-full flex-col gap-3 p-5">
                <a
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("rounded font-mono text-sm font-medium after:absolute after:inset-0 hover:text-primary", focusRing)}
                >
                  {repo.name}
                </a>
                <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{repo.description ?? m.openSource.noDescription}</p>
                <p className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
                  {repo.language ? (
                    <span className="flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: LANGUAGE_COLORS[repo.language] ?? "hsl(var(--muted))" }}
                      />
                      {repo.language}
                    </span>
                  ) : null}
                  <span className="flex items-center gap-1">
                    <Star aria-hidden="true" className="size-3.5" /> {repo.stars}
                    <span className="sr-only"> {m.openSource.starsSr}</span>
                  </span>
                </p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      ) : null}

      {profileButton}
    </div>
  );
}

function OpenSourceSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-label={label} className="flex w-full flex-col items-center gap-10">
      <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-[9.5rem] rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-11 w-56 rounded-lg" />
    </div>
  );
}
