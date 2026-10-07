"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { flipUp, inViewOnce } from "@/lib/motion/motion-presets";

export function ScaleIn({
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
      variants={flipUp}
      style={{ transformPerspective: 1000 }}
    >
      {children}
    </m.div>
  );
}
