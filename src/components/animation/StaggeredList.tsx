import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type StaggeredListProps<TItem> = {
  items: TItem[];
  renderItem: (item: TItem, index: number) => ReactNode;
  getKey: (item: TItem, index: number) => string;
  className?: string;
};

export function StaggeredList<TItem>({
  items,
  renderItem,
  getKey,
  className,
}: StaggeredListProps<TItem>) {
  return (
    <div className={cn("grid gap-3", className)}>
      {items.map((item, index) => (
        <div
          key={getKey(item, index)}
          style={{ animationDelay: `${index * 45}ms` }}
          className="motion-safe:animate-[slide-up_260ms_ease-out_both]"
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
