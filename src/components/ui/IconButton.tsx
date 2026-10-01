import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type IconButtonVariant = "primary" | "secondary" | "ghost";

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: ReactNode;
  variant?: IconButtonVariant;
};

const variantClasses: Record<IconButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "border border-border bg-surface text-foreground hover:bg-brand-50",
  ghost: "bg-transparent text-foreground hover:bg-muted",
};

export function IconButton({
  className,
  label,
  icon,
  variant = "secondary",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-button transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-55",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
