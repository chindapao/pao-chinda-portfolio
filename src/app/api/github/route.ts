import { getGitHubStats } from "@/lib/github";

/**
 * Public, cached GitHub stats. `getGitHubStats` is a `"use cache"` function with `cacheLife("hours")`, so this handler
 * serves the cached snapshot and refreshes it in the background — the token never leaves the server.
 */
export async function GET() {
  const stats = await getGitHubStats();
  if (!stats) {
    return Response.json({ error: "GitHub stats are temporarily unavailable." }, { status: 503 });
  }
  return Response.json(stats, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
