/**
 * Draft content (unconfirmed roles, placeholder quotes) renders in `next dev` and on Vercel preview deployments —
 * with a DRAFT badge — and never in a production build, so a placeholder cannot reach a recruiter.
 */
export function isDraftVisible(): boolean {
  return process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";
}

export function visibleOnly<T extends { draft: boolean }>(items: T[]): T[] {
  const showDrafts = isDraftVisible();
  return items.filter((item) => showDrafts || !item.draft);
}
