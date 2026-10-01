"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

export type TabsProps = {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
};

export function Tabs({ items, activeId, onChange, className }: TabsProps) {
  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <section className={className}>
      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-border">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeItem.id === item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              "whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
              activeItem.id === item.id
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="pt-5">
        {activeItem.content}
      </div>
    </section>
  );
}
