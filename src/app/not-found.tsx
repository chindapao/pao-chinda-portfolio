import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/section-heading";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-dot-grid flex min-h-[70dvh] items-center pt-24">
      <Container className="flex flex-col items-start gap-6">
        <p className="font-mono text-sm text-danger">Error: ENOENT: no such file or directory</p>
        <h1 className="text-5xl font-extrabold sm:text-7xl">
          404<span className="text-primary">.</span>
        </h1>
        <p className="max-w-md text-lg font-light text-muted-foreground">This page was never committed — or it was rebased away.</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft aria-hidden="true" /> cd ~
          </Link>
        </Button>
      </Container>
    </div>
  );
}
