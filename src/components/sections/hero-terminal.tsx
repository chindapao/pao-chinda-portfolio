"use client";

import { Terminal } from "lucide-react";
import { AnimatePresence, m as motion } from "motion/react";
import { useState } from "react";

import { PROJECTS } from "@/content/projects";
import { useI18n } from "@/i18n/client";
import { cn, focusRing } from "@/lib/utils";

/*
 * The playful bit: a tiny "terminal" whose commands are real buttons. Output is announced politely to screen readers,
 * and every line is plain text, so nothing here is a toy for keyboard or assistive-tech users.
 */

type Token = { text: string; kind?: "keyword" | "string" | "property" | "literal" | "comment" | "punct" | "prompt" };
type Line = Token[];

const TOKEN_CLASS: Record<NonNullable<Token["kind"]>, string> = {
  keyword: "text-syntax-keyword",
  string: "text-syntax-string",
  property: "text-syntax-property",
  literal: "text-syntax-literal",
  comment: "text-syntax-comment italic",
  punct: "text-muted-foreground",
  prompt: "text-primary",
};

const s = (text: string): Token => ({ text: `"${text}"`, kind: "string" });
const p = (text: string): Token => ({ text, kind: "punct" });

const COMMANDS: { id: string; label: string; output: Line[] }[] = [
  {
    id: "cat",
    label: "cat pao.ts",
    output: [
      [{ text: "const ", kind: "keyword" }, { text: "pao" }, p(" = {")],
      [{ text: "  role", kind: "property" }, p(": "), s("Full-Stack Dev"), p(",")],
      [{ text: "  stack", kind: "property" }, p(": ["), s("Next.js"), p(", "), s("Spring"), p(", "), s("TS"), p("],")],
      [{ text: "  basedIn", kind: "property" }, p(": "), s("Phnom Penh"), p(",")],
      [{ text: "  open", kind: "property" }, p(": "), { text: "true", kind: "literal" }, p(",")],
      [p("};")],
    ],
  },
  {
    id: "ls",
    label: "ls projects/",
    output: [
      ...PROJECTS.filter((project) => project.featured).map((project): Line => [
        { text: "★ ", kind: "literal" },
        { text: project.slug.padEnd(14) },
        { text: `# ${project.category.toLowerCase()}`, kind: "comment" },
      ]),
      [{ text: `+ ${PROJECTS.filter((project) => !project.featured).length} more in /projects`, kind: "comment" }],
    ],
  },
  {
    id: "log",
    label: "git log --oneline",
    output: [
      [{ text: "a1f9c3e ", kind: "literal" }, { text: "feat: payments verified by provider, never the client" }],
      [{ text: "7b2e0d4 ", kind: "literal" }, { text: "feat: tenant isolation + operator 2FA" }],
      [{ text: "c4d81aa ", kind: "literal" }, { text: "fix: no overbooking (atomic UPDATE)" }],
      [{ text: "e09b7f1 ", kind: "literal" }, { text: "chore: AI key lives in the worker only" }],
    ],
  },
  {
    id: "hire",
    label: "npm run hire",
    output: [
      [{ text: "> ", kind: "prompt" }, { text: "checking availability…" }],
      [{ text: "✔ ", kind: "prompt" }, { text: "2–3 slots open · replies within 1 working day" }],
      [{ text: "→ ", kind: "prompt" }, { text: "/contact", kind: "string" }],
    ],
  },
];

export function HeroTerminal() {
  const { m } = useI18n();
  const [active, setActive] = useState(COMMANDS[0]!.id);
  const command = COMMANDS.find((c) => c.id === active) ?? COMMANDS[0]!;

  return (
    // The float pauses under the pointer / keyboard focus, so the command buttons are still targets.
    <div className="relative motion-safe:animate-float hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
      {/* The soft green glow behind the window. */}
      <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/15 blur-3xl" />
      <figure
        aria-label={m.hero.terminal}
        className="overflow-hidden rounded-xl border border-border-strong bg-surface shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.35)]"
      >
        <div className="flex items-center gap-2 border-b border-border bg-surface-raised px-4 py-3">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-3 rounded-full bg-muted/60" />
            <span className="size-3 rounded-full bg-muted/60" />
            <span className="size-3 rounded-full bg-primary/80" />
          </span>
          <span className="ml-2 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <Terminal aria-hidden="true" className="size-3.5" /> ~/pao — zsh
          </span>
        </div>

        <div className="min-h-[15.5rem] p-4 font-mono text-[0.8rem] leading-6 sm:p-5 sm:text-sm">
          <p>
            <span className="text-primary">➜</span> <span className="text-syntax-property">~</span>{" "}
            <span>{command.label}</span>
          </p>
          <div aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.pre
                key={command.id}
                className="mt-1 overflow-x-auto font-mono whitespace-pre"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {command.output.map((line, index) => (
                  <span key={index} className="block">
                    {line.map((token, i) => (
                      <span key={i} className={token.kind ? TOKEN_CLASS[token.kind] : undefined}>
                        {token.text}
                      </span>
                    ))}
                  </span>
                ))}
              </motion.pre>
            </AnimatePresence>
          </div>
          <p className="mt-1">
            <span className="text-primary">➜</span> <span className="text-syntax-property">~</span>{" "}
            <span aria-hidden="true" className="inline-block h-4 w-2 translate-y-0.5 animate-blink bg-primary" />
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 border-t border-border bg-surface-raised/60 px-3 py-3" role="group" aria-label={m.hero.runCommand}>
          {COMMANDS.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={c.id === active}
              onClick={() => setActive(c.id)}
              className={cn(
                "rounded-md border px-2.5 py-1.5 font-mono text-[0.7rem] transition-colors sm:text-xs",
                c.id === active
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
                focusRing,
              )}
            >
              $ {c.label}
            </button>
          ))}
        </div>
      </figure>
    </div>
  );
}
