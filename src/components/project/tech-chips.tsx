import { Badge } from "@/components/ui/badge";
import { getTech } from "@/content/stack";
import { cn } from "@/lib/utils";

/** `icons={false}` for long lists (the journey): each inline SVG adds weight to the HTML and the RSC payload. */
export function TechChips({ ids, limit, className, icons = true }: { ids: string[]; limit?: number; className?: string; icons?: boolean }) {
  const shown = limit ? ids.slice(0, limit) : ids;
  const hidden = ids.length - shown.length;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {shown.map((id) => {
        const { name, icon: Icon } = getTech(id);
        return (
          <li key={id}>
            <Badge>
              {icons ? <Icon aria-hidden="true" /> : null}
              {name}
            </Badge>
          </li>
        );
      })}
      {hidden > 0 ? (
        <li>
          <Badge variant="outline">+{hidden}</Badge>
        </li>
      ) : null}
    </ul>
  );
}
