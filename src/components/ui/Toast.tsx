import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ToastVariant = "info" | "success" | "warning" | "danger";

export type ToastProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  variant?: ToastVariant;
  className?: string;
};

const variantClasses: Record<ToastVariant, string> = {
  info: "border-brand-100 bg-brand-50 text-brand-700",
  success: "border-green-100 bg-green-50 text-green-700",
  warning: "border-amber-100 bg-amber-50 text-amber-800",
  danger: "border-red-100 bg-red-50 text-red-700",
};

export function Toast({
  title,
  description,
  icon,
  variant = "info",
  className,
}: ToastProps) {
  return (
    <section
      role="status"
      className={cn(
        "flex w-full max-w-sm items-start gap-3 rounded-card border p-4 shadow-soft",
        variantClasses[variant],
        className,
      )}
    >
      {icon ? <div aria-hidden="true">{icon}</div> : null}
      <div>
        <p className="text-sm font-semibold">{title}</p>
        {description ? <p className="mt-1 text-sm opacity-85">{description}</p> : null}
      </div>
    </section>
  );
}
