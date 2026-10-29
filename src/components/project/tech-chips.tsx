import { Badge } from "@/components/ui/badge";
import { getTech } from "@/content/stack";
import { cn } from "@/lib/utils";

export function TechChips({ ids, limit, className }: { ids: string[]; limit?: number; className?: string }) {
  const shown = limit ? ids.slice(0, limit) : ids;
  const hidden = ids.length - shown.length;
  return (
    <ul aria-label="Tech stack" className={cn("flex flex-wrap gap-1.5", className)}>
      {shown.map((id) => {
        const { name, icon: Icon } = getTech(id);
        return (
          <li key={id}>
            <Badge>
              <Icon aria-hidden="true" />
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
