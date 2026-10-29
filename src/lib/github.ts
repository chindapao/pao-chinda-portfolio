import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { serverEnv } from "@/lib/env";
import type { GitHubRepo, GitHubStats } from "@/types";

const API = "https://api.github.com";

interface RestUser {
  public_repos: number;
}

interface RestRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
}

function headers(): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "pao-chinda-portfolio",
    ...(serverEnv.GITHUB_TOKEN ? { Authorization: `Bearer ${serverEnv.GITHUB_TOKEN}` } : {}),
  };
}

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { ...headers(), ...init?.headers } });
  if (!response.ok) throw new Error(`GitHub ${response.status} for ${new URL(url).pathname}`);
  return (await response.json()) as T;
}

/** Contributions need the GraphQL API, which requires a token. Without one the stat shows "—". */
async function contributionsThisYear(username: string, year: number): Promise<number | null> {
  if (!serverEnv.GITHUB_TOKEN) return null;
  const query = `query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) { contributionsCollection(from: $from, to: $to) { contributionCalendar { totalContributions } } }
  }`;
  const body = await getJson<{
    data?: { user?: { contributionsCollection: { contributionCalendar: { totalContributions: number } } } };
  }>(`${API}/graphql`, {
    method: "POST",
    body: JSON.stringify({
      query,
      variables: { login: username, from: `${year}-01-01T00:00:00Z`, to: `${year}-12-31T23:59:59Z` },
    }),
  });
  return body.data?.user?.contributionsCollection.contributionCalendar.totalContributions ?? null;
}

function toRepo(repo: RestRepo): GitHubRepo {
  return {
    name: repo.name,
    description: repo.description,
    htmlUrl: repo.html_url,
    language: repo.language,
    stars: repo.stargazers_count,
  };
}

/**
 * Open-source stats, cached for hours (the Cache Components form of ISR): the page and `/api/github` serve the cached
 * result and refresh it in the background. Returns `null` when GitHub is unreachable or rate-limited; that result is
 * cached for minutes only, so a blip heals quickly.
 */
export async function getGitHubStats(): Promise<GitHubStats | null> {
  "use cache";
  cacheTag("github");
  const username = serverEnv.GITHUB_USERNAME;
  try {
    const [user, repos] = await Promise.all([
      getJson<RestUser>(`${API}/users/${encodeURIComponent(username)}`),
      getJson<RestRepo[]>(`${API}/users/${encodeURIComponent(username)}/repos?per_page=100&type=owner&sort=pushed`),
    ]);
    const fetchedAt = new Date();
    const own = repos.filter((repo) => !repo.fork);
    const contributions = await contributionsThisYear(username, fetchedAt.getUTCFullYear()).catch(() => null);
    cacheLife("hours");
    return {
      username,
      stars: own.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      publicRepos: user.public_repos,
      contributionsThisYear: contributions,
      topRepos: own
        .filter((repo) => !repo.archived)
        .sort((a, b) => b.stargazers_count - a.stargazers_count || b.pushed_at.localeCompare(a.pushed_at))
        .slice(0, 3)
        .map(toRepo),
      fetchedAt: fetchedAt.toISOString(),
    };
  } catch (error) {
    console.warn("[github] stats unavailable:", error instanceof Error ? error.message : error);
    cacheLife("minutes");
    return null;
  }
}

/** Language dot colours for the repo cards — GitHub's own linguist colours (data, not UI chrome). */
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Java: "#b07219",
  Kotlin: "#a97bff",
  Python: "#3572a5",
  Go: "#00add8",
  Rust: "#dea584",
  CSS: "#663399",
  HTML: "#e34c26",
  Shell: "#89e051",
  Dockerfile: "#384d54",
};
