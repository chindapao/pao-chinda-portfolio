import { z } from "zod";

/**
 * The contact form schema — imported by the client form AND re-run by the route handler, so the browser can never be
 * the only gate.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Keep your name under 80 characters."),
  email: z.email("Please enter a valid email address.").trim().max(160, "That email is too long."),
  message: z
    .string()
    .trim()
    .min(20, "Tell me a little more — at least 20 characters.")
    .max(4000, "Keep the message under 4,000 characters."),
  /**
   * Honeypot: hidden from people, irresistible to bots. Accepted here (so a bot gets no validation hint) and checked in
   * the route handler, which silently drops the message when it is filled.
   */
  company: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Field errors keyed by field, in the shape the client form maps onto its inputs. */
export function fieldErrorsOf(error: z.ZodError<ContactInput>) {
  const { fieldErrors } = z.flattenError(error);
  return { name: fieldErrors.name, email: fieldErrors.email, message: fieldErrors.message };
}

/** Escape user text before it goes into the HTML email. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
