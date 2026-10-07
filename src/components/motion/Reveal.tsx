"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { inViewOnce, riseIn } from "@/lib/motion/motion-presets";

export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <m.div
      data-fx-manual
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
      variants={riseIn}
    >
      {children}
    </m.div>
  );
}
