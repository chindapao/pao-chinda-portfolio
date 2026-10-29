import type { Locale } from "./config";
import { en, type Messages } from "./messages/en";
import { km } from "./messages/km";

export * from "./config";
export type { Messages };

const MESSAGES: Record<Locale, Messages> = { en, km };

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale];
}

/** Fills `{name}` placeholders. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** "2026-09" → "Sep 2026" / "កញ្ញា 2026" (no Date: deterministic for prerendering). */
export function formatMonth(m: Messages, yearMonth: string): string {
  const [year, month] = yearMonth.split("-");
  return `${m.months[Number(month) - 1] ?? ""} ${year}`.trim();
}

export function formatPeriod(m: Messages, period: { start: string; end?: string }): string {
  return `${formatMonth(m, period.start)} — ${period.end ? formatMonth(m, period.end) : m.common.now}`;
}
