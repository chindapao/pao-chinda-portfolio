"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/client";

// Client component: not-found receives no params, so the locale comes from the I18nProvider in the layout.
export default function NotFound() {
  const { m, href } = useI18n();
  return (
    <div className="bg-dot-grid flex min-h-[70dvh] items-center pt-24">
      <Container className="flex flex-col items-start gap-6">
        <p className="font-mono text-sm text-danger">{m.notFound.error}</p>
        <h1 className="text-5xl font-extrabold sm:text-7xl">
          404<span className="text-primary">.</span>
        </h1>
        <p className="max-w-md text-lg font-light text-muted-foreground">{m.notFound.body}</p>
        <Button asChild>
          <Link href={href("/")}>
            <ArrowLeft aria-hidden="true" /> cd ~
          </Link>
        </Button>
      </Container>
    </div>
  );
}
