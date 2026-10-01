"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

export function MotionSafe({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <div data-reduced-motion="false">{children}</div>
    </LazyMotion>
  );
}
