"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type AccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
};

export type AccordionProps = {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
};

export function Accordion({ items, defaultOpenId, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | undefined>(defaultOpenId);

  return (
    <div className={cn("divide-y divide-border rounded-card border border-border", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <section key={item.id}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 p-4 text-left text-sm font-semibold text-foreground transition hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-inset"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? undefined : item.id)}
            >
              {item.title}
              <span aria-hidden="true">{isOpen ? "-" : "+"}</span>
            </button>
            {isOpen ? <div className="p-4 pt-0 text-sm text-muted-foreground">{item.content}</div> : null}
          </section>
        );
      })}
    </div>
  );
}
