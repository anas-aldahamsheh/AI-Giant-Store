import type { ReactNode } from "react";

export type AnimatedPageTransitionProps = {
  children: ReactNode;
};

export function AnimatedPageTransition({ children }: AnimatedPageTransitionProps) {
  return <div className="motion-safe:animate-[fade-in_220ms_ease-out_both]">{children}</div>;
}
