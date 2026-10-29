import { notFound } from "next/navigation";

/** Any path without a page: render the locale's 404 inside the site chrome. */
export default function CatchAll() {
  notFound();
}
