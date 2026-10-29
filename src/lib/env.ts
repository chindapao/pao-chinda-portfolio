import "server-only";

import { z } from "zod";

/**
 * Server-only environment. `server-only` makes importing this from a client component a build error, so the keys can
 * never end up in the browser bundle. Every variable is optional: the site builds and runs without them, and the
 * features that need one degrade with a clear message.
 */
const serverEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_EMAIL: z.email().optional(),
  /** Verified Resend sender, e.g. `Portfolio <hello@your-domain.dev>`. Resend's shared sender works for testing. */
  CONTACT_FROM: z.string().min(3).default("Portfolio <onboarding@resend.dev>"),
  GITHUB_USERNAME: z.string().min(1).default("chindapao"),
  GITHUB_TOKEN: z.string().min(1).optional(),
});

const empty = (value: string | undefined) => (value === "" ? undefined : value);

/** True when the contact form can actually deliver email (both Resend values are set). */
export function isContactConfigured(): boolean {
  return Boolean(serverEnv.RESEND_API_KEY && serverEnv.CONTACT_EMAIL);
}

export const serverEnv = serverEnvSchema.parse({
  RESEND_API_KEY: empty(process.env.RESEND_API_KEY),
  CONTACT_EMAIL: empty(process.env.CONTACT_EMAIL),
  CONTACT_FROM: empty(process.env.CONTACT_FROM),
  GITHUB_USERNAME: empty(process.env.GITHUB_USERNAME),
  GITHUB_TOKEN: empty(process.env.GITHUB_TOKEN),
});
