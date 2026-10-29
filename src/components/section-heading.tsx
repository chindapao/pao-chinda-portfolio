import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * Every section opens the same way: a mono "file path" eyebrow, a display heading, an optional lede. Consistency here is
 * most of what makes the site feel like one product.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  lede,
  align = "left",
  as: Heading = "h2",
}: {
  id?: string;
  /** e.g. "02 · projects" — rendered as `// 02 · projects`. */
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <Reveal
      as="header"
      className={cn("flex max-w-2xl flex-col gap-4", align === "center" && "mx-auto items-center text-center")}
    >
      <p className="font-mono text-xs font-medium tracking-widest text-primary uppercase">
        <span className="text-syntax-comment">{"// "}</span>
        {eyebrow}
      </p>
      <Heading id={id} className="text-3xl leading-[1.08] font-extrabold sm:text-4xl lg:text-5xl">
        {title}
      </Heading>
      {lede ? <p className="text-base leading-relaxed font-light text-muted-foreground sm:text-lg">{lede}</p> : null}
    </Reveal>
  );
}

/** Page-width container used by every section. */
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}
