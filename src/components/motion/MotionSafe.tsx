"use client";

import { LazyMotion, MotionConfig, domMax } from "framer-motion";
import type { ReactNode } from "react";
import { MotionDirector } from "@/components/motion/MotionDirector";

export function MotionSafe({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        <div>{children}</div>
        <MotionDirector />
      </MotionConfig>
    </LazyMotion>
  );
}
