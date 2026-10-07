"use client";

import { AnimatePresence, m } from "framer-motion";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export type ModalProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  description?: string;
  footer?: ReactNode;
  className?: string;
};

export function Modal({
  isOpen,
  title,
  description,
  children,
  onClose,
  footer,
  className,
}: ModalProps) {
  return (
    <AnimatePresence>
    {isOpen ? (
    <m.div
      key="modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25, delay: 0.05 } }}
    >
      <m.section
        initial={{ opacity: 0, scale: 0.86, y: 40, rotateX: 18, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.92, y: 20, filter: "blur(6px)", transition: { duration: 0.22 } }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        style={{ transformPerspective: 1000 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? "modal-description" : undefined}
        className={cn(
          "max-h-[90vh] w-full max-w-lg overflow-auto rounded-card bg-surface shadow-soft",
          className,
        )}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold text-foreground">
              {title}
            </h2>
            {description ? (
              <p id="modal-description" className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </header>
        <div className="p-5">{children}</div>
        {footer ? <footer className="border-t border-border p-5">{footer}</footer> : null}
      </m.section>
    </m.div>
    ) : null}
    </AnimatePresence>
  );
}
