import { visibleOnly } from "@/lib/drafts";
import type { Testimonial } from "@/types";

/*
 * DRAFTS. These show the layout only. Replace each with a real quote you have permission to publish, then set
 * `draft: false`. Drafts are hidden on the production deployment (see `isDraftVisible`).
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Pao took a vague spreadsheet process and came back with a data model, an API contract and a working screen in the same week. Calm under deadline pressure.",
    name: "Team lead",
    role: "Fintech platform · replace with a real quote",
    draft: true,
  },
  {
    quote:
      "The payment flow just worked on launch day — every edge case we had worried about already had a test. Clear communicator, honest estimates.",
    name: "Product owner",
    role: "SaaS client · replace with a real quote",
    draft: true,
  },
  {
    quote:
      "Reviews from Pao teach you something: why the race condition exists, which ADR covers it, and the smallest fix. Our codebase is easier to work in because of Pao.",
    name: "Engineer",
    role: "Teammate · replace with a real quote",
    draft: true,
  },
];

export function visibleTestimonials(): Testimonial[] {
  return visibleOnly(TESTIMONIALS);
}
