import Image from "next/image";

import type { Screenshot } from "@/types";

/** Real product screens on a case-study page. Below the fold, so next/image lazy-loads them; the ratio box prevents shift. */
export function ScreenshotGallery({ screenshots }: { screenshots: Screenshot[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {screenshots.map((shot, index) => (
        <li key={shot.src} className={index === 0 ? "sm:col-span-2" : undefined}>
          <figure className="flex flex-col gap-2">
            <div className="overflow-hidden rounded-lg border border-border bg-surface-raised">
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                sizes={index === 0 ? "(min-width: 1024px) 760px, 100vw" : "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"}
                className="h-auto w-full"
              />
            </div>
            <figcaption className="font-mono text-xs text-muted-foreground">{shot.alt}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
