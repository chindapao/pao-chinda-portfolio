import { z } from "zod";

/**
 * The contact form schema — imported by the client form AND re-run by the route handler, so the browser can never be
 * the only gate. Messages are keys into `messages.contact.errors`, so the client shows them in the visitor's language
 * whichever side produced them.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "nameShort").max(80, "nameLong"),
  email: z.email("emailInvalid").trim().max(160, "emailLong"),
  message: z.string().trim().min(20, "messageShort").max(4000, "messageLong"),
  /**
   * Honeypot: hidden from people, irresistible to bots. Accepted here (so a bot gets no validation hint) and checked in
   * the route handler, which silently drops the message when it is filled.
   */
  company: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactErrorKey = "nameShort" | "nameLong" | "emailInvalid" | "emailLong" | "messageShort" | "messageLong";

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
