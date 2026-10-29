"use client";

import { RotateCcw } from "lucide-react";

import { Container } from "@/components/section-heading";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[70dvh] items-center pt-24">
      <Container className="flex flex-col items-start gap-6">
        <p className="font-mono text-sm text-danger">Unhandled exception</p>
        <h1 className="text-4xl font-extrabold sm:text-5xl">Something broke on my side.</h1>
        <p className="max-w-md text-lg font-light text-muted-foreground">It&apos;s been logged. Try again — it usually works the second time.</p>
        <Button onClick={reset}>
          <RotateCcw aria-hidden="true" /> Try again
        </Button>
      </Container>
    </div>
  );
}
