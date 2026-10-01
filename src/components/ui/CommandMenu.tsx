"use client";

import { SearchInput } from "@/components/ui/SearchInput";
import { cn } from "@/lib/utils/cn";

export type CommandMenuItem = {
  id: string;
  label: string;
  description?: string;
};

export type CommandMenuProps = {
  query: string;
  onQueryChange: (query: string) => void;
  items: CommandMenuItem[];
  onSelect: (item: CommandMenuItem) => void;
  emptyMessage?: string;
  className?: string;
};

export function CommandMenu({
  query,
  onQueryChange,
  items,
  onSelect,
  emptyMessage = "No results found.",
  className,
}: CommandMenuProps) {
  return (
    <section className={cn("rounded-card border border-border bg-surface p-3", className)}>
      <SearchInput
        label="Search commands"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <div className="mt-3 max-h-72 overflow-auto">
        {items.length > 0 ? (
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="w-full rounded-button px-3 py-2 text-left transition hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  onClick={() => onSelect(item)}
                >
                  <span className="block text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                  {item.description ? (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-3 text-sm text-muted-foreground">{emptyMessage}</p>
        )}
      </div>
    </section>
  );
}
