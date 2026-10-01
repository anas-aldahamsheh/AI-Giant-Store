import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function ScaleIn({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("motion-safe:animate-[scale-in_220ms_ease-out_both]", className)}
      {...props}
    />
  );
}
