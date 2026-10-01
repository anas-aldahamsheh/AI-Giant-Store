import { useId } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export function Textarea({ id, label, error, hint, className, ...props }: TextareaProps) {
  const reactId = useId();
  const textareaId = id ?? (props.name ? `${props.name}-${reactId}` : reactId);
  const descriptionId = `${textareaId}-description`;

  return (
    <label className="block w-full space-y-2" htmlFor={textareaId}>
      {label ? (
        <span className="text-sm font-medium text-foreground">{label}</span>
      ) : null}
      <textarea
        id={textareaId}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? descriptionId : undefined}
        className={cn(
          "min-h-28 w-full rounded-button border bg-surface px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
          error ? "border-danger" : "border-border",
          className,
        )}
        {...props}
      />
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
