import { useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
};

export function Input({
  id,
  label,
  error,
  hint,
  leftIcon,
  rightSlot,
  className,
  ...props
}: InputProps) {
  const reactId = useId();
  const inputId = id ?? (props.name ? `${props.name}-${reactId}` : reactId);
  const descriptionId = `${inputId}-description`;

  return (
    <label className="block w-full space-y-2" htmlFor={inputId}>
      {label ? (
        <span className="text-sm font-medium text-foreground">{label}</span>
      ) : null}
      <span
        className={cn(
          "flex h-11 w-full items-center gap-2 rounded-button border bg-surface px-3 transition focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2",
          error ? "border-danger" : "border-border",
        )}
      >
        {leftIcon}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? descriptionId : undefined}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground",
            className,
          )}
          {...props}
        />
        {rightSlot}
      </span>
      {error || hint ? (
        <span
          id={descriptionId}
          className={cn("block text-xs", error ? "text-danger" : "text-muted-foreground")}
        >
          {error ?? hint}
        </span>
      ) : null}
    </label>
  );
}
