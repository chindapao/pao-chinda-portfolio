import { ArrowUpRight, FolderLock, GitFork, Star } from "lucide-react";
import { Suspense } from "react";

import { GitHubIcon } from "@/components/icons";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Container, SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PROFILE } from "@/content/profile";
import { getGitHubStats, LANGUAGE_COLORS } from "@/lib/github";
import { cn, focusRing, formatCount } from "@/lib/utils";

export function OpenSource() {
  return (
    <section id="open-source" aria-labelledby="oss-title" className="py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-12">
        <SectionHeading
          id="oss-title"
          align="center"
          eyebrow="05 · open source"
          title="Building in public."
          lede="Live from the GitHub API, refreshed every hour."
        />
        {/* Streams in after the shell; the skeleton has the same size as the cards, so nothing shifts. */}
        <Suspense fallback={<OpenSourceSkeleton />}>
          <OpenSourceContent />
        </Suspense>
      </Container>
    </section>
  );
}

async function OpenSourceContent() {
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
          <p className="text-lg font-semibold">Most of my work lives in private client repositories.</p>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {stats
              ? "Public repositories are on the way. Until then, the case studies above walk through the architecture and decisions in detail — happy to do a code walkthrough on a call."
              : "GitHub stats are taking a breather. The case studies above walk through the architecture and decisions in detail."}
          </p>
        </Card>
        {profileButton}
      </div>
    );
  }

  const cards = [
    { label: "Stars earned", value: formatCount(stats.stars), icon: Star },
    { label: "Public repos", value: formatCount(stats.publicRepos), icon: GitFork },
    {
      label: "Contributions this year",
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
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{repo.description ?? "No description yet."}</p>
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
                    <span className="sr-only"> stars</span>
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

function OpenSourceSkeleton() {
  return (
    <div role="status" aria-label="Loading GitHub stats" className="flex w-full flex-col items-center gap-10">
      <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-[9.5rem] rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-11 w-56 rounded-lg" />
    </div>
  );
}
