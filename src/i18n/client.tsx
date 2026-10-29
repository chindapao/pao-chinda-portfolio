"use client";

import { createContext, useContext } from "react";

import { type Locale, localePath } from "./config";
import type { Messages } from "./messages/en";

interface I18n {
  locale: Locale;
  m: Messages;
}

const I18nContext = createContext<I18n | null>(null);

/** Hands the current locale and its dictionary to client components (server components call `getMessages`). */
export function I18nProvider({ locale, messages, children }: { locale: Locale; messages: Messages; children: React.ReactNode }) {
  return <I18nContext.Provider value={{ locale, m: messages }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside <I18nProvider>");
  return { ...context, href: (path: string) => localePath(context.locale, path) };
}
