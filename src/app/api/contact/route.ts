import { Resend } from "resend";

import { serverEnv } from "@/lib/env";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { contactSchema, escapeHtml, fieldErrorsOf } from "@/lib/validation";
import type { ContactResponse } from "@/types";

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 });
const MAX_BODY_BYTES = 16 * 1024;

function reply(status: number, body: ContactResponse, headers?: HeadersInit) {
  return Response.json(body, { status, headers });
}

export async function POST(request: Request) {
  // Same-origin only: browsers always send Origin on a cross-site POST.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) {
    return reply(403, { ok: false, message: "Cross-site requests are not allowed." });
  }

  const limit = limiter(clientIp(request.headers));
  if (!limit.allowed) {
    return reply(
      429,
      { ok: false, message: `Too many messages. Please try again in ${Math.ceil(limit.retryAfter / 60)} minutes.` },
      { "Retry-After": String(limit.retryAfter) },
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return reply(413, { ok: false, message: "That message is too large." });

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return reply(400, { ok: false, message: "Invalid request." });
  }

  // Validate again on the server: the client schema is a convenience, this is the gate.
  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return reply(422, { ok: false, message: "Please fix the highlighted fields.", fieldErrors: fieldErrorsOf(parsed.error) });
  }

  const { name, email, message, company } = parsed.data;
  const thanks = "I'll get back to you within one working day.";

  // Honeypot filled: pretend success so the bot learns nothing, send nothing.
  if (company) return reply(200, { ok: true, message: thanks });

  if (!serverEnv.RESEND_API_KEY || !serverEnv.CONTACT_EMAIL) {
    console.error("[contact] RESEND_API_KEY or CONTACT_EMAIL is not configured");
    return reply(503, { ok: false, message: "The contact form is not configured yet — please reach out on GitHub instead." });
  }

  const resend = new Resend(serverEnv.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: serverEnv.CONTACT_FROM,
    to: serverEnv.CONTACT_EMAIL,
    replyTo: email,
    subject: `Portfolio: message from ${name.slice(0, 60)}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
  });

  if (error) {
    // Log the provider error, never the visitor's message.
    console.error("[contact] Resend error:", error.name, error.message);
    return reply(502, { ok: false, message: "The email service didn't accept the message. Please try again shortly." });
  }

  return reply(200, { ok: true, message: thanks });
}
