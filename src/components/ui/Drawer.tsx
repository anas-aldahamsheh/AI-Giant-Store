"use client";

import type { ReactNode } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

type DrawerSide = "left" | "right" | "bottom";

export type DrawerProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  side?: DrawerSide;
  description?: string;
  className?: string;
};

const sideClasses: Record<DrawerSide, string> = {
  left: "left-0 top-0 h-full w-full max-w-md",
  right: "right-0 top-0 h-full w-full max-w-md",
  bottom: "bottom-0 left-0 max-h-[85vh] w-full",
};

export function Drawer({
  isOpen,
  title,
  description,
  children,
  onClose,
  side = "right",
  className,
}: DrawerProps) {
  const offscreen =
    side === "left"
      ? { x: "-100%" }
      : side === "bottom"
        ? { y: "100%" }
        : { x: "100%" };

  return (
    <AnimatePresence>
      {isOpen ? (
        <m.div
          key="drawer"
          className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.1 } }}
        >
          <m.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            aria-describedby={description ? "drawer-description" : undefined}
            className={cn(
              "fixed overflow-auto bg-surface shadow-premium",
              side === "bottom" ? "rounded-t-card" : "",
              sideClasses[side],
              className,
            )}
            initial={{ ...offscreen, opacity: 0.6 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={{ ...offscreen, opacity: 0.6 }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div>
                <h2 id="drawer-title" className="text-lg font-semibold text-foreground">
                  {title}
                </h2>
                {description ? (
                  <p
                    id="drawer-description"
                    className="mt-1 text-sm text-muted-foreground"
                  >
                    {description}
                  </p>
                ) : null}
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
            </header>
            <m.div
              className="p-5"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </m.div>
          </m.aside>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
