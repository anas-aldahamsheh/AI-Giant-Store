import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Reveal({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "motion-safe:animate-[reveal_360ms_ease-out_both]",
        className,
      )}
      {...props}
    />
  );
}
