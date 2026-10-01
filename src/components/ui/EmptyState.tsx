import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

export type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  action,
}: EmptyStateProps) {
  return (
    <section className="rounded-card border border-dashed border-border bg-surface p-8 text-center">
      {icon ? <div className="mx-auto mb-4 flex justify-center">{icon}</div> : null}
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {actionLabel && onAction ? (
        <Button type="button" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : action ? (
        <div className="mt-6 flex justify-center">{action}</div>
      ) : null}
    </section>
  );
}
