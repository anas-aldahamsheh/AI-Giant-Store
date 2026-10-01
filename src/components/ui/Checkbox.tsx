import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
  description?: string;
};

export function Checkbox({ label, description, className, ...props }: CheckboxProps) {
  return (
    <label className="flex items-start gap-3 text-sm text-foreground">
      <input
        type="checkbox"
        className={cn(
          "mt-0.5 h-4 w-4 rounded border-border text-brand-600 accent-[var(--brand-600)] focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
          className,
        )}
        {...props}
      />
      <span>
        <span className="block font-medium">{label}</span>
        {description ? (
          <span className="mt-1 block text-xs text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </label>
  );
}
