"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { riseIn } from "@/lib/motion/motion-presets";

export function FadeUp({
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
      animate="visible"
      variants={riseIn}
    >
      {children}
    </m.div>
  );
}
