import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type SlideDirection = "up" | "down" | "left" | "right";

export type SlideInProps = HTMLAttributes<HTMLDivElement> & {
  direction?: SlideDirection;
};

const directionClasses: Record<SlideDirection, string> = {
  up: "motion-safe:animate-[slide-up_300ms_ease-out_both]",
  down: "motion-safe:animate-[slide-down_300ms_ease-out_both]",
  left: "motion-safe:animate-[slide-left_300ms_ease-out_both]",
  right: "motion-safe:animate-[slide-right_300ms_ease-out_both]",
};

export function SlideIn({ className, direction = "up", ...props }: SlideInProps) {
  return <div className={cn(directionClasses[direction], className)} {...props} />;
}
