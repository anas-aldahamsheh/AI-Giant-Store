import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function FloatingCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-surface shadow-soft motion-safe:animate-[float_4s_ease-in-out_infinite]",
        className,
      )}
      {...props}
    />
  );
}
