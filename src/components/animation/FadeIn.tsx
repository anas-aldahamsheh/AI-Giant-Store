import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function FadeIn({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("motion-safe:animate-[fade-in_220ms_ease-out_both]", className)}
      {...props}
    />
  );
}
